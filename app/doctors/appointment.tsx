import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { Doctor } from "@/types/doctor";
import { doctors } from "@/services/mockDoctors";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";

export default function AppointmentBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = doctors.find((d: Doctor) => d.id === Number(id));

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  if (!doctor) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "red", fontSize: 18 }}>Doctor not found</Text>
      </View>
    );
  }

  const toggleServiceSelection = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleBooking = () => {
    if (!name || !contact || selectedServices.length === 0) {
      Alert.alert(
        "Error",
        "Please fill in all details and select at least one service."
      );
      return;
    }

    Alert.alert(
      "Appointment Confirmed",
      `Your appointment with ${doctor.name} for ${selectedServices.join(
        ", "
      )} has been booked.`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Book an Appointment</Text>
      <Text style={styles.subtitle}>
        Dr. {doctor.name} - {doctor.specialization}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Contact Number"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Select Services</Text>
      {doctor.services.map((service, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.serviceItem,
            selectedServices.includes(service.name) &&
              styles.serviceItemSelected,
          ]}
          onPress={() => toggleServiceSelection(service.name)}
        >
          <Text style={{ flex: 1, color: "#333" }}>{service.name}</Text>
          <Text style={{ color: "#007BFF" }}>R{service.price}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>Confirm Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#555", marginBottom: 20 },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceItemSelected: { backgroundColor: "#cce5ff" },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
