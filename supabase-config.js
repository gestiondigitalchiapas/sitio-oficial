const SUPABASE_CONFIG = {
  url: "https://dqswkzgpipmczxveozdl.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxc3dremdwaXBtY3p4dmVvemRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTkwMjYsImV4cCI6MjA4MTM5NTAyNn0.nvxWFH98HZqGXD_cYx-7sDcx0Za1yQ6P1EqeVXv-NNg",
};

// Inicializar cliente de Supabase
// Verifica primero que la librería esté cargada
if (typeof window.supabase !== "undefined") {
  const { createClient } = window.supabase;
  window.supabaseClient = createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.key
  );
  console.log("✅ Supabase configurado correctamente");
} else {
  console.warn("⚠️ Librería de Supabase no cargada");
}
