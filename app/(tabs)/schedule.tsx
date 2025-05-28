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

export default function ScheduleScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]);

  const loadFavorites = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem("favorites");
      if (!existingFavorites) {
        await AsyncStorage.setItem("favorites", JSON.stringify([]));
        setFavorites([]);
        return;
      }
      setFavorites(JSON.parse(existingFavorites));

      // Initialize animation values at 0
      animatedValues.current = sessions.map(() => new Animated.Value(0));

      // Start staggered animations
      Animated.stagger(
        100,
        animatedValues.current.map((value) =>
          Animated.spring(value, {
            toValue: 1,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
          })
        )
      ).start();
    } catch (error) {
      console.error("Error loading favorites:", error);
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
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const addToFavorites = async (sessionId: string) => {
    try {
      const newFavorites = [...favorites];
      if (newFavorites.includes(sessionId)) {
        const index = newFavorites.indexOf(sessionId);
        newFavorites.splice(index, 1);
      } else {
        newFavorites.push(sessionId);
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
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
          onFavoritePress={addToFavorites}
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
