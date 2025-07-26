import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function login() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    // Lógica de autenticação aqui...
    Alert.alert("Login", "Login simulado com sucesso!");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <Text style={styles.subtitulo}>Faça login para acessar o aplicativo</Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="testes123@gmail.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>SENHA</Text>
      <TextInput
        style={styles.input}
        placeholder="******"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={login}>
        <Text style={styles.botaoTexto}>Entrar</Text>
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
    marginBottom: 10,
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
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  botao: {
    backgroundColor: "#2d3e50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
