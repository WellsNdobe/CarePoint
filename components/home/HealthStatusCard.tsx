// components/home/HealthStatusCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the path to your firebaseConfig

interface Appointment {
  id: string;
  date: string;
  status: string; // "pending" or "completed"
}

const HealthStatusCard = () => {
  const [nextAppointment, setNextAppointment] = useState<string | undefined>();
  const [lastCheckup, setLastCheckup] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, orderBy("date", "asc")); // Sort by date ascending
        const querySnapshot = await getDocs(q);

        const appointments: Appointment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointments.push({
            id: doc.id,
            date: data.date,
            status: data.status,
          });
        });

        // Calculate next appointment (first pending appointment)
        const next = appointments.find((a) => a.status === "pending")?.date;
        setNextAppointment(next);

        // Calculate last checkup (most recent completed appointment)
        const pastAppointments = appointments
          .filter((a) => a.status === "completed")
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        setLastCheckup(pastAppointments[0]?.date);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Summary</Text>
        <Ionicons name="medkit" size={24} color="#2563EB" />
      </View>

      {/* Last Checkup */}
      <View style={styles.item}>
        <Ionicons name="calendar" size={20} color="#9CA3AF" />
        <Text style={styles.text}>Last Checkup: {lastCheckup || "N/A"}</Text>
      </View>

      {/* Next Appointment */}
      <View style={styles.item}>
        <Ionicons name="time" size={20} color="#9CA3AF" />
        <Text style={styles.text}>
          Next Appointment: {nextAppointment || "No upcoming appointments"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  text: {
    color: "#4B5563",
    marginLeft: 10,
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
});

export default HealthStatusCard;
