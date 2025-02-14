import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import AuthContext from "../../app/context/AuthContext";

const UserCard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const username = user?.name || "Guest";

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {username}!</Text>
      <Text style={styles.text}>We're glad to have you back.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
});

export default UserCard;
