import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
// ...other imports...

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* other screens */}
    </Stack.Navigator>
  );
}
                     