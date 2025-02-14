import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { useState, useEffect, SetStateAction } from "react";
import { Doctor } from "@/types/doctor";
import { doctors } from "@/services/mockDoctors";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function AppointmentBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const doctor: Doctor | undefined = doctors.find((d) => d.id === Number(id));

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const generateTimeSlots = () => [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots(generateTimeSlots());
      setSelectedTime("");
    }
  }, [selectedDate]);

  const handleBooking = async () => {
    if (
      !user?.email ||
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTime
    ) {
      Alert.alert("Error", "Please select a service, date, and time.");
      return;
    }

    setLoading(true);
    try {
      const appointmentRef = doc(db, "appointments", user.email);
      await setDoc(appointmentRef, {
        userEmail: user.email,
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        services: selectedServices,
        date: selectedDate,
        time: selectedTime,
        status: "pending",
        createdAt: new Date(),
      });

      Alert.alert(
        "Success",
        `Appointment with ${doctor?.name} on ${selectedDate} at ${selectedTime} confirmed.`
      );
      setSelectedServices([]);
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.title}>Book an Appointment</Text>

      {doctor ? (
        <Text style={styles.subtitle}>
          {doctor.name} - {doctor.specialization}
        </Text>
      ) : (
        <Text style={styles.subtitle}>Doctor not found</Text>
      )}

      <Text style={styles.sectionTitle}>Select Date</Text>
      <Calendar
        minDate={new Date().toISOString().split("T")[0]}
        onDayPress={(day: { dateString: SetStateAction<string> }) =>
          setSelectedDate(day.dateString)
        }
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#007BFF" },
        }}
        theme={{ todayTextColor: "#007BFF", arrowColor: "#007BFF" }}
      />

      {selectedDate && (
        <>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.timeSlotContainer}>
            {availableSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={
                    selectedTime === time
                      ? styles.selectedTimeText
                      : styles.timeText
                  }
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Select Services</Text>
      {doctor?.services.map((service, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.serviceItem,
            selectedServices.includes(service.name) &&
              styles.serviceItemSelected,
          ]}
          onPress={() =>
            setSelectedServices((prev) =>
              prev.includes(service.name)
                ? prev.filter((s) => s !== service.name)
                : [...prev, service.name]
            )
          }
        >
          <Text style={{ flex: 1, color: "#333" }}>{service.name}</Text>
          <Text style={{ color: "#007BFF" }}>R{service.price}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBooking}
        disabled={loading}
      >
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Confirm Appointment"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#555", marginBottom: 20 },
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
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  timeSlot: { padding: 10, borderRadius: 5, backgroundColor: "#f1f1f1" },
  selectedTimeSlot: { backgroundColor: "#007BFF" },
  timeText: { color: "#333" },
  selectedTimeText: { color: "white" },
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
