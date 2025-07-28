import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";


const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = "https://kiragcrvsovowvajvrgw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcmFnY3J2c292b3d2YWp2cmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjIzNjMsImV4cCI6MjA2OTI5ODM2M30.kI1YLTtBYvrZlqUunNzk_XKNMPXhMBgo6KC0k4dctxM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PORT = 3000;

app.get("/api/usuarios", async (req, res) => {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

  app.post("/api/usuarios", async (req, res) => {
    const { nome, email, senha, dataNascimento } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(senha, 10);

      const { data, error } = await supabase.from("usuarios").insert([
        {
          nome,
          email,
          senha: hashedPassword,
          dataNascimento
        },
      ]);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar usuário." });
    }
  });

  app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email);

  if (error || !usuarios || usuarios.length === 0) {
    return res.status(401).json({ error: "Email ou senha incorretos." });
  }

  const usuario = usuarios[0];

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({ error: "Email ou senha incorretos." });
  }

  // Senha válida: retorna dados do usuário (sem a senha)
  const { senha: _, ...usuarioSemSenha } = usuario;
  res.json(usuarioSemSenha);
});


app.put("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, dataNascimento } = req.body;

  try {
    let fieldsToUpdate = { nome, email, dataNascimento };

    if (senha && senha.trim() !== "") {
      const hashedPassword = await bcrypt.hash(senha, 10);
      fieldsToUpdate.senha = hashedPassword;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update(fieldsToUpdate)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado ou não atualizado." });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
});

// DELETE: Excluir usuário por ID
app.delete("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("usuarios").delete().eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Usuário excluído com sucesso." });
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
