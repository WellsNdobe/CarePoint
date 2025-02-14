import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>
          Oops! We wonder how you ended up here but the page you wanted does not
          exist or still in development
        </Text>
        <Text style={styles.subtitle}>
          The page you're looking for couldn't be found
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1f2937", // Gray-800
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563", // Gray-600
    marginBottom: 24,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#3b82f6", // Blue-500
    borderRadius: 8,
  },
  linkText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});
