import CONFIG from "./config.mjs";
import { cartaIndicada, erroCelular } from "../public/regras.mjs";
import paginaInicial from "./paginas/index.html";
import paginaFunil from "./paginas/funil.html";
import paginaPrivacidade from "./paginas/privacidade.html";
import paginaCrm from "./paginas/crm.html";
import conteudoCarro from "./paginas/conteudo-carro.html";
import conteudoImovel from "./paginas/conteudo-imovel.html";

const STATUS = ["novo", "contato", "negociando", "vendido", "perdido"];
const PRODUTOS = ["carro", "imovel"];

const PAGINAS = {
  "/": {
    modelo: paginaInicial,
    titulo: "Consórcio de carro e imóvel com estratégia de lance",
    descricao: "Simule consórcio de carro ou imóvel, compare com financiamento e receba uma estratégia de lance personalizada. Sem compromisso.",
  },
  "/carro": {
    modelo: paginaFunil,
    conteudo: conteudoCarro,
    imagem: "/img/hero-carro.webp",
    titulo: "Consórcio de carro: simule parcela e estratégia de lance",
    descricao: "Simule seu consórcio de carro, compare com o financiamento e receba uma estratégia de lance personalizada em 60 segundos.",
  },
  "/imovel": {
    modelo: paginaFunil,
    conteudo: conteudoImovel,
    imagem: "/img/hero-imovel.webp",
    titulo: "Consórcio de imóvel: simule parcela e estratégia de lance",
    descricao: "Simule seu consórcio de imóvel, veja quanto a espera pesa no bolso e receba uma estratégia de lance personalizada em 60 segundos.",
  },
  "/privacidade": {
    modelo: paginaPrivacidade,
    titulo: "Política de privacidade",
    descricao: "Saiba quais dados este site coleta, para que usa e como pedir a exclusão.",
  },
};

const SEGURANCA = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" };

export default {
  async fetch(request, env) {
    try {
      return await rotear(request, env);
    } catch (erro) {
      console.error(erro);
      return json({ erro: "Requisição inválida." }, 400);
    }
  },
};

