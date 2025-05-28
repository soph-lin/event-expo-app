import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const ZOOM_LEVELS = [1, 2, 3, 4];
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function TabTwoScreen() {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      if (newScale >= MIN_ZOOM && newScale <= MAX_ZOOM) {
        scale.value = newScale;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const handleZoomIn = useCallback(() => {
    const nextLevel = (currentZoomLevel + 1) % ZOOM_LEVELS.length;
    setCurrentZoomLevel(nextLevel);
    scale.value = withSpring(ZOOM_LEVELS[nextLevel]);
    savedScale.value = ZOOM_LEVELS[nextLevel];
  }, [currentZoomLevel]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleZoom = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(Math.round(savedScale.value));
    const nextIndex = (currentIndex + 1) % ZOOM_LEVELS.length;
    const newScale = ZOOM_LEVELS[nextIndex];

    scale.value = withSpring(newScale);
    savedScale.value = newScale;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      backgroundColor: colors.background,
      zIndex: 1,
    },
    header: {
      padding: 16,
    },
    contentContainer: {
      flex: 1,
      position: "relative",
    },
    mapContainer: {
      flex: 1,
      backgroundColor: colors.card,
      overflow: "hidden",
    },
    mapWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      transformOrigin: "center",
    },
    map: {
      width: "100%",
      height: "100%",
    },
    zoomButton: {
      position: "absolute",
      bottom: 32,
      right: 32,
      backgroundColor: colors.card,
      borderRadius: 25,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    zoomText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <ThemedView style={styles.container}>
          <View style={styles.headerContainer}>
            <ThemedText type="title" style={styles.header}>
              Explore
            </ThemedText>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.mapContainer}>
              <GestureDetector gesture={composed}>
                <Animated.View style={[styles.mapWrapper, animatedStyle]}>
                  <Image
                    source={require("@/assets/images/placeholder-map.jpg")}
                    style={[styles.map, { backgroundColor: colors.card }]}
                    contentFit="cover"
                  />
                </Animated.View>
              </GestureDetector>
            </View>

            <TouchableOpacity style={styles.zoomButton} onPress={handleZoom}>
              <Ionicons name="add" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
