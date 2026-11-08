// Tudo que você precisa editar fica neste arquivo. O navegador recebe estes dados em /config.js.
export default {
  // Mude para false só depois de trocar as taxas e as cartas pelos dados reais do seu gestor.
  modoExemplo: true,

  // Nome que aparece no site, no CRM e na política de privacidade.
  marca: "Grupo Saitama",
  administradora: "Ademicon",

  // Médias de contemplação por estratégia, usadas como referência no site. Não são promessa de prazo.
  mediasContemplacao: { hibrido: "24 meses", embutido: "24 a 36 meses" },

  // Aparecem no rodapé e na política de privacidade. Preencha antes de publicar.
  documento: "", // CPF ou CNPJ, se quiser exibir
  email: "",
  telefone: "",
  // Endereço final do site, sem barra no fim. Ex.: https://www.seusite.com.br
  siteUrl: "",

  carro: {
    // REFERÊNCIA: plano de até 90 meses e custo total de cerca de 16% (taxa + fundo), calculado
    // a partir de posts de consultores. Confirme com o gestor antes de publicar.
    consorcio: { prazoMeses: 90, taxaAdministracao: 0.14, fundoReserva: 0.02 },
    // EXEMPLO: taxa média de mercado que você quer usar na comparação.
    financiamento: { prazoMeses: 60, jurosMensal: 0.019, entrada: 0.2 },
    // Confirme com o gestor quantas assembleias o grupo tem por ano.
    assembleiasPorAno: 12,
    // EXEMPLO: parte da carta que pode virar lance embutido. Use 0 se o grupo não permitir.
    lanceEmbutidoMax: 0.25,
    // REFERÊNCIA: cartas vistas em posts de 2026. O site indica a menor carta que cobre o valor do carro.
    cartas: [60000, 80000, 90000, 100000, 125000, 150000, 180000, 200000, 250000, 300000],
  },

  imovel: {
    // REFERÊNCIA: 220 meses e custo total de 24,2% (ex.: carta de R$ 100 mil soma R$ 124.200),
    // conforme posts de consultores em 2026. Confirme com o gestor antes de publicar.
    consorcio: { prazoMeses: 220, taxaAdministracao: 0.222, fundoReserva: 0.02 },
    // EXEMPLO: taxa média de mercado que você quer usar na comparação.
    financiamento: { prazoMeses: 360, jurosMensal: 0.0095, entrada: 0.2 },
    // Confirme com o gestor quantas assembleias o grupo tem por ano.
    assembleiasPorAno: 12,
    // EXEMPLO: parte da carta que pode virar lance embutido. Use 0 se o grupo não permitir.
    lanceEmbutidoMax: 0.25,
    // EXEMPLO: estimativa de alta anual do preço do imóvel.
    altaAnual: 0.06,
    // REFERÊNCIA: tabela "Investimentos 2026" (R$ 100 mil a R$ 1 milhão, de 50 em 50 mil) e a carta de R$ 80 mil.
    cartas: [80000, ...Array.from({ length: 19 }, (_, i) => 100000 + i * 50000)],
  },
};
