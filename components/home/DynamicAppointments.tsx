// components/home/DynamicAppointments.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the path to your firebaseConfig

interface Appointment {
  id: string;
  doctorName: string;
  services: string[];
  date: string;
  time: string;
  patientName: string;
  status: string;
  contactInfo: string;
  createdAt: string;
}

const DynamicAppointments = () => {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setAppointment({
            id: doc.id,
            doctorName: data.doctorName,
            services: data.services,
            date: data.date,
            time: data.time,
            patientName: data.patientName,
            status: data.status,
            contactInfo: data.contactInfo,
            createdAt: data.createdAt.toDate().toString(),
          });
        } else {
          setAppointment(null);
        }
      } catch (error) {
        console.error("Error fetching appointment: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {appointment ? (
        <TouchableOpacity style={styles.appointmentCard}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <Text style={styles.specialization}>
              {appointment.services.join(", ")}
            </Text>
            <Text style={styles.time}>
              {appointment.date} • {appointment.time}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-clear" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No upcoming appointments</Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  seeAll: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  emptyText: {
    color: "#6B7280",
    marginVertical: 8,
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  appointmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentInfo: {
    flex: 1,
    marginRight: 8,
  },
  doctorName: {
    fontWeight: "600",
    color: "#1F2937",
    fontSize: 18,
  },
  specialization: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    color: "#3B82F6",
    fontSize: 14,
    marginTop: 8,
  },
});

export default DynamicAppointments;
