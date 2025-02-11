// app/(tabs)/profile.tsx
import { View, Text, StyleSheet, StatusBar } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        // Android only
        barStyle="dark-content" // changes text/icons
      />
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.text}>
        Medical history, insurance info, and settings.
      </Text>
      {/* Will implement profile features later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#64748B",
  },
});
