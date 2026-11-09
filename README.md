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
src/config.mjs       marca, contato, taxas e valores de carta (o navegador recebe em /config.js)
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

Os valores em `src/config.mjs` são **de referência**, tirados de posts de consultores Ademicon em 2026, e precisam ser confirmados com o gestor.

A parcela reduzida não aparece no site: o percentual fica em `FATOR_PARCELA_REDUZIDA`, no `wrangler.jsonc`, e é usado só no CRM, para levar à reunião. Enquanto `modoExemplo` for `true`, o site mostra um aviso de demonstração e pede para não ser indexado pelo Google.

## Publicação

Publicado em 09/11/2026 no Cloudflare:

- `gruposaitama.com.br`: site de consórcio (Worker `consorcio`)
- `consorcio.gruposaitama.com.br`: CRM de consórcio, com login pelo Cloudflare Access e banco D1 `consorcio-leads`
- `imoveis.gruposaitama.com.br`: CRM de empreendimentos (Worker `saitama-crm`); os endereços antigos `crm.gruposaitama.com.br` e `crm.sebastianiimoveis.com.br` foram removidos
- `contato@gruposaitama.com.br`: encaminhado pelo Email Routing do Cloudflare

Para publicar uma mudança:

```bash
npx wrangler deploy
```

Se mudar a tabela de leads, crie uma nova migração em `migrations/` e rode `npm run banco:remoto` antes do deploy.
