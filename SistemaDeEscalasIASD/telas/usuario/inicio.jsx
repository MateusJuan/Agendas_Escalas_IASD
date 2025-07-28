import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UsuarioInferior from "../barras/usuarioinferior";

// Dados simulados (corrigido com new Date(ano, mes, dia))
const escalas = [
  { data: new Date(2025, 6, 2), ministerio: "Sonoplastia" },
  { data: new Date(2025, 6, 13), ministerio: "Sonoplastia" },
  { data: new Date(2025, 6, 26), ministerio: "Sonoplastia" },
  { data: new Date(2025, 6, 30), ministerio: "Sonoplastia" },
];

// Função para encontrar a próxima escala
function getProximaEscala(escalas) {
  const hoje = new Date();
  const futuras = escalas
    .map((item) => ({
      ...item,
      dataObj: item.data,
    }))
    .filter((item) => item.dataObj >= hoje)
    .sort((a, b) => a.dataObj - b.dataObj);
  return futuras[0] || escalas[0];
}

export default function InicioUsuario({ navigation }) {
  const proxima = getProximaEscala(escalas);

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <Image
          source={require("../../img/Logo Circular.png")}
          style={styles.logo}
        />
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={16} color="#6c6c6c" style={styles.searchIcon} />
          <TextInput
            placeholder="Search here ..."
            placeholderTextColor="#6c6c6c"
            style={styles.input}
          />
        </View>
      </View>

      {/* CARD COM PRÓXIMA ESCALA */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardItem}>
            <MaterialIcons name="calendar-month" size={24} color="#fff" />
            <View style={styles.cardItemText}>
              <Text style={styles.cardTitle}>Próximo Dia Escalado</Text>
              <Text style={styles.cardDate}>
                {proxima.data.toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </View>
          <View style={styles.cardItem}>
            <MaterialIcons name="church" size={24} color="#fff" />
            <View style={styles.cardItemText}>
              <Text style={styles.cardTitle}>Ministério</Text>
              <Text style={styles.cardDate}>{proxima.ministerio}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* TÍTULO DA TABELA */}
      <Text style={styles.escalaTexto}>Minha Escala Mensal:</Text>

      {/* TABELA */}
      <View style={styles.tabela}>
        {/* Cabeçalho */}
        <View style={styles.tabelaLinhaHeader}>
          <Text style={styles.tabelaHeaderTexto}>DATA</Text>
          <Text style={styles.tabelaHeaderTexto}>DIA</Text>
          <Text style={styles.tabelaHeaderTexto}>MINISTÉRIO</Text>
        </View>

        <ScrollView>
          {escalas.map((item, index) => {
            const dataObj = item.data;
            const dataFormatada = dataObj.toLocaleDateString("pt-BR");
            const diaSemana = dataObj.toLocaleDateString("pt-BR", { weekday: "long" });

            return (
              <View key={index} style={styles.tabelaLinha}>
                <Text style={styles.tabelaTexto}>{dataFormatada}</Text>
                <Text style={styles.tabelaTexto}>{diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</Text>
                <Text style={styles.tabelaTexto}>{item.ministerio}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* RODAPÉ */}
      <UsuarioInferior navigation={navigation} />
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
});
