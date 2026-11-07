# Consórcio: funil de simulação e CRM

Site para captar leads de consórcio de carro e imóvel, com simulação, estratégia de lance personalizada e um CRM com dashboard para acompanhar os contatos.

## Páginas

| Endereço | O que é |
|---|---|
| `/` | Home com a escolha entre carro e imóvel |
| `/carro` e `/imovel` | Conteúdo, quiz e painel da simulação |
| `/privacidade` | Política de privacidade |
| `/crm` | CRM com dashboard, quadro de leads e exclusão (protegido por senha) |

## Como rodar

Requer Node.js 24 ou mais recente, sem dependências externas. O banco usa o SQLite embutido no Node.

```bash
cp .env.example .env
```

Defina uma senha forte em `CRM_SENHA` no arquivo `.env` e inicie:

```bash
npm start
```

O site abre em `http://localhost:4173`.

## Configuração

Tudo o que muda com frequência fica em `config.js`:

- nome do consultor, contato e endereço do site;
- taxas, prazos e lance embutido de carro e imóvel;
- grupos com vagas, prazo de adesão e lance de referência.

Os valores atuais são **de exemplo**. Enquanto `modoExemplo` for `true`, o site mostra um aviso de demonstração e pede para não ser indexado pelo Google.

## Publicação

**Destino planejado:** `gruposaitama.com.br`, com DNS no Cloudflare. A home do domínio será a home do consórcio, com `/carro` e `/imovel` como páginas internas. A publicação só acontece quando o site estiver finalizado.

Antes de publicar:

- trocar os dados de exemplo pelos dados reais em `config.js` e definir `modoExemplo: false`;
- preencher nome, contato e `siteUrl: "https://gruposaitama.com.br"`;
- resolver a pergunta de prazo do quiz, já que o conteúdo diz que não existe data de contemplação.

Requisitos do servidor:

- Use um servidor com **disco permanente**, porque os leads ficam em `dados/crm.sqlite`.
- Sirva o site com **HTTPS** e defina `NODE_ENV=production` para o cookie de login ser seguro.
- Atrás de proxy ou balanceador, defina `TRUST_PROXY=1` para o limite de tentativas usar o IP real.
- Nunca envie o `.env` nem a pasta `dados/` para o repositório.
