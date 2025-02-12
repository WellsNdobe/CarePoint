// components/home/EmergencyCard.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const EmergencyCard = () => {
  const handleEmergencyCall = () => {
    Linking.openURL("tel:10111");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Services</Text>

      <TouchableOpacity
        style={[styles.button, styles.emergencyButton]}
        onPress={handleEmergencyCall}
      >
        <Ionicons name="call" size={24} color="white" />
        <Text style={styles.buttonText}>Emergency Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/ambulance")}
      >
        <Ionicons name="medkit" size={24} color="#3B82F6" />
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Get Ambulance
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: "white",
  },
  emergencyButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    marginLeft: 12,
    fontWeight: "500",
    fontSize: 16,
    color: "white",
  },
  secondaryButtonText: {
    color: "#1F2937",
  },
});

export default EmergencyCard;
