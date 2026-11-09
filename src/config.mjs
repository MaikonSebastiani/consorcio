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
    // Gestor: carta + 16% (taxa + fundo), em até 80 meses.
    consorcio: { prazoMeses: 80, taxaAdministracao: 0.14, fundoReserva: 0.02 },
    // EXEMPLO: taxa média de mercado que você quer usar na comparação.
    financiamento: { prazoMeses: 60, jurosMensal: 0.019, entrada: 0.2 },
    // Confirme com o gestor quantas assembleias o grupo tem por ano.
    assembleiasPorAno: 12,
    // EXEMPLO: parte da carta que pode virar lance embutido. Use 0 se o grupo não permitir.
    lanceEmbutidoMax: 0.25,
    // REFERÊNCIA: cartas vistas em posts de 2026. O site indica a menor carta que cobre o valor do carro.
    cartas: [80000, 90000, 100000, 125000, 150000, 180000, 200000, 250000, 300000],
  },

  imovel: {
    // Tabela do gestor: carta + 24% dividido por 220 meses (ex.: R$ 100 mil + 24% = R$ 124.000 / 220 = R$ 563,64).
    // A divisão entre taxa e fundo não muda a parcela; o que vale é o total de 24%.
    consorcio: { prazoMeses: 220, taxaAdministracao: 0.22, fundoReserva: 0.02 },
    // EXEMPLO: taxa média de mercado que você quer usar na comparação.
    financiamento: { prazoMeses: 360, jurosMensal: 0.0095, entrada: 0.2 },
    // Confirme com o gestor quantas assembleias o grupo tem por ano.
    assembleiasPorAno: 12,
    // EXEMPLO: parte da carta que pode virar lance embutido. Use 0 se o grupo não permitir.
    lanceEmbutidoMax: 0.25,
    // EXEMPLO: estimativa de alta anual do preço do imóvel.
    altaAnual: 0.06,
    // Gestor: imóvel começa na carta de R$ 100 mil e vai até R$ 1 milhão, de 50 em 50 mil.
    cartas: Array.from({ length: 19 }, (_, i) => 100000 + i * 50000),
  },
};
