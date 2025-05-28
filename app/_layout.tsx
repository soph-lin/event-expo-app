import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemePicker } from "@/components/ui/ThemePicker";
import { ThemeProvider } from "@/hooks/useTheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // You can add any initialization logic here
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <View
            style={{ position: "absolute", top: 0, right: 0, zIndex: 1000 }}
          >
            <ThemePicker />
          </View>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
