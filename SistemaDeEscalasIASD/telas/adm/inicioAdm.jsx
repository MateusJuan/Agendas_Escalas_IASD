import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import AdmInferior from "../barras/adminferior";

// Dados simulados (escalas para vários usuários)
const escalas = [
  { data: new Date(2025, 6, 2), ministerio: "Sonoplastia", pessoa: "Mateus" },
  { data: new Date(2025, 6, 13), ministerio: "Sonoplastia", pessoa: "Mateus" },
  { data: new Date(2025, 6, 26), ministerio: "Sonoplastia", pessoa: "Mateus" },
  { data: new Date(2025, 6, 30), ministerio: "Sonoplastia", pessoa: "Mateus" },

  { data: new Date(2025, 6, 5), ministerio: "Louvor", pessoa: "João" }, // sábado
  { data: new Date(2025, 6, 6), ministerio: "Recepção", pessoa: "Maria" }, // domingo
  { data: new Date(2025, 6, 9), ministerio: "Sonoplastia", pessoa: "Ana" }, // quarta
];

// Usuários simulados do banco
const usuarios = [
  { id: "1", nome: "Mateus" },
  { id: "2", nome: "João" },
  { id: "3", nome: "Maria" },
  { id: "4", nome: "Ana" },
  { id: "5", nome: "Lucas" },
];

const MEU_NOME = "Mateus"; // nome fixo para filtrar "Minha Escala"

function getProximaEscala(escalas) {
  const hoje = new Date();
  const futuras = escalas
    .filter((item) => item.data >= hoje && item.pessoa === MEU_NOME)
    .sort((a, b) => a.data - b.data);
  return futuras[0] || null;
}

// Função para filtrar dias de sábado, domingo e quarta
function ehDiaImportante(data) {
  const diaSemana = data.getDay(); // 0=domingo ... 3=quarta ... 6=sábado
  return diaSemana === 0 || diaSemana === 3 || diaSemana === 6;
}

