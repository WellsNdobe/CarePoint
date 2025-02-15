import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import AuthContext from "../../app/context/AuthContext";

const UserCard: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return null;
  }
  const { user } = authContext;

  // Check if the user is logged in as a guest
  const isGuest = user?.email === "example@gmail.com";

  if (!isGuest) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.warningText}>
        ⚠ You are using a guest account. This account is shared and not private.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#ffcc00",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b4000",
    textAlign: "center",
  },
});

export default UserCard;
