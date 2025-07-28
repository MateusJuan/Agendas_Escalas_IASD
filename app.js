import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = "https://kiragcrvsovowvajvrgw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcmFnY3J2c292b3d2YWp2cmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjIzNjMsImV4cCI6MjA2OTI5ODM2M30.kI1YLTtBYvrZlqUunNzk_XKNMPXhMBgo6KC0k4dctxM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const PORT = 3000;

// === USUÁRIOS ===

// Listar todos usuários
app.get("/api/usuarios", async (req, res) => {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Rota para criar usuário
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, dataNascimento, tipo } = req.body;

    if (!nome || !email || !senha || !dataNascimento) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    // Converte a data para ISO
    const dataISO = converterDataParaISO(dataNascimento);
    if (!dataISO) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Insere no banco
    const { data, error } = await supabase.from("usuarios").insert([
      {
        nome,
        email,
        senha: hashedPassword,
        dataNascimento: dataISO,
        tipo: tipo || "usuario",
      },
    ]);

    if (error) return res.status(400).json({ error: error.message });

    // Retorna o usuário criado (sem senha)
    const usuarioCriado = data[0];
    delete usuarioCriado.senha;

    res.status(201).json(usuarioCriado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Login (autenticação)
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

  const { senha: _, ...usuarioSemSenha } = usuario;
  res.json(usuarioSemSenha);
});

// Atualizar usuário (com ou sem senha)
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

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
});

// Deletar usuário por id
app.delete("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("usuarios").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Usuário excluído com sucesso." });
});

// === ESCALAS ===

// Listar escalas com nome do usuário (join na tabela usuarios)
app.get("/api/escalas", async (req, res) => {
  const { data, error } = await supabase
    .from("escalas")
    .select(`
      id,
      data,
      ministerio,
      pessoa_id,
      usuarios (nome)
    `);

  if (error) return res.status(400).json({ error: error.message });

  const escalasFormatadas = data.map((item) => ({
    id: item.id,
    data: item.data,
    ministerio: item.ministerio,
    pessoa_id: item.pessoa_id,
    pessoa_nome: item.usuarios?.nome || "Desconhecido",
  }));

  res.json(escalasFormatadas);
});

// Criar nova escala
app.post("/api/escalas", async (req, res) => {
  const { data: dataStr, ministerio, pessoa_id } = req.body;

  if (!dataStr || !ministerio || !pessoa_id) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const { data, error } = await supabase.from("escalas").insert([
    {
      data: new Date(dataStr),
      ministerio,
      pessoa_id,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

// Deletar escala por ID
app.delete("/api/escalas/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("escalas").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Escala excluída com sucesso." });
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
