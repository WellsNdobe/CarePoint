import { useState } from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();

  const handleSignup = async () => {
    try {
      await signup(email, password);
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  const handleGoogleSignup = () => {
    // Implement Google signup logic here
    Alert.alert("Coming Soon", "Google signup will be available soon");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        // Android only
        barStyle="dark-content" // changes text/icons
      />
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Link href="/auth/login" style={styles.loginLink}>
          <Text style={styles.linkText}>Login here</Text>
        </Link>
      </View>

      <Link href="/auth/reset-password" style={styles.forgotLink}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2A2E43",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  signupButton: {
    backgroundColor: "#4285F4",
    borderRadius: 10,
    padding: 18,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    marginLeft: 5,
  },
  forgotLink: {
    marginTop: 15,
    alignSelf: "center",
  },
  linkText: {
    color: "#4285F4",
    fontSize: 14,
    fontWeight: "500",
  },
});
