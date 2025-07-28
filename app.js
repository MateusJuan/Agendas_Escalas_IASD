import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = "https://kiragcrvsovowvajvrgw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcmFnY3J2c292b3d2YWp2cmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjIzNjMsImV4cCI6MjA2OTI5ODM2M30.kI1YLTtBYvrZlqUunNzk_XKNMPXhMBgo6KC0k4dctxM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PORT = 3000;

// Rota GET para listar todos usuários (útil para seu login)
app.get("/api/usuarios", async (req, res) => {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

// Rota POST para criar usuários (se já tiver, ótimo!)
app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha, dataNascimento } = req.body;

  // Valide os dados aqui se quiser

  // Insere na tabela "usuarios"
  const { data, error } = await supabase.from("usuarios").insert([
    {
      nome,
      email,
      senha,
      data_nascimento: dataNascimento,
    },
  ]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
