// components/home/DynamicAppointments.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Appointment {
  id: string;
  doctor: string;
  specialization: string;
  date: string;
  time: string;
}

interface DynamicAppointmentsProps {
  appointments: Appointment[];
}

const DynamicAppointments = ({ appointments }: DynamicAppointmentsProps) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-clear" size={32} color="#9CA3AF" />
          <Text style={styles.emptyText}>No upcoming appointments</Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        appointments.map((appointment) => (
          <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.doctorName}>{appointment.doctor}</Text>
              <Text style={styles.specialization}>
                {appointment.specialization}
              </Text>
              <Text style={styles.time}>
                {appointment.date} • {appointment.time}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: "#1F2937",
  },
  seeAll: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  emptyText: {
    color: "#6B7280",
    marginVertical: 8,
  },
  bookButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "500",
  },
  appointmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorName: {
    fontWeight: "500",
    color: "#1F2937",
  },
  specialization: {
    color: "#6B7280",
    fontSize: 14,
  },
  time: {
    color: "#3B82F6",
    fontSize: 14,
    marginTop: 4,
  },
});

export default DynamicAppointments;
