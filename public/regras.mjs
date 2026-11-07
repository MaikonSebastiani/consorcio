// Regras usadas no navegador e no Worker.

const DDDS = new Set(("11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 "
  + "51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99").split(" "));

// Recebe só os dígitos e devolve a mensagem de erro, ou "" se o celular for válido.
export function erroCelular(digitos) {
  const d = String(digitos ?? "");
  if (!/^\d{11}$/.test(d)) return "Digite o celular com DDD e 9 dígitos.";
  if (!DDDS.has(d.slice(0, 2))) return "Esse DDD não existe. Confira o número.";
  if (d[2] !== "9") return "O celular deve começar com 9 depois do DDD.";
  if (/^(\d)\1{7}$/.test(d.slice(3))) return "Digite um número de celular válido.";
  return "";
}

// Menor carta que cobre o valor desejado; se nenhuma cobrir, a maior disponível.
export function cartaIndicada(cartas, valor) {
  const ordenadas = [...cartas].sort((a, b) => a - b);
  return ordenadas.find(carta => carta >= valor) ?? ordenadas.at(-1);
}
