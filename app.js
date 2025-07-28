import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// Configure seu Supabase
const supabaseUrl = "https://kiragcrvsovowvajvrgw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcmFnY3J2c292b3d2YWp2cmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjIzNjMsImV4cCI6MjA2OTI5ODM2M30.kI1YLTtBYvrZlqUunNzk_XKNMPXhMBgo6KC0k4dctxM";
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota para criar usuário
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, dataNascimento } = req.body;

    if (!nome || !email || !senha || !dataNascimento) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    // Cria usuário no Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    // Insere dados adicionais na tabela 'usuarios'
    const { error: insertError } = await supabase.from("usuarios").insert([
      {
        id: authData.user.id,
        nome,
        data_nascimento: dataNascimento,
      },
    ]);

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro no backend:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
