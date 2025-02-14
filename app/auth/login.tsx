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
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    Alert.alert("Coming Soon", "Google login will be available soon");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back to CarePoint</Text>

      {/* Google Login Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>━ OR ━</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor="#666"
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Create Account Link */}
      <View style={styles.linksContainer}>
        <Text style={styles.loginText}>Don't have an account? </Text>
        <Link href="/auth/signUp" style={styles.loginLink}>
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </View>

      {/* Forgot Password Link */}
      <Link href="/auth/reset-password" style={styles.forgotLink}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD", // Light blue background
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2A2E43", // Dark blue for the title
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF", // White background for inputs
    borderColor: "#E0E0E0", // Light gray border
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
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // White background for Google button
    borderWidth: 1,
    borderColor: "#E0E0E0", // Light gray border
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#2A2E43", // Dark blue text
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    color: "#A0A4B8", // Gray text for "OR"
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#4285F4", // Blue background for login button
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
    color: "#FFFFFF", // White text for buttons
    fontSize: 16,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    color: "#666", // Gray text for secondary text
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
    color: "#4285F4", // Blue text for links
    fontSize: 14,
    fontWeight: "500",
  },
});
