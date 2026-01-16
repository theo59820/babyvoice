import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: t("home") }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t("settings") }} />
    </Stack.Navigator>
  );
}
