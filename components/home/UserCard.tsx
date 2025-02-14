import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import AuthContext from "../../app/context/AuthContext";

const UserCard: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return null;
  }
  const { user } = authContext;

  // Extract the first name from the user object or default to "User"
  const firstName = user?.firstName || "User";

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {firstName}!</Text>
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
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b", // A dark shade for better readability
  },
  text: {
    fontSize: 16,
    color: "#64748b", // A softer shade for secondary text
  },
});

export default UserCard;
