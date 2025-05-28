import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Animated, FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { SessionCard } from "@/components/SessionCard";
import { ThemedText } from "@/components/ThemedText";
import { Session } from "@/types";
import { sessions } from "@/utils/mockData";

export default function ScheduleScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem("favorites");
      // If no favorites exist in storage, initialize with empty array
      if (!existingFavorites) {
        await AsyncStorage.setItem("favorites", JSON.stringify([]));
        setFavorites([]);
        return;
      }
      setFavorites(JSON.parse(existingFavorites));
    } catch (error) {
      console.error("Error loading favorites:", error);
      // If there's an error, ensure we start with empty favorites
      setFavorites([]);
    }
  };

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const addToFavorites = async (sessionId: string) => {
    try {
      const newFavorites = [...favorites];
      if (newFavorites.includes(sessionId)) {
        // Remove from favorites
        const index = newFavorites.indexOf(sessionId);
        newFavorites.splice(index, 1);
      } else {
        // Add to favorites
        newFavorites.push(sessionId);
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const renderSession = ({ item }: { item: Session }) => (
    <SessionCard
      session={item}
      isFavorited={favorites.includes(item.id)}
      onFavoritePress={addToFavorites}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ThemedText type="title" style={styles.header}>
          Schedule
        </ThemedText>
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <ThemedText style={styles.emptyText}>No events found</ThemedText>
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
  listContainer: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
