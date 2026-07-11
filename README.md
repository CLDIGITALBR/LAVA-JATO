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
