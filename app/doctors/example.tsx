import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  name: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#333",
    fontSize: 20,
  },
  paragraph: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 10,
    borderRadius: 4,
    cursor: "pointer",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});

const ExampleComponent: React.FC<Props> = ({ name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hello, {name}!</Text>
      <Text style={styles.paragraph}>
        This is an example React Native component with styling.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Button Pressed")}
      >
        <Text style={styles.buttonText}>Click Me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExampleComponent;
