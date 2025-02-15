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
import { LinearGradient } from "expo-linear-gradient";

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

  const handleServiceSelect = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fe" />

      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        {doctor && (
          <View style={styles.doctorInfo}>
            <Ionicons name="person-circle" size={40} color="#4a6cff" />
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.specialization}>{doctor.specialization}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <Calendar
          minDate={new Date().toISOString().split("T")[0]}
          onDayPress={(day: { dateString: SetStateAction<string> }) =>
            setSelectedDate(day.dateString)
          }
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#4a6cff",
              customStyles: {
                text: { color: "white", fontWeight: "600" },
              },
            },
          }}
          theme={{
            todayTextColor: "#4a6cff",
            arrowColor: "#4a6cff",
            textDayFontWeight: "500",
            textMonthFontWeight: "600",
            textDayHeaderFontWeight: "600",
          }}
        />
      </View>

      {selectedDate && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.timeGrid}>
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
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Services</Text>
        {doctor?.services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.serviceItem,
              selectedServices.includes(service.name) && styles.selectedService,
            ]}
            onPress={() => handleServiceSelect(service.name)}
          >
            <Ionicons
              name={
                selectedServices.includes(service.name)
                  ? "checkbox"
                  : "square-outline"
              }
              size={24}
              color={
                selectedServices.includes(service.name) ? "#4a6cff" : "#ccc"
              }
            />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>R{service.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBooking}
        disabled={loading}
      >
        <LinearGradient
          colors={["#667eea", "#4a6cff"]}
          style={styles.buttonGradient}
        >
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {loading ? "Processing..." : "Confirm Appointment"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fe",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  doctorDetails: {
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a237e",
  },
  specialization: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a237e",
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeSlot: {
    backgroundColor: "#f8f9fe",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: "30%",
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "#4a6cff",
  },
  timeText: {
    color: "#666",
    fontWeight: "500",
  },
  selectedTimeText: {
    color: "#fff",
    fontWeight: "600",
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: "#f8f9fe",
  },
  selectedService: {
    backgroundColor: "#e8edff",
    borderColor: "#4a6cff",
    borderWidth: 1,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
  },
  serviceName: {
    fontSize: 16,
    color: "#333",
  },
  servicePrice: {
    fontSize: 16,
    color: "#4a6cff",
    fontWeight: "600",
  },
  bookButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 24,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
