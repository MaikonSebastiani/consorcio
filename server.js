const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const CONFIG = require("./config.js");
const { erroCelular } = require("./ui.js");

const SENHA = process.env.CRM_SENHA;
if (!SENHA) {
  console.error("Defina CRM_SENHA no arquivo .env antes de iniciar.");
  process.exit(1);
}

const PORTA = Number(process.env.PORT) || 4173;
const PRODUCAO = process.env.NODE_ENV === "production";
const CONFIAR_PROXY = process.env.TRUST_PROXY === "1";
const BANCO = process.env.CRM_BANCO || path.join(__dirname, "dados", "crm.sqlite");
const SESSAO_MS = 12 * 60 * 60 * 1000;
const STATUS = ["novo", "contato", "negociando", "vendido", "perdido"];
const PRODUTOS = ["carro", "imovel"];

// Só estes arquivos são públicos: o banco e o .env nunca são servidos.
const ARQUIVOS = {
  "/config.js": ["config.js", "text/javascript; charset=utf-8"],
  "/ui.js": ["ui.js", "text/javascript; charset=utf-8"],
  "/estilo.css": ["estilo.css", "text/css; charset=utf-8"],
  "/crm": ["crm.html", "text/html; charset=utf-8"],
  "/img/hero-carro.webp": ["img/hero-carro.webp", "image/webp"],
  "/img/hero-imovel.webp": ["img/hero-imovel.webp", "image/webp"],
};

const PAGINAS = {
  "/": {
    arquivo: "index.html",
    titulo: "Consórcio de carro e imóvel com estratégia de lance",
    descricao: "Simule consórcio de carro ou imóvel, compare com financiamento e receba uma estratégia de lance personalizada. Sem compromisso.",
  },
  "/carro": {
    arquivo: "funil.html",
    conteudo: "conteudo-carro.html",
    imagem: "/img/hero-carro.webp",
    titulo: "Consórcio de carro: simule parcela e estratégia de lance",
    descricao: "Simule seu consórcio de carro, compare com o financiamento e receba uma estratégia de lance personalizada em 60 segundos.",
  },
  "/imovel": {
    arquivo: "funil.html",
    conteudo: "conteudo-imovel.html",
    imagem: "/img/hero-imovel.webp",
    titulo: "Consórcio de imóvel: simule parcela e estratégia de lance",
    descricao: "Simule seu consórcio de imóvel, veja quanto a espera pesa no bolso e receba uma estratégia de lance personalizada em 60 segundos.",
  },
  "/privacidade": {
    arquivo: "privacidade.html",
    titulo: "Política de privacidade",
    descricao: "Saiba quais dados este site coleta, para que usa e como pedir a exclusão.",
  },
};

const escapar = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const lerArquivo = nome => fs.readFileSync(path.join(__dirname, nome), "utf8");

