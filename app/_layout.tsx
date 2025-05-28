import { Stack, usePathname } from "expo-router";
import { useMemo } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemePicker } from "@/components/ui/ThemePicker";
import { ThemeProvider } from "@/hooks/useTheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const isSessionPage = useMemo(
    () => pathname.startsWith("/session/"),
    [pathname]
  );

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "default",
              presentation: "card",
              animationTypeForReplace: "push",
              gestureEnabled: true,
              gestureDirection: "horizontal",
              fullScreenGestureEnabled: true,
            }}
          />
          <View
            style={[{ position: "absolute", top: 0, right: 0, zIndex: 1000 }]}
          >
            <ThemePicker />
          </View>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
