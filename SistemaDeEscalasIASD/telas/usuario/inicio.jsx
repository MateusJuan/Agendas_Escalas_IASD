import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UsuarioInferior from "../barras/usuarioinferior";

export default function InicioUsuario({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Topo com logo, busca e perfil */}
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

      {/* Cartão de próxima escala */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Ícone e data */}
          <View style={styles.cardItem}>
            <MaterialIcons name="calendar-month" size={24} color="#fff" />
            <View style={styles.cardItemText}>
              <Text style={styles.cardTitle}>Próximo Dia Escalado</Text>
              <Text style={styles.cardDate}>27/07/2025</Text>
            </View>
          </View>

          {/* Ícone e ministério */}
          <View style={styles.cardItem}>
            {/* Ícone "church" não existe no Material Icons padrão, pode usar "account-balance" ou "church" se tiver */}
            <MaterialIcons name="church" size={24} color="#fff" />
            <View style={styles.cardItemText}>
              <Text style={styles.cardTitle}>Ministério</Text>
              <Text style={styles.cardDate}>Sonoplastia</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Texto da escala mensal */}
      <Text style={styles.escalaTexto}>Minha Escala Mensal:</Text>

      {/* Rodapé de navegação */}
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
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#2e3e4e",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
  },
});