function metaTags(rota, { titulo, descricao, imagem }) {
  const nome = escapar(CONFIG.consultor);
  const tags = [
    `<title>${escapar(titulo)} | ${nome}</title>`,
    `<meta name="description" content="${escapar(descricao)}">`,
    `<meta property="og:title" content="${escapar(titulo)}">`,
    `<meta property="og:description" content="${escapar(descricao)}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="pt_BR">',
  ];
  if (imagem) tags.push(`<link rel="preload" as="image" href="${imagem}">`);
  if (imagem && CONFIG.siteUrl) tags.push(`<meta property="og:image" content="${escapar(CONFIG.siteUrl + imagem)}">`);
  // Enquanto os dados forem de exemplo, o Google não deve indexar o site.
  if (CONFIG.modoExemplo) tags.push('<meta name="robots" content="noindex">');
  if (CONFIG.siteUrl) tags.push(`<link rel="canonical" href="${escapar(CONFIG.siteUrl + (rota === "/" ? "" : rota))}">`);
  return tags.join("\n");
}

function rodape() {
  const contatos = [CONFIG.email, CONFIG.telefone].filter(Boolean).map(escapar).join(" · ");
  const documento = CONFIG.documento ? ` · ${escapar(CONFIG.documento)}` : "";
  return `<footer class="rodape"><div>
  <p><strong>${escapar(CONFIG.consultor)}</strong>${documento} · Consultor ${escapar(CONFIG.administradora)}${contatos ? ` · ${contatos}` : ""}</p>
  <p>Consórcio administrado pela ${escapar(CONFIG.administradora)}. Simulações são estimativas. A contemplação ocorre por sorteio ou lance e não tem data garantida.</p>
  <p><a href="/privacidade">Política de privacidade</a></p>
</div></footer>`;
}

function renderizar(rota) {
  const pagina = PAGINAS[rota];
  const contato = [CONFIG.email, CONFIG.telefone].filter(Boolean).map(escapar).join(" ou ");
  const valores = {
    meta: metaTags(rota, pagina),
    aviso: CONFIG.modoExemplo ? '<div class="aviso-exemplo">DEMONSTRAÇÃO: taxas e grupos de exemplo. Não divulgue esta versão.</div>' : "",
    conteudo: pagina.conteudo ? lerArquivo(pagina.conteudo) : "",
    rodape: rodape(),
    consultor: escapar(CONFIG.consultor),
    administradora: escapar(CONFIG.administradora),
    documentoTexto: CONFIG.documento ? `, ${escapar(CONFIG.documento)}` : "",
    contatoPrivacidade: contato || "[preencher e-mail ou telefone em config.js]",
  };
  return lerArquivo(pagina.arquivo).replace(/\{\{(\w+)\}\}/g, (_, chave) => valores[chave] ?? "");
}

function robots() {
  const mapa = CONFIG.siteUrl ? `\nSitemap: ${CONFIG.siteUrl}/sitemap.xml` : "";
  return `User-agent: *\nDisallow: /crm\nDisallow: /api/${mapa}\n`;
}

function sitemap() {
  const urls = Object.keys(PAGINAS).map(rota => `<url><loc>${escapar(CONFIG.siteUrl + (rota === "/" ? "" : rota))}</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

fs.mkdirSync(path.dirname(BANCO), { recursive: true });
const db = new DatabaseSync(BANCO);
const COLUNAS_LEAD = `(
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  motivo TEXT NOT NULL,
  valor INTEGER NOT NULL,
  parcela INTEGER NOT NULL,
  parcela_estimada INTEGER NOT NULL,
  reserva TEXT NOT NULL,
  quando TEXT NOT NULL,
  temperatura TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo',
  notas TEXT NOT NULL DEFAULT '',
  consentimento_em TEXT NOT NULL,
  criado_em TEXT NOT NULL,
  atualizado_em TEXT NOT NULL,
  aluguel INTEGER NOT NULL DEFAULT 0,
  UNIQUE (whatsapp, objetivo)
)`;
db.exec(`CREATE TABLE IF NOT EXISTS leads ${COLUNAS_LEAD}`);

// Bancos antigos guardavam um lead por telefone; agora é um por telefone e produto.
if (!db.prepare("PRAGMA table_info(leads)").all().some(c => c.name === "aluguel")) {
  const campos = "id, nome, whatsapp, objetivo, motivo, valor, parcela, parcela_estimada, reserva, quando, temperatura, status, notas, consentimento_em, criado_em, atualizado_em";
  db.exec(`BEGIN;
    CREATE TABLE leads_novo ${COLUNAS_LEAD};
    INSERT INTO leads_novo (${campos}) SELECT ${campos} FROM leads;
    DROP TABLE leads;
    ALTER TABLE leads_novo RENAME TO leads;
    COMMIT;`);
}

// Quem refaz a simulação atualiza o lead existente e mantém status e anotações.
const salvarLead = db.prepare(`INSERT INTO leads
  (nome, whatsapp, objetivo, motivo, valor, parcela, parcela_estimada, reserva, quando, temperatura, aluguel, consentimento_em, criado_em, atualizado_em)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(whatsapp, objetivo) DO UPDATE SET
    nome = excluded.nome, motivo = excluded.motivo, valor = excluded.valor, parcela = excluded.parcela,
    parcela_estimada = excluded.parcela_estimada, reserva = excluded.reserva, quando = excluded.quando,
    temperatura = excluded.temperatura, aluguel = excluded.aluguel, consentimento_em = excluded.consentimento_em, atualizado_em = excluded.atualizado_em`);
const listarLeads = db.prepare("SELECT * FROM leads ORDER BY atualizado_em DESC");
const atualizarLead = db.prepare("UPDATE leads SET status = ?, notas = ?, atualizado_em = ? WHERE id = ?");
const buscarLead = db.prepare("SELECT * FROM leads WHERE id = ?");
const apagarLead = db.prepare("DELETE FROM leads WHERE id = ?");

const sessoes = new Map();
const tentativas = new Map();

function excedeuLimite(chave, maximo) {
  const agora = Date.now();
  const registro = tentativas.get(chave);
  if (!registro || registro.fim < agora) {
    if (tentativas.size > 10000) tentativas.clear();
    tentativas.set(chave, { total: 1, fim: agora + 60000 });
    return false;
  }
  registro.total += 1;
  return registro.total > maximo;
}

function ip(req) {
  const encaminhado = CONFIAR_PROXY && req.headers["x-forwarded-for"];
  return encaminhado ? encaminhado.split(",")[0].trim() : req.socket.remoteAddress;
}

function json(res, codigo, dados, cabecalhos = {}) {
  res.writeHead(codigo, { "Content-Type": "application/json; charset=utf-8", ...cabecalhos });
  res.end(JSON.stringify(dados));
}

function lerJson(req) {
  return new Promise((resolve, reject) => {
    if (!(req.headers["content-type"] || "").startsWith("application/json")) return reject(new Error("tipo"));
    let corpo = "";
    req.on("data", parte => {
      corpo += parte;
      if (corpo.length > 10000) { reject(new Error("tamanho")); req.destroy(); }
    });
    req.on("end", () => {
      try { resolve(JSON.parse(corpo)); } catch { reject(new Error("json")); }
    });
    req.on("error", reject);
  });
}

function autenticado(req) {
  const cookie = (req.headers.cookie || "").split(/;\s*/).find(c => c.startsWith("crm="));
  if (!cookie) return false;
  const token = cookie.slice(4);
  const fim = sessoes.get(token);
  if (!fim || fim < Date.now()) { sessoes.delete(token); return false; }
  return true;
}

function senhaCorreta(tentativa) {
  const hash = v => crypto.createHash("sha256").update(String(v)).digest();
  return crypto.timingSafeEqual(hash(tentativa), hash(SENHA));
}

function parcelaEstimada(objetivo, valor) {
  const c = CONFIG[objetivo].consorcio;
  return Math.round(valor * (1 + c.taxaAdministracao + c.fundoReserva) / c.prazoMeses);
}

// Prioriza quem tem pressa, reserva para lance e orçamento compatível.
function temperatura({ quando, reserva, parcela }, estimada) {
  let pontos = 0;
  if (quando === "em até 6 meses") pontos += 2;
  if (quando === "em 6 a 12 meses") pontos += 1;
  if (reserva !== "nenhum") pontos += 2;
  if (parcela >= estimada) pontos += 1;
  return pontos >= 4 ? "quente" : pontos >= 2 ? "morno" : "frio";
}

function leadValido(l) {
  const texto = (v, max) => typeof v === "string" && v.trim().length >= 2 && v.length <= max;
  return PRODUTOS.includes(l.objetivo) && texto(l.nome, 80) && l.consentimento === true
    && texto(l.motivo, 60) && texto(l.reserva, 60) && texto(l.quando, 60)
    && Number.isInteger(l.valor) && l.valor > 0 && l.valor <= 5000000
    && Number.isInteger(l.parcela) && l.parcela > 0 && l.parcela <= 100000
    && (l.aluguel === undefined || (Number.isInteger(l.aluguel) && l.aluguel >= 0 && l.aluguel <= 100000));
}

async function receberLead(req, res) {
  if (excedeuLimite(`lead:${ip(req)}`, 10)) return json(res, 429, { erro: "Muitas tentativas. Aguarde um minuto." });
  const l = await lerJson(req);
  if (l.site) return json(res, 201, { ok: true }); // Campo invisível preenchido: robô.
  const problemaCelular = erroCelular(l.whatsapp);
  if (problemaCelular) return json(res, 400, { erro: problemaCelular });
  if (!leadValido(l)) return json(res, 400, { erro: "Dados inválidos." });
  const agora = new Date().toISOString();
  const estimada = parcelaEstimada(l.objetivo, l.valor);
  salvarLead.run(l.nome.trim(), l.whatsapp, l.objetivo, l.motivo, l.valor, l.parcela, estimada, l.reserva, l.quando,
    temperatura(l, estimada), l.aluguel ?? 0, agora, agora, agora);
  json(res, 201, { ok: true });
}

async function entrar(req, res) {
  if (excedeuLimite(`login:${ip(req)}`, 5)) return json(res, 429, { erro: "Muitas tentativas. Aguarde um minuto." });
  const { senha } = await lerJson(req);
  if (!senhaCorreta(senha)) return json(res, 401, { erro: "Senha incorreta." });
  const token = crypto.randomBytes(32).toString("hex");
  sessoes.set(token, Date.now() + SESSAO_MS);
  const seguro = PRODUCAO ? "; Secure" : "";
  json(res, 200, { ok: true }, { "Set-Cookie": `crm=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSAO_MS / 1000}${seguro}` });
}

async function editarLead(req, res, id) {
  const atual = buscarLead.get(id);
  if (!atual) return json(res, 404, { erro: "Lead não encontrado." });
  const { status = atual.status, notas = atual.notas } = await lerJson(req);
  if (!STATUS.includes(status) || typeof notas !== "string" || notas.length > 2000) return json(res, 400, { erro: "Dados inválidos." });
  atualizarLead.run(status, notas, new Date().toISOString(), id);
  json(res, 200, buscarLead.get(id));
}

async function rotear(req, res) {
  const pathname = new URL(req.url, "http://localhost").pathname.replace(/\/+$/, "") || "/";
  const rota = `${req.method} ${pathname}`;

  if (req.method === "GET" && PAGINAS[pathname]) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    return res.end(renderizar(pathname));
  }
  if (req.method === "GET" && ARQUIVOS[pathname]) {
    const [arquivo, tipo] = ARQUIVOS[pathname];
    res.writeHead(200, { "Content-Type": tipo, "Cache-Control": "no-cache" });
    return res.end(fs.readFileSync(path.join(__dirname, arquivo)));
  }
  if (rota === "GET /robots.txt") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(robots());
  }
  if (rota === "GET /sitemap.xml" && CONFIG.siteUrl) {
    res.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" });
    return res.end(sitemap());
  }
  if (rota === "POST /api/leads") return receberLead(req, res);
  if (rota === "POST /api/login") return entrar(req, res);

  if (pathname.startsWith("/api/")) {
    if (!autenticado(req)) return json(res, 401, { erro: "Faça login." });
    if (rota === "GET /api/leads") return json(res, 200, listarLeads.all());
    if (rota === "POST /api/logout") {
      sessoes.delete((req.headers.cookie || "").match(/crm=([^;]+)/)?.[1]);
      return json(res, 200, { ok: true }, { "Set-Cookie": "crm=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" });
    }
    const id = Number(pathname.match(/^\/api\/leads\/(\d+)$/)?.[1]);
    if (id && req.method === "PATCH") return editarLead(req, res, id);
    if (id && req.method === "DELETE") {
      apagarLead.run(id);
      return json(res, 200, { ok: true });
    }
  }
  json(res, 404, { erro: "Não encontrado." });
}

http.createServer((req, res) => {
  rotear(req, res).catch(() => {
    if (!res.headersSent) json(res, 400, { erro: "Requisição inválida." });
  });
}).listen(PORTA, () => console.log(`Funil: http://localhost:${PORTA}  |  CRM: http://localhost:${PORTA}/crm`));
