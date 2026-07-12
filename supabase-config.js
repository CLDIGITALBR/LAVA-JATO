// =====================================================================
//  LavaSync — Configuração do Supabase
// =====================================================================
//  ✅ Este arquivo PODE ir para o GitHub.
//     A URL e a PUBLISHABLE KEY (sb_publishable_...) são públicas por
//     design — quem protege os dados é o Row Level Security (RLS) que
//     você criou no schema.sql.
//
//  ⛔ NUNCA coloque aqui a SECRET KEY (sb_secret_...). Ela ignora o RLS.
// =====================================================================

// URL base do projeto — SEM /rest/v1 no fim (o supabase-js adiciona sozinho)
const SUPABASE_URL = "https://sgwqagzrrxkmzywazzlv.supabase.co";

// Publishable key (pública por design, protegida pelo RLS)
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_6jrNKDro4XGsWEV7oibzeQ_zKyRkBtf";

// Cria o cliente global usado pelo script.js
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Contato da CL Digital mostrado no "Esqueci minha senha".
// Edite com o WhatsApp/e-mail reais. Deixe "" para não exibir contato.
const CL_DIGITAL_CONTATO = "WhatsApp (11) 91517-9254";
