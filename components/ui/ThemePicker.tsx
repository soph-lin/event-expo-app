import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@/types/theme";
import { THEMES } from "@/utils/themes";

export function ThemePicker() {
  const { theme, setTheme, colors } = useTheme();
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const rippleColor = useSharedValue(colors.background);

  const handleThemeChange = useCallback(
    (newTheme: Theme) => {
      rippleColor.value = newTheme.colors.background;
      rippleScale.value = 0;
      rippleOpacity.value = 1;
      rippleScale.value = withTiming(100, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      rippleOpacity.value = withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setTheme(newTheme);
    },
    [setTheme]
  );

  const rippleStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: rippleColor.value,
    borderRadius: 999,
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.themePicker}>
        <Animated.View style={rippleStyle} />
        {THEMES.map((t) => (
          <TouchableOpacity
            key={t.name}
            style={[
              styles.themeButton,
              {
                backgroundColor:
                  theme.name === t.name ? colors.card : "transparent",
              },
            ]}
            onPress={() => handleThemeChange(t)}
          >
            <Ionicons
              name={t.icon as any}
              size={24}
              color={theme.name === t.name ? colors.cardText : colors.text}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1000,
  },
  themePicker: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 20,
    margin: 16,
    padding: 4,
    overflow: "hidden",
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
});
