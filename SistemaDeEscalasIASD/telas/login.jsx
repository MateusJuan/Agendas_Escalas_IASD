import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const animarBotao = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  {/*const validarSenhaForte = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(senha);
  };*/}

  async function login() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    {/*if (!validarSenhaForte(senha)) {
      Alert.alert(
        "Senha fraca",
        "A senha deve conter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas e números."
      );
      return;
    }*/}

    try {
      const response = await axios.get("http://192.168.18.114:3000/usuarios");
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(
        (usuario) => usuario.email === email && usuario.senha === senha
      );

      if (usuarioEncontrado) {
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
        Alert.alert("Sucesso", `Bem-vindo, ${usuarioEncontrado.nome}!`);
        navigation.navigate("InicioUsuario", { user: usuarioEncontrado });
      } else {
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <Text style={styles.subtitulo}>Faça login para acessar o aplicativo</Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="testes123@gmail.com"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>SENHA</Text>
      <View style={styles.senhaContainer}>
        <TextInput
          style={styles.senhaInput}
          placeholder="******"
          placeholderTextColor="#aaa"
          secureTextEntry={!senhaVisivel}
          value={senha}
          onChangeText={setSenha}
        />
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={() => {
              setSenhaVisivel(!senhaVisivel);
              animarBotao();
            }}
          >
            <Feather
              name={senhaVisivel ? "eye" : "eye-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("RecuperarSenha")}
        style={{ alignSelf: "flex-start" }}
      >
        <Text style={styles.esqueciSenha}>ESQUECEU A SENHA?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={login}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("CriarConta")}>
        <Text style={styles.criarConta}>CRIAR CONTA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 15,
    color: "#000",
  },
  senhaContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginBottom: 20,
  },
  senhaInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
    color: "#000",
  },
  esqueciSenha: {
    fontSize: 11,
    color: "#444",
    marginBottom: 25,
  },
  botao: {
    backgroundColor: "#2d3e50",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  criarConta: {
    marginTop: 20,
    fontSize: 13,
    color: "#222",
    fontWeight: "500",
    letterSpacing: 1,
  },
});
