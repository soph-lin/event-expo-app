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

export default function FavoritesScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritedSessions, setFavoritedSessions] = useState<Session[]>([]);

  const loadFavorites = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem("favorites");
      const favoriteIds = existingFavorites
        ? JSON.parse(existingFavorites)
        : [];
      setFavorites(favoriteIds);
      const favorited = sessions.filter((session) =>
        favoriteIds.includes(session.id)
      );
      setFavoritedSessions(favorited);
    } catch (error) {
      console.error("Error loading favorites:", error);
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

  const toggleFavorite = async (sessionId: string) => {
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
      // Update the favorited sessions list
      const favorited = sessions.filter((session) =>
        newFavorites.includes(session.id)
      );
      setFavoritedSessions(favorited);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const renderSession = ({ item }: { item: Session }) => (
    <SessionCard
      session={item}
      isFavorited={favorites.includes(item.id)}
      onFavoritePress={toggleFavorite}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ThemedText type="title" style={styles.header}>
          Favorites
        </ThemedText>
        <FlatList
          data={favoritedSessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <ThemedText style={styles.emptyText}>
              No favorite events yet
            </ThemedText>
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
