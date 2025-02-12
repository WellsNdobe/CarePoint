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
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Summary</Text>
        <Ionicons name="medkit" size={20} color="#3B82F6" />
      </View>

      {/* Last Checkup */}
      <View style={styles.item}>
        <Ionicons name="calendar" size={16} color="#6B7280" />
        <Text style={styles.text}>Last Checkup: {lastCheckup || "N/A"}</Text>
      </View>

      {/* Next Appointment */}
      <View style={styles.item}>
        <Ionicons name="time" size={16} color="#6B7280" />
        <Text style={styles.text}>
          Next Appointment: {nextAppointment || "No upcoming appointments"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  text: {
    color: "#374151",
    marginLeft: 8,
  },
});

export default HealthStatusCard;
