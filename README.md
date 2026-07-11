# LavaSync — Sistema de gestão para lava-jatos

Feito pela **CL Digital**. Front-end estático (HTML/CSS/JS) + backend **Supabase**
(banco Postgres, login e segurança por cliente). Arquitetura **multi-tenant**:
um único banco atende vários lava-jatos, e cada um só enxerga os próprios dados.

---

## 📁 Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | Interface (tela de login + app) |
| `style.css` | Visual (paleta navy/azul/aqua/âmbar) |
| `script.js` | Toda a lógica (login, fila, histórico, financeiro, WhatsApp) |
| `veiculos-data.js` | Base de veículos (tipo → marca → modelo) |
| `supabase-config.js` | URL + anon key do seu projeto Supabase |
| `schema.sql` | Script que cria o banco no Supabase |

---

## 🚀 Configuração (uma vez só)

### 1. Criar o projeto no Supabase
1. Acesse supabase.com → **New project**.
2. Escolha um nome e uma senha para o banco.

### 2. Criar as tabelas
1. No projeto → **SQL Editor** → **New query**.
2. Cole **todo** o conteúdo de `schema.sql` e clique em **Run**.

### 3. Ligar o frontend ao Supabase
1. No projeto → **Project Settings** → **API**.
2. Copie **Project URL** e **anon public key**.
3. Cole os dois em `supabase-config.js`.

### 4. Cadastrar o primeiro lava-jato
1. **Authentication → Users → Add user** (defina e-mail + senha, copie o UID).
2. No **SQL Editor**, rode o bloco comentado no fim do `schema.sql`,
   trocando o nome do lava-jato e colando o UID do usuário.

### 5. Subir no ar (Netlify)
- Conecte o repositório do GitHub no Netlify, ou arraste a pasta em
  **Deploys**. Não há build: é site estático.

---

## 🔐 Sobre segurança e GitHub

- ✅ **Pode** versionar `supabase-config.js`: a URL e a **anon key** são
  públicas por design. Quem protege os dados é o **RLS** do `schema.sql`.
- ⛔ **Nunca** coloque a **service_role key** em nenhum arquivo do frontend
  nem no GitHub — ela ignora o RLS.
- Ative backups (o plano grátis não tem): exporte o banco periodicamente.

---

## 🧩 Próximos passos sugeridos

- Personalização por cliente (logo/cores) já tem coluna no banco (`lava_jatos`).
- Histórico do cliente por placa (cliente recorrente).
- Programa de fidelidade (a cada X lavagens, 1 grátis).
- Relatórios (serviço mais vendido, dia mais movimentado).
- Painel admin da CL Digital para cadastrar novos clientes sem SQL.

---

## 🛠️ Painel Admin (CL Digital)

Página `admin.html` para cadastrar novos lava-jatos sem mexer no SQL.
Ela conversa com a Netlify Function `netlify/functions/criar-lavajato.js`,
que roda no servidor e usa a **secret key** com segurança.

### Configurar (uma vez)
1. **Gere uma secret key NOVA** no Supabase (Settings → API Keys →
   Secret keys → New secret key). Copie o valor `sb_secret_...`.
2. No **Netlify → Site settings → Environment variables**, crie três:
   - `SUPABASE_URL` = `https://sgwqagzrrxkmzywazzlv.supabase.co`
   - `SUPABASE_SERVICE_KEY` = a secret key nova (`sb_secret_...`)
   - `ADMIN_TOKEN` = uma senha forte só sua (ex.: 30+ caracteres aleatórios)
3. Faça um novo deploy (o Netlify instala o `@supabase/supabase-js` sozinho
   a partir do `package.json`).

### Usar
1. Acesse `https://SEU-SITE.netlify.app/admin.html`
2. Digite o **ADMIN_TOKEN** e clique em Salvar.
3. Preencha nome do lava-jato + e-mail + senha → **Cadastrar**.
   Ele cria o usuário de login, o lava-jato e o vínculo, tudo de uma vez.
4. Entregue o e-mail/senha ao cliente — ele já loga no sistema principal.

### Segurança
- A secret key e o ADMIN_TOKEN vivem **só** nas variáveis do Netlify,
  nunca no código nem no GitHub.
- Quem achar `admin.html` não consegue nada sem o ADMIN_TOKEN.
- Evolução futura: trocar o token compartilhado por login de admin por
  usuário (com verificação de papel no Supabase).
