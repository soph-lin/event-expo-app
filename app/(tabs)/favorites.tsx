import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { SessionCard } from "@/components/SessionCard";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Session } from "@/types";
import { sessions } from "@/utils/mockData";

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritedSessions, setFavoritedSessions] = useState<Session[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]);

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

      // Reset and initialize animation values
      animatedValues.current = favorited.map(() => new Animated.Value(0));

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

  const renderSession = ({ item, index }: { item: Session; index: number }) => {
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
        <SessionCard
          session={item}
          isFavorited={favorites.includes(item.id)}
          onFavoritePress={toggleFavorite}
        />
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
