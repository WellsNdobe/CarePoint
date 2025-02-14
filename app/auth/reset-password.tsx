import { useState } from "react";
import { Button, TextInput, View, Alert, StatusBar } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    try {
      await resetPassword(email);
      Alert.alert("Success", "Password reset email sent");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <StatusBar
        // Android only
        barStyle="dark-content" // changes text/icons
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Send Reset Email" onPress={handleReset} />
    </View>
  );
}
