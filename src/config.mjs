// Tudo que você precisa editar fica neste arquivo. O navegador recebe estes dados em /config.js.
export default {
  // Mude para false só depois de trocar as taxas e as cartas pelos dados reais do seu gestor.
  modoExemplo: true,

  consultor: "Seu Nome",
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
    // EXEMPLO: substitua pela tabela vigente.
    consorcio: { prazoMeses: 80, taxaAdministracao: 0.18, fundoReserva: 0.02 },
    // EXEMPLO: taxa média de mercado que você quer usar na comparação.
    financiamento: { prazoMeses: 60, jurosMensal: 0.019, entrada: 0.2 },
    // Confirme com o gestor quantas assembleias o grupo tem por ano.
    assembleiasPorAno: 12,
    // EXEMPLO: parte da carta que pode virar lance embutido. Use 0 se o grupo não permitir.
    lanceEmbutidoMax: 0.25,
    // EXEMPLO: valores de carta disponíveis. O site indica a menor carta que cobre o valor do carro.
    cartas: [50000, 70000, 90000, 110000, 130000, 160000, 200000, 250000, 300000],
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
    // EXEMPLO: valores de carta disponíveis. O site indica a menor carta que cobre o valor do imóvel.
    cartas: [150000, 200000, 250000, 300000, 350000, 400000, 500000, 600000, 800000, 1000000, 1500000],
  },
};