async function rotear(request, env) {
  const url = new URL(request.url);
  const caminho = url.pathname.replace(/\/+$/, "") || "/";
  const metodo = request.method;
  const noCrm = Boolean(env.CRM_HOST) && url.hostname === env.CRM_HOST;
  // Só no desenvolvimento local o CRM abre em /crm sem o Cloudflare Access.
  const crmLocal = env.DEV_SEM_ACCESS === "1" && !noCrm;

  if (noCrm && !await acessoValido(request, env)) {
    return caminho.startsWith("/api/") ? json({ erro: "Sua sessão expirou. Recarregue a página para entrar de novo." }, 401) : new Response("Acesso não autorizado.", { status: 403, headers: SEGURANCA });
  }

  if (noCrm || crmLocal) {
    if (metodo === "GET" && caminho === (noCrm ? "/" : "/crm")) return html(paginaCrm, { "X-Frame-Options": "DENY", "X-Robots-Tag": "noindex" });
    if (metodo === "GET" && caminho === "/api/leads") return listarLeads(env);
    const id = Number(caminho.match(/^\/api\/leads\/(\d+)$/)?.[1]);
    if (id && metodo === "PATCH") return editarLead(request, env, id);
    if (id && metodo === "DELETE") return apagarLead(env, id);
  }

  if (metodo === "GET" && caminho === "/config.js") {
    return new Response(`const CONFIG = ${JSON.stringify(CONFIG)};\n`, { headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", ...SEGURANCA } });
  }
  if (noCrm) {
    // No endereço do CRM só passam os arquivos de estilo e script.
    return /^\/(estilo\.css|ui\.js|regras\.mjs)$/.test(caminho) ? env.ASSETS.fetch(request) : json({ erro: "Não encontrado." }, 404);
  }

  if (metodo === "GET" && PAGINAS[caminho]) return html(renderizar(caminho));
  if (metodo === "POST" && caminho === "/api/leads") return receberLead(request, env);
  if (metodo === "GET" && caminho === "/robots.txt") return texto(robots(), "text/plain");
  if (metodo === "GET" && caminho === "/sitemap.xml" && CONFIG.siteUrl) return texto(sitemap(), "application/xml");
  if (caminho.startsWith("/api/")) return json({ erro: "Não encontrado." }, 404);
  return env.ASSETS.fetch(request);
}

// Respostas

function json(dados, codigo = 200) {
  return new Response(JSON.stringify(dados), { status: codigo, headers: { "Content-Type": "application/json; charset=utf-8", ...SEGURANCA } });
}

function html(conteudo, extras = {}) {
  return new Response(conteudo, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache", ...SEGURANCA, ...extras } });
}

function texto(conteudo, tipo) {
  return new Response(conteudo, { headers: { "Content-Type": `${tipo}; charset=utf-8`, ...SEGURANCA } });
}

async function lerJson(request) {
  if (!(request.headers.get("Content-Type") || "").startsWith("application/json")) throw new Error("tipo");
  const corpo = await request.text();
  if (corpo.length > 10000) throw new Error("tamanho");
  return JSON.parse(corpo);
}

// Páginas

const escapar = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function metaTags(rota, { titulo, descricao, imagem }) {
  const tags = [
    `<title>${escapar(titulo)} | ${escapar(CONFIG.consultor)}</title>`,
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
    aviso: CONFIG.modoExemplo ? '<div class="aviso-exemplo">DEMONSTRAÇÃO: taxas e cartas de exemplo. Não divulgue esta versão.</div>' : "",
    conteudo: pagina.conteudo ?? "",
    rodape: rodape(),
    consultor: escapar(CONFIG.consultor),
    administradora: escapar(CONFIG.administradora),
    documentoTexto: CONFIG.documento ? `, ${escapar(CONFIG.documento)}` : "",
    contatoPrivacidade: contato || "[preencher e-mail ou telefone em src/config.mjs]",
  };
  return pagina.modelo.replace(/\{\{(\w+)\}\}/g, (_, chave) => valores[chave] ?? "");
}

function robots() {
  const mapa = CONFIG.siteUrl ? `\nSitemap: ${CONFIG.siteUrl}/sitemap.xml` : "";
  return `User-agent: *\nDisallow: /api/${mapa}\n`;
}

function sitemap() {
  const urls = Object.keys(PAGINAS).map(rota => `<url><loc>${escapar(CONFIG.siteUrl + (rota === "/" ? "" : rota))}</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

// Leads

function parcelaEstimada(objetivo, valor) {
  const c = CONFIG[objetivo].consorcio;
  return Math.round(valor * (1 + c.taxaAdministracao + c.fundoReserva) / c.prazoMeses);
}

// Prioriza quem tem mais reserva para lance e uma parcela que cabe no orçamento.
const PONTOS_RESERVA = [["até 10%", 1], ["de 10% a 30%", 2], ["mais de 30%", 3]];

function temperatura({ reserva, parcela }, estimada) {
  let pontos = PONTOS_RESERVA.find(([inicio]) => reserva.startsWith(inicio))?.[1] ?? 0;
  if (parcela >= estimada) pontos += 1;
  return pontos >= 3 ? "quente" : pontos >= 1 ? "morno" : "frio";
}

function leadValido(l) {
  const texto = (v, max) => typeof v === "string" && v.trim().length >= 2 && v.length <= max;
  return PRODUTOS.includes(l.objetivo) && texto(l.nome, 80) && l.consentimento === true
    && texto(l.motivo, 60) && texto(l.reserva, 60)
    && Number.isInteger(l.valor) && l.valor > 0 && l.valor <= 5000000
    && Number.isInteger(l.parcela) && l.parcela > 0 && l.parcela <= 100000
    && (l.aluguel === undefined || (Number.isInteger(l.aluguel) && l.aluguel >= 0 && l.aluguel <= 100000));
}

async function receberLead(request, env) {
  if (env.LIMITE_LEADS) {
    const { success } = await env.LIMITE_LEADS.limit({ key: request.headers.get("CF-Connecting-IP") || "local" });
    if (!success) return json({ erro: "Muitas tentativas. Aguarde um minuto." }, 429);
  }
  const l = await lerJson(request);
  if (l.site) return json({ ok: true }, 201); // Campo invisível preenchido: robô.
  const problemaCelular = erroCelular(l.whatsapp);
  if (problemaCelular) return json({ erro: problemaCelular }, 400);
  if (!leadValido(l)) return json({ erro: "Dados inválidos." }, 400);
  const agora = new Date().toISOString();
  const carta = cartaIndicada(CONFIG[l.objetivo].cartas, l.valor);
  const estimada = parcelaEstimada(l.objetivo, carta);
  // Quem refaz a simulação atualiza o lead existente e mantém status e anotações.
  // A coluna "quando" fica vazia: a pergunta de prazo saiu do quiz, mas leads antigos ainda têm o valor.
  await env.DB.prepare(`INSERT INTO leads
    (nome, whatsapp, objetivo, motivo, valor, carta, parcela, parcela_estimada, reserva, quando, temperatura, aluguel, consentimento_em, criado_em, atualizado_em)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(whatsapp, objetivo) DO UPDATE SET
      nome = excluded.nome, motivo = excluded.motivo, valor = excluded.valor, carta = excluded.carta, parcela = excluded.parcela,
      parcela_estimada = excluded.parcela_estimada, reserva = excluded.reserva, quando = excluded.quando,
      temperatura = excluded.temperatura, aluguel = excluded.aluguel, consentimento_em = excluded.consentimento_em, atualizado_em = excluded.atualizado_em`)
    .bind(l.nome.trim(), l.whatsapp, l.objetivo, l.motivo, l.valor, carta, l.parcela, estimada, l.reserva, "",
      temperatura(l, estimada), l.aluguel ?? 0, agora, agora, agora)
    .run();
  return json({ ok: true }, 201);
}

async function listarLeads(env) {
  const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY atualizado_em DESC").all();
  return json(results);
}

async function editarLead(request, env, id) {
  const atual = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
  if (!atual) return json({ erro: "Lead não encontrado." }, 404);
  const { status = atual.status, notas = atual.notas } = await lerJson(request);
  if (!STATUS.includes(status) || typeof notas !== "string" || notas.length > 2000) return json({ erro: "Dados inválidos." }, 400);
  await env.DB.prepare("UPDATE leads SET status = ?, notas = ?, atualizado_em = ? WHERE id = ?").bind(status, notas, new Date().toISOString(), id).run();
  return json(await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first());
}

async function apagarLead(env, id) {
  await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

// Cloudflare Access: confere o token assinado que o Access envia em cada requisição.

let chavesAccess = { lista: [], em: 0 };

const base64url = v => Uint8Array.from(atob(v.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(v.length / 4) * 4, "=")), c => c.charCodeAt(0));

async function chavesDoTime(time, forcar) {
  if (forcar || Date.now() - chavesAccess.em > 3600000) {
    const resposta = await fetch(`https://${time}/cdn-cgi/access/certs`);
    chavesAccess = { lista: (await resposta.json()).keys ?? [], em: Date.now() };
  }
  return chavesAccess.lista;
}

async function acessoValido(request, env) {
  // Sem configuração do Access, o CRM fica fechado.
  if (!env.ACCESS_AUD || !env.ACCESS_TEAM_DOMAIN) return false;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  const partes = token?.split(".");
  if (partes?.length !== 3) return false;
  try {
    const decodificar = parte => JSON.parse(new TextDecoder().decode(base64url(parte)));
    const cabecalho = decodificar(partes[0]);
    const corpo = decodificar(partes[1]);
    const time = env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (cabecalho.alg !== "RS256" || corpo.iss !== `https://${time}` || ![].concat(corpo.aud).includes(env.ACCESS_AUD) || corpo.exp * 1000 < Date.now()) return false;
    let chave = (await chavesDoTime(time)).find(k => k.kid === cabecalho.kid);
    if (!chave) chave = (await chavesDoTime(time, true)).find(k => k.kid === cabecalho.kid);
    if (!chave) return false;
    const publica = await crypto.subtle.importKey("jwk", chave, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    return crypto.subtle.verify("RSASSA-PKCS1-v1_5", publica, base64url(partes[2]), new TextEncoder().encode(`${partes[0]}.${partes[1]}`));
  } catch {
    return false;
  }
}
