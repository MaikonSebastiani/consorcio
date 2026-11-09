# Campanha Google Ads: Consórcio Grupo Saitama

Conta: **SebastianiImoveis**. Tudo separado dos empreendimentos: campanha, orçamento, conversão e meta próprios.

## 1. Conversão própria (criar antes da campanha)

| Campo | Valor |
|---|---|
| Onde | Metas › Conversões › Nova ação de conversão › Site |
| Categoria | Enviar formulário de lead |
| Nome | `Lead consórcio (site)` |
| Valor | Não usar valor |
| Contagem | Uma |
| Janela | 30 dias |
| Ação | **Secundária** na conta, para não entrar nas campanhas dos empreendimentos |

Depois crie uma **meta personalizada** `Leads consórcio` só com essa ação e use ela apenas na campanha de consórcio.

O site dispara a conversão quando o lead é salvo no CRM (`/api/leads` respondeu ok). O código entra no site depois que a ação existir, com o ID `AW-…` e o rótulo dela.

## 2. Campanha

| Campo | Valor |
|---|---|
| Nome | `Consórcio | Pesquisa | SP` |
| Objetivo | Leads |
| Tipo | Pesquisa |
| Redes | Só Pesquisa Google. **Desmarcar** parceiros de pesquisa e Rede de Display |
| Local | São Paulo (cidade). Opção: "Presença: pessoas que estão no local" |
| Idioma | Português |
| Orçamento | R$ 20 por dia |
| Lance | Maximizar cliques, CPC máximo R$ 2,50 (trocar para Maximizar conversões depois de 15 leads) |
| Horário | Todos os dias, das 8h às 22h |
| Meta de conversão | Só `Leads consórcio` |

## 3. Grupos de anúncios

### Grupo 1: Antes de financiar (veículo) → `https://gruposaitama.com.br/veiculo`
```
[juros de financiamento de carro]
[juros financiamento carro]
"taxa de juros financiamento de carro"
"simular financiamento de carro"
"simulador de financiamento de carro"
"financiamento de carro sem entrada"
"financiamento de carro usado"
"financiamento de carro para motorista de aplicativo"
"financiamento de moto"
```

### Grupo 2: Consórcio de veículo → `https://gruposaitama.com.br/veiculo`
```
[consórcio de carro]
[consorcio de carro]
"simular consórcio de carro"
"consórcio de veículos"
"consórcio carro usado"
"consórcio de caminhão"
"melhor consórcio de carro"
"consórcio de carro vale a pena"
"como fazer consórcio de carro"
```

### Grupo 3: Imóvel → `https://gruposaitama.com.br/imovel`
```
[consórcio imóvel]
[consórcio de imóvel]
"consórcio de casa"
"consórcio imobiliário"
"simular consórcio imóvel"
"consórcio ou financiamento imobiliário"
"consórcio imóvel vale a pena"
```

## 4. Lista de palavras negativas (nível da campanha)
```
honda, yamaha, embracon, caixa, porto seguro, porto bank, servopa, rodobens, itaú, itau, bradesco, santander, c6, banco do brasil, klubi
contemplado, contemplada, contemplados, vender, venda de cota, transferir cota, cancelar, desistir, devolução
boleto, segunda via, 2 via, reclame aqui, reclamação, telefone, sac, login, área do cliente, meu consórcio
vaga, vagas, emprego, trabalhe conosco, curso, salário, consultor
minha casa minha vida, mcmv, leilão, aluguel de carro, locadora
o que é, significado, pdf, tcc
```

## 5. Anúncios responsivos (1 por grupo)

**Títulos (até 30 caracteres)**, usados nos grupos 1 e 2:
- Vai Financiar? Compare Antes
- Juros Médios de 1,96% ao Mês
- Consórcio Sem Juros
- Financiamento ou Consórcio?
- Simule em 60 Segundos
- Veja Quanto Você Economiza
- Carro, Moto ou Caminhão
- Parcela a Partir de R$ 1.160
- Sem Entrada no Consórcio
- Especialistas em Consórcio
- Estratégia de Lance Grátis
- Consórcio de Veículo
- Grupo Saitama

**Títulos do grupo 3:**
- Consórcio de Imóvel
- Saia do Aluguel com Consórcio
- Casa Própria Sem Juros
- Parcela a Partir de R$ 564
- Imóvel de R$ 100 mil a 1 mi
- Financiamento ou Consórcio?
- Simule em 60 Segundos
- Veja Quanto Você Economiza
- Especialistas em Consórcio
- Estratégia de Lance Grátis
- Sem Entrada no Consórcio
- Grupo Saitama

**Descrições (até 90 caracteres):**
- Financiamento cobra juros. No consórcio você paga só taxa de administração. Simule agora.
- Compare com a taxa média do Banco Central e veja a economia no seu caso em 60 segundos.
- Sem compromisso. Veja sua parcela e receba uma estratégia de lance personalizada.
- Especialistas em consórcio indicam o melhor plano para o seu objetivo e orçamento.
- Grupo 2 também: Carro, moto, caminhão ou utilitário, novo ou usado. Simule a parcela agora.
- Grupo 3 também: Planeje seu imóvel sem juros. Veja parcela, economia e quanto a espera custa.

Fixe "Grupo Saitama" em nenhuma posição; deixe o Google combinar. Não use promessa de prazo de contemplação em nenhum texto.

## 6. Recursos extras
- **Sitelinks:** Simular veículo (`/veiculo`), Simular imóvel (`/imovel`), Como funciona o lance (`/veiculo#lance`), Consórcio ou financiamento (`/veiculo#comparativo`)
- **Frases de destaque:** Sem juros · Sem entrada · Simulação em 60 s · Estratégia de lance · Sem compromisso
- **Ligação:** (11) 95371-3310, só no horário da campanha

## 7. Rotina
- **Diário (2 min):** responder leads novos em até 5 minutos.
- **Semanal (15 min):** relatório de termos de pesquisa, negativar o que não tem a ver e pausar palavras sem lead depois de ~R$ 60 gastos.
- **Depois de 15 leads:** trocar o lance para Maximizar conversões.
