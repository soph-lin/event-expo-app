import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { SpeakerCard } from "@/components/SpeakerCard";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Speaker } from "@/types";
import { speakers } from "@/utils/mockData";

export default function SpeakersScreen() {
  const { colors } = useTheme();
  const [loadedSpeakers, setLoadedSpeakers] = useState<Speaker[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]);

  const loadSpeakers = useCallback(() => {
    // Set the speakers data
    setLoadedSpeakers(speakers);

    // Reset and initialize animation values
    animatedValues.current = speakers.map(() => new Animated.Value(0));

    // Start staggered animations
    Animated.stagger(
      100, // Delay between each animation
      animatedValues.current.map((value) =>
        Animated.spring(value, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  // Load speakers when screen comes into focus
  useFocusEffect(loadSpeakers);

  const renderSpeaker = ({ item, index }: { item: Speaker; index: number }) => {
    const translateY =
      animatedValues.current[index]?.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
      }) || new Animated.Value(0);

    const opacity = animatedValues.current[index] || new Animated.Value(0);

    return (
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
        }}
      >
        <SpeakerCard speaker={item} />
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <ThemedText type="title" style={styles.header}>
          Speakers
        </ThemedText>
        <FlatList
          data={loadedSpeakers}
          renderItem={renderSpeaker}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <ThemedText style={styles.emptyText}>No speakers found</ThemedText>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
