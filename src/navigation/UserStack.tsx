import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Temporary placeholder screen
function PlaceholderScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Placeholder Screen</Text>
    </View>
  );
}

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Placeholder"
        component={PlaceholderScreen}
        options={{ title: "Coming Soon" }}
      />
    </Stack.Navigator>
  );
}
