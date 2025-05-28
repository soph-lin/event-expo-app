import { useRouter } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { Speaker } from "@/types";
import { speakers } from "@/utils/mockData";

export default function SpeakersScreen() {
  const router = useRouter();

  const renderSpeaker = ({ item }: { item: Speaker }) => (
    <TouchableOpacity
      style={styles.speakerItem}
      onPress={() => router.push("/(tabs)/about")}
    >
      <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
      <ThemedText>{item.bio}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Speakers
      </ThemedText>
      <FlatList
        data={speakers}
        renderItem={renderSpeaker}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  speakerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
