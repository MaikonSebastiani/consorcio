// Tudo que você precisa editar fica neste arquivo.
const CONFIG = {
  // Mude para false só depois de trocar as taxas e os grupos pelos dados reais do seu gestor.
  modoExemplo: true,

  consultor: "Seu Nome",
  administradora: "Ademicon",

  // Aparecem no rodapé e na política de privacidade. Preencha antes de publicar.
  documento: "", // CPF ou CNPJ, se quiser exibir
  email: "",
  telefone: "",
  // Endereço final do site, sem barra no fim. Ex.: https://www.seusite.com.br
  siteUrl: "",

  carro: {
    // EXEMPLO: substitua pela tabela vigente.
    consorcio: { prazoMeses: 80, taxaAdministracao: 0.18, fundoReserva: 0.02 },
    // EXEMPLO: taxa média de mercado que você quer usar na comparação.
    financiamento: { prazoMeses: 60, jurosMensal: 0.019, entrada: 0.2 },
    // Confirme com o gestor quantas assembleias o grupo tem por ano.
    assembleiasPorAno: 12,
    // EXEMPLO: parte da carta que pode virar lance embutido. Use 0 se o grupo não permitir.
    lanceEmbutidoMax: 0.25,
  },

  imovel: {
    // EXEMPLO: substitua pela tabela vigente.
    consorcio: { prazoMeses: 200, taxaAdministracao: 0.22, fundoReserva: 0.02 },
    // EXEMPLO: taxa média de mercado que você quer usar na comparação.
    financiamento: { prazoMeses: 360, jurosMensal: 0.0095, entrada: 0.2 },
    // Confirme com o gestor quantas assembleias o grupo tem por ano.
    assembleiasPorAno: 12,
    // EXEMPLO: parte da carta que pode virar lance embutido. Use 0 se o grupo não permitir.
    lanceEmbutidoMax: 0.25,
    // EXEMPLO: estimativa de alta anual do preço do imóvel.
    altaAnual: 0.06,
  },

  // Painel de oportunidades. Grupos sem vaga ou com prazo vencido somem sozinhos.
  // lanceReferencia: % de lance recente do grupo, informado pelo gestor. Sem esse campo, a comparação não aparece.
  // EXEMPLO: substitua pelos grupos reais.
  grupos: [
    { produto: "carro", nome: "Grupo A", creditoMin: 40000, creditoMax: 120000, vagas: 7, lanceReferencia: 35, limiteAdesao: "2026-11-24T18:00:00-03:00" },
    { produto: "carro", nome: "Grupo B", creditoMin: 80000, creditoMax: 200000, vagas: 4, lanceReferencia: 40, limiteAdesao: "2026-11-28T18:00:00-03:00" },
    { produto: "carro", nome: "Grupo C", creditoMin: 150000, creditoMax: 300000, vagas: 12, lanceReferencia: 30, limiteAdesao: "2026-12-05T18:00:00-03:00" },
    { produto: "imovel", nome: "Grupo D", creditoMin: 150000, creditoMax: 500000, vagas: 6, lanceReferencia: 38, limiteAdesao: "2026-11-26T18:00:00-03:00" },
    { produto: "imovel", nome: "Grupo E", creditoMin: 400000, creditoMax: 1500000, vagas: 3, lanceReferencia: 42, limiteAdesao: "2026-12-03T18:00:00-03:00" },
  ],
};

if (typeof module !== "undefined") module.exports = CONFIG;
