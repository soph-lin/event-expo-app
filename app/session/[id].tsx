import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { sessions } from "@/utils/mockData";

export default function SessionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const session = sessions.find((s) => s.id === id);
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const checkFavorite = async () => {
      try {
        const existingFavorites = await AsyncStorage.getItem("favorites");
        const favorites = existingFavorites
          ? JSON.parse(existingFavorites)
          : [];
        setIsFavorite(favorites.includes(id));
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkFavorite();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem("favorites");
      const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
      if (isFavorite) {
        const newFavorites = favorites.filter((favId: string) => favId !== id);
        await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      } else {
        favorites.push(id);
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (!session) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
        <ThemedView style={styles.content}>
          <ThemedText>Session not found.</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: "Event Description",
          headerBackTitle: "All Events",
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          animation: "slide_from_right",
          presentation: "card",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {session.title}
          </ThemedText>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color="#FFD700"
            />
          </TouchableOpacity>
        </ThemedView>
        <ThemedText style={styles.details}>
          {session.time} - {session.speaker}
        </ThemedText>
        <ThemedText style={styles.description}>
          This is a detailed description of the session. It can include more
          information about the topic, speaker, and what attendees can expect.
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
