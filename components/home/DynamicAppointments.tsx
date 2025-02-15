import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!auth.currentUser?.email) {
        setLoading(false);
        return;
      }

      try {
        const userEmail = auth.currentUser.email;
        const appointmentsRef = collection(db, "appointments");
        const q = query(
          appointmentsRef,
          where("userEmail", "==", userEmail),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const fetchedAppointments: Appointment[] = querySnapshot.docs.map(
          (doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              doctorName: data.doctorName,
              services: data.services,
              date: data.date,
              time: data.time,
              patientName: data.patientName,
              status: data.status,
              contactInfo: data.contactInfo,
              createdAt: data.createdAt.toDate().toString(),
            };
          }
        );

        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [auth.currentUser]); // Ensure it updates when the user changes

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7752FE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        {appointments.length > 0 && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {appointments.length > 0 ? (
        <TouchableOpacity style={styles.appointmentCard}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>{appointments[0].doctorName}</Text>
            <Text style={styles.specialization}>
              {appointments[0].services.join(", ")}
            </Text>
            <Text style={styles.time}>
              {appointments[0].date} • {appointments[0].time}
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

      {/* Modal for displaying all appointments */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Appointments</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.appointmentCard}>
                  <Text style={styles.doctorName}>{item.doctorName}</Text>
                  <Text style={styles.specialization}>
                    {item.services.join(", ")}
                  </Text>
                  <Text style={styles.time}>
                    {item.date} • {item.time}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  seeAll: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "500",
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  appointmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginVertical: 16,
  },
  bookButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default DynamicAppointments;
