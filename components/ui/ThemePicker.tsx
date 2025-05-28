import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const rippleColor = useSharedValue(colors.background);
  const width = useSharedValue(44); // Width of single circle

  // Reorder themes to put selected theme first
  const orderedThemes = [theme, ...THEMES.filter((t) => t.name !== theme.name)];

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

      // Animate width first, then update state
      width.value = withTiming(
        44,
        {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(setIsExpanded)(false);
          }
        }
      );
    },
    [setTheme]
  );

  const toggleExpanded = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      width.value = withTiming(44 + (THEMES.length - 1) * 44, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      width.value = withTiming(
        44,
        {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(setIsExpanded)(false);
          }
        }
      );
    }
  }, [isExpanded]);

  const rippleStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: rippleColor.value,
    borderRadius: 999,
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Animated.View style={[styles.themePicker, containerStyle]}>
        <Animated.View style={rippleStyle} />
        <View style={styles.buttonsContainer}>
          {orderedThemes.map((t, index) => (
            <TouchableOpacity
              key={t.name}
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    theme.name === t.name ? colors.card : "transparent",
                  opacity: isExpanded || index === 0 ? 1 : 0,
                  position: index === 0 ? "relative" : "absolute",
                  left: index === 0 ? 0 : index * 44,
                  zIndex: isExpanded ? 1 : 0,
                },
              ]}
              onPress={() => {
                if (index === 0) {
                  toggleExpanded();
                } else {
                  handleThemeChange(t);
                }
              }}
            >
              <Ionicons
                name={t.icon as any}
                size={24}
                color={theme.name === t.name ? colors.cardText : colors.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
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
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 22,
    margin: 16,
    padding: 4,
    overflow: "hidden",
    height: 44,
  },
  buttonsContainer: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
