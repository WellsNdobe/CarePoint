// components/profile/ProfilePage.tsx
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the path to your firebaseConfig

const ProfilePage = () => {
  const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch the number of upcoming appointments
  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("status", "==", "pending")); // Filter by "pending" status
        const querySnapshot = await getDocs(q);

        setUpcomingAppointmentsCount(querySnapshot.size); // Count the number of pending appointments
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingAppointments();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color="#3B82F6" />
          <Text style={styles.name}>Wells</Text>
          <Text style={styles.email}>wells@example.com</Text>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Appointments</Text>
          <Text style={styles.cardValue}>
            {upcomingAppointmentsCount} appointment
            {upcomingAppointmentsCount !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Other Information (Hardcoded for now) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phone Number</Text>
          <Text style={styles.cardValue}>+1 234 567 890</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Date of Birth</Text>
          <Text style={styles.cardValue}>January 1, 1990</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Address</Text>
          <Text style={styles.cardValue}>123 Main St, City, Country</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E3A8A",
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1E3A8A",
  },
});

export default ProfilePage;
// components/home/HealthStatusCard.tsx
