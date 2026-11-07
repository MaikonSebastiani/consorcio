# Consórcio: funil de simulação e CRM

Site para captar leads de consórcio de carro e imóvel, com simulação, estratégia de lance personalizada e um CRM com dashboard. Roda como um **Cloudflare Worker**, no mesmo padrão do `saitama-crm`: arquivos estáticos servidos pelo Worker, banco **D1** e login pelo **Cloudflare Access**.

## Endereços

| Endereço | O que é |
|---|---|
| `gruposaitama.com.br` | Home com a escolha entre carro e imóvel |
| `gruposaitama.com.br/carro` e `/imovel` | Conteúdo, quiz e painel da simulação |
| `gruposaitama.com.br/privacidade` | Política de privacidade |
| `consorcio.gruposaitama.com.br` | CRM com dashboard e quadro de leads, protegido pelo Cloudflare Access |

O Worker decide pelo endereço: no `consorcio.gruposaitama.com.br` só abre o CRM, e toda requisição precisa de um token válido do Access. No site público, o CRM não existe.

## Estrutura

```text
src/worker.js        rotas, páginas, leads e conferência do Access
src/config.mjs       consultor, contato, taxas, grupos (o navegador recebe em /config.js)
src/paginas/         modelos HTML das páginas e do CRM
public/              estilo, scripts, regras compartilhadas e imagens
migrations/          tabela de leads do D1
wrangler.jsonc       configuração do Worker
```

## Como rodar localmente

```bash
npm install
cp .dev.vars.example .dev.vars
npm run banco:local
npm run dev
```

O site abre em `http://localhost:4173` e o CRM em `http://localhost:4173/crm`. Esse endereço `/crm` sem login só existe no desenvolvimento local, por causa de `DEV_SEM_ACCESS=1` no `.dev.vars`.

## Configuração

Os valores em `src/config.mjs` são **de exemplo**. Enquanto `modoExemplo` for `true`, o site mostra um aviso de demonstração e pede para não ser indexado pelo Google.

## Publicação

O site vai para `gruposaitama.com.br` **só quando estiver finalizado**. Decisões já tomadas:

- o site atual da consultoria imobiliária (Worker `lpscorretagem`) sai do ar quando o consórcio ocupar a home;
- o CRM de empreendimentos (`saitama-crm`) passa a abrir em `imoveis.gruposaitama.com.br`, e `crm.gruposaitama.com.br` é removido;
- o CRM de consórcio fica em `consorcio.gruposaitama.com.br`, com banco separado.

Antes de publicar:

1. Trocar os dados de exemplo em `src/config.mjs`, definir `modoExemplo: false` e `siteUrl: "https://gruposaitama.com.br"`.
2. Resolver a pergunta de prazo do quiz, já que o conteúdo diz que não existe data de contemplação.
3. Criar o banco com `npm run banco:criar`, colocar o ID em `wrangler.jsonc` e rodar `npm run banco:remoto`.
4. Criar no Cloudflare Access um aplicativo para `consorcio.gruposaitama.com.br` e preencher `ACCESS_TEAM_DOMAIN` e `ACCESS_AUD` em `wrangler.jsonc`. Sem esses dados, o CRM fica fechado.
5. Ativar as rotas comentadas em `wrangler.jsonc`, tirar `gruposaitama.com.br` do Worker `lpscorretagem` e publicar com `npm run publicar`.
