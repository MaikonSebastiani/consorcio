const reais = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function el(tag, classe, texto) {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

function indicador(rotulo, valor, nota, destaque) {
  const c = el("div", destaque ? "indicador destaque" : "indicador");
  c.append(el("div", "rotulo", rotulo), el("div", "valor", valor));
  if (nota) c.append(el("div", "nota", nota));
  return c;
}

// Mostra o detalhe de uma marca do gráfico com mouse, toque ou teclado.
function dica(alvo, texto) {
  let caixa = document.getElementById("dica");
  if (!caixa) {
    caixa = el("div");
    caixa.id = "dica";
    caixa.hidden = true;
    document.body.append(caixa);
  }
  const mostrar = () => {
    const r = alvo.getBoundingClientRect();
    caixa.textContent = texto;
    caixa.style.left = `${Math.min(Math.max(r.left + r.width / 2, 110), innerWidth - 110)}px`;
    caixa.style.top = `${Math.max(r.top, 40)}px`;
    caixa.hidden = false;
  };
  const esconder = () => { caixa.hidden = true; };
  alvo.tabIndex = 0;
  alvo.setAttribute("role", "img");
  alvo.setAttribute("aria-label", texto);
  alvo.addEventListener("pointerenter", mostrar);
  alvo.addEventListener("focus", mostrar);
  alvo.addEventListener("pointerleave", esconder);
  alvo.addEventListener("blur", esconder);
}

// Barras horizontais: cada item é { rotulo, valor, texto, detalhe, neutra }.
function barras(itens) {
  const lista = el("div", "barras");
  const maximo = Math.max(...itens.map(i => i.valor), 1);
  itens.forEach(i => {
    const linha = el("div");
    const rotulos = el("div", "barra-rotulos");
    rotulos.append(el("span", "", i.rotulo), el("span", "", i.texto));
    const trilho = el("div", "barra-trilho");
    const barra = el("div", i.neutra ? "barra neutra" : "barra");
    barra.style.width = `${i.valor / maximo * 100}%`;
    trilho.append(barra);
    dica(trilho, i.detalhe || `${i.rotulo}: ${i.texto}`);
    linha.append(rotulos, trilho);
    lista.append(linha);
  });
  return lista;
}

const PERCENTUAL_RESERVA = [["até 10%", 0.1], ["de 10% a 30%", 0.2], ["mais de 30%", 0.3]];

// Monta o lance possível a partir da reserva informada e do limite de embutido do produto.
function planoDeLance(produto, valor, reserva) {
  const proprio = PERCENTUAL_RESERVA.find(([inicio]) => reserva.startsWith(inicio))?.[1] ?? 0;
  const embutido = CONFIG[produto].lanceEmbutidoMax;
  const nome = proprio && embutido ? "Lance combinado"
    : proprio ? "Lance livre"
    : embutido ? "Embutido + reserva mensal"
    : "Sorteio + reserva mensal";
  return { nome, proprio, embutido, total: proprio + embutido, valorProprio: valor * proprio, valorEmbutido: valor * embutido, valorTotal: valor * (proprio + embutido) };
}

const DDDS = new Set(("11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 "
  + "51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99").split(" "));

// Recebe só os dígitos e devolve a mensagem de erro, ou "" se o celular for válido.
function erroCelular(digitos) {
  const d = String(digitos ?? "");
  if (!/^\d{11}$/.test(d)) return "Digite o celular com DDD e 9 dígitos.";
  if (!DDDS.has(d.slice(0, 2))) return "Esse DDD não existe. Confira o número.";
  if (d[2] !== "9") return "O celular deve começar com 9 depois do DDD.";
  if (/^(\d)\1{7}$/.test(d.slice(3))) return "Digite um número de celular válido.";
  return "";
}

if (typeof module !== "undefined") module.exports = { erroCelular };
