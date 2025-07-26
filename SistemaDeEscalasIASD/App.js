import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CarregandoApp from "./telas/carregando";
import Login from "./telas/login"

const Stack = createNativeStackNavigator(); // CORRIGIDO: letra maiúscula

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CarregandoApp">
        <Stack.Screen
          name="CarregandoApp"
          component={CarregandoApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