export default function InicioUsuario({ navigation }) {
  const proxima = getProximaEscala(escalas);

  // Estado para controlar pop-up e formulário
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(""); // guarda nome do usuário selecionado no Picker
  const [ministerioInput, setMinisterioInput] = useState("");
  const [diaSelecionado, setDiaSelecionado] = useState(null); // dia clicado para adicionar escala

  // Filtrar escalas do mês atual para minha escala (apenas meu nome)
  const minhaEscala = escalas.filter(
    (item) =>
      item.pessoa === MEU_NOME &&
      item.data.getMonth() === 6 && // Julho (mês 6 zero-based)
      item.data.getFullYear() === 2025
  );

  // Filtrar escalas do mês para dias sáb, dom e qua (Escala Geral)
  const escalasMes = [];
  for (let d = 1; d <= 31; d++) {
    const data = new Date(2025, 6, d);
    if (data.getMonth() !== 6) break; // só julho
    if (!ehDiaImportante(data)) continue;

    // Buscar escalas nesse dia (podem ter vários)
    const escalasDoDia = escalas.filter(
      (item) =>
        item.data.getDate() === d &&
        item.data.getMonth() === 6 &&
        item.data.getFullYear() === 2025
    );

    escalasMes.push({
      data,
      escalasDoDia,
    });
  }

  // Função para abrir pop-up para adicionar escala em dia vazio
  function abrirAdicionarEscala(diaObj) {
    setDiaSelecionado(diaObj);
    setUsuarioSelecionado("");
    setMinisterioInput("");
    setModalVisible(true);
  }

  // Função para salvar nova escala (simulação)
  function salvarEscala() {
    if (!diaSelecionado || !ministerioInput.trim() || !usuarioSelecionado.trim()) {
      alert("Informe usuário e ministério");
      return;
    }

    // Encontrar usuário pelo nome da busca
    const usuarioExiste = usuarios.find(
      (u) => u.nome === usuarioSelecionado
    );
    if (!usuarioExiste) {
      alert("Usuário não encontrado na lista");
      return;
    }

    // Aqui deveria salvar no backend, mas vamos só simular
    escalas.push({
      data: diaSelecionado.data,
      ministerio: ministerioInput.trim(),
      pessoa: usuarioSelecionado,
    });

    alert("Escala adicionada!");
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <Image
          source={require("../../img/Logo Circular.png")}
          style={styles.logo}
        />
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={16}
            color="#6c6c6c"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Pesquise aqui..."
            placeholderTextColor="#6c6c6c"
            style={styles.input}
          />
        </View>
        <Image
          source={{
            uri: "https://www.gravatar.com/avatar/?d=mp",
          }}
          style={styles.avatar}
        />
      </View>

      {/* CARD COM PRÓXIMA ESCALA */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <MaterialIcons name="calendar-month" size={24} color="#fff" />
            <View style={styles.cardItemText}>
              <Text style={styles.cardTitle}>Próximo Dia Escalado</Text>
              <Text style={styles.cardDate}>
                {proxima
                  ? proxima.data.toLocaleDateString("pt-BR")
                  : "Nenhuma escala futura"}
              </Text>
            </View>
          </View>
          <View style={styles.cardItem}>
            <MaterialIcons name="church" size={24} color="#fff" />
            <View style={styles.cardItemText}>
              <Text style={styles.cardTitle}>Ministério</Text>
              <Text style={styles.cardDate}>{proxima ? proxima.ministerio : "-"}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Minha Escala Mensal */}
      <Text style={styles.escalaTexto}>Minha Escala Mensal:</Text>

      <View style={styles.tabela}>
        <View style={styles.tabelaLinhaHeader}>
          <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>MÊS</Text>
          <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>DIA</Text>
          <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>MINISTÉRIO</Text>
        </View>

        <ScrollView style={{ maxHeight: 150 }}>
          {minhaEscala.map((item, index) => {
            const mesNome = item.data.toLocaleDateString("pt-BR", {
              month: "long",
            });
            const dia = item.data.getDate();
            return (
              <View key={index} style={styles.tabelaLinha}>
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>
                  {mesNome.charAt(0).toUpperCase() + mesNome.slice(1)}
                </Text>
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>{dia}</Text>
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>{item.ministerio}</Text>
              </View>
            );
          })}
          {minhaEscala.length === 0 && (
            <Text style={{ padding: 8, textAlign: "center" }}>
              Nenhuma escala neste mês.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Escala Geral do Mês */}
      <Text style={styles.escalaTexto}>Escala Geral do Mês:</Text>

      <View style={styles.tabela}>
        <View style={styles.tabelaLinhaHeader}>
          <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>MÊS</Text>
          <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>DIA</Text>
          <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>PESSOA</Text>
        </View>

        <ScrollView style={{ maxHeight: 200 }}>
          {escalasMes.map(({ data, escalasDoDia }, index) => {
            const mesNome = data.toLocaleDateString("pt-BR", {
              month: "long",
            });
            const dia = data.getDate();

            if (escalasDoDia.length === 0) {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.tabelaLinha, { backgroundColor: "#a4a4a4" }]}
                  onPress={() => abrirAdicionarEscala({ data })}
                >
                  <Text style={[styles.tabelaTexto, { flex: 3, color: "blue" }]}>
                    Clique aqui para adicionar alguém
                  </Text>
                </TouchableOpacity>
              );
            }

            return escalasDoDia.map((escala, idx) => (
              <View key={`${index}-${idx}`} style={styles.tabelaLinha}>
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>
                  {mesNome.charAt(0).toUpperCase() + mesNome.slice(1)}
                </Text>
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>{dia}</Text>
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>{escala.pessoa}</Text>
              </View>
            ));
          })}
        </ScrollView>
      </View>

      {/* POP-UP MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar Escala</Text>
            <Text style={{ marginTop: 10 }}>
              Dia: {diaSelecionado ? diaSelecionado.data.toLocaleDateString("pt-BR") : ""}
            </Text>

            {/* Picker para escolher usuário */}
            <Picker
              selectedValue={usuarioSelecionado}
              onValueChange={(itemValue) => setUsuarioSelecionado(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um usuário..." value="" />
              {usuarios.map((u) => (
                <Picker.Item key={u.id} label={u.nome} value={u.nome} />
              ))}
            </Picker>

            {/* Input ministério */}
            <TextInput
              placeholder="Digite o ministério"
              style={styles.inputModal}
              value={ministerioInput}
              onChangeText={setMinisterioInput}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <Pressable
                style={[styles.botaoModal, { backgroundColor: "#2e3e4e" }]}
                onPress={salvarEscala}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
              </Pressable>

              <Pressable
                style={[styles.botaoModal, { backgroundColor: "#aaa" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* RODAPÉ */}
      <AdmInferior navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3ef",
  },
  topo: {
    backgroundColor: "#2e3e4e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: 10,
    height: 35,
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#2e3e4e",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2e3e4e",
  },
  cardItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardItemText: {
    marginTop: 5,
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 10,
  },
  cardDate: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  escalaTexto: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  tabela: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabelaLinhaHeader: {
    flexDirection: "row",
    backgroundColor: "#3c2f2f",
    padding: 8,
  },
  tabelaLinha: {
    flexDirection: "row",
    backgroundColor: "#a4a4a4",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  tabelaHeaderTexto: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
  tabelaTexto: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  inputModal: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    height: 40,
  },
  picker: {
    marginTop: 10,
    height: 50,
    width: "100%",
  },
  botaoModal: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
