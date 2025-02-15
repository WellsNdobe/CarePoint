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
            <Text style={styles.modalTitle}>All Appointments</Text>
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  seeAll: { color: "#7752FE", fontWeight: "bold" },
  appointmentCard: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  appointmentInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: "bold" },
  specialization: { color: "#6B7280" },
  time: { color: "#6B7280", fontSize: 14 },
  emptyContainer: { alignItems: "center", marginTop: 20 },
  emptyText: { color: "#9CA3AF", marginTop: 10 },
  bookButton: {
    backgroundColor: "#7752FE",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  bookButtonText: { color: "white", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  closeButton: {
    backgroundColor: "#7752FE",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontWeight: "bold" },
});

export default DynamicAppointments;
