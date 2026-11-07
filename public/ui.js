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
  const nome = proprio && embutido ? "Lance híbrido"
    : proprio ? "Lance livre"
    : embutido ? "Embutido + reserva mensal"
    : "Sorteio + reserva mensal";
  // Média de referência só existe para as estratégias que usam parte da carta.
  const medias = CONFIG.mediasContemplacao ?? {};
  const media = embutido ? (proprio ? medias.hibrido : medias.embutido) : null;
  return { nome, media, proprio, embutido, total: proprio + embutido, valorProprio: valor * proprio, valorEmbutido: valor * embutido, valorTotal: valor * (proprio + embutido) };
}
