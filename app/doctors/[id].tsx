import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Doctor } from "@/types/doctor";
import { doctors } from "@/services/mockDoctors";
import { Ionicons } from "@expo/vector-icons";

const theme = {
  colors: {
    primary: "#4A90E2",
    secondary: "#50E3C2",
    background: "#F8F9FA",
    text: "#2D3436",
    textLight: "#62676B",
    white: "#FFFFFF",
    success: "#27AE60",
    rating: "#F2C94C",
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  radii: {
    s: 8,
    m: 16,
    l: 24,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    // Modern, subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: theme.radii.m,
    marginRight: theme.spacing.m,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  specialization: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: theme.spacing.s,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.s,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: theme.spacing.m,
  },
  badge: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.m,
    paddingVertical: theme.spacing.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    // Elevated, friendly button shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: theme.spacing.s,
  },
});

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = doctors.find((d: Doctor) => d.id === Number(id));

  if (!doctor) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "red", fontSize: 18 }}>Doctor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: theme.spacing.xl * 2 }}
    >
      {/* Profile Header */}
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
          <View>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialization}>{doctor.specialization}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="location"
                size={16}
                color={theme.colors.textLight}
              />
              <Text style={{ color: theme.colors.textLight, marginLeft: 4 }}>
                {doctor.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: "#EBF5FF" }]}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: theme.colors.primary,
              }}
            >
              {doctor.rating || "4.2"}
            </Text>
            <Text style={{ color: theme.colors.textLight }}>Rating</Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: "#E0F8F3", marginLeft: theme.spacing.s },
            ]}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: theme.colors.success,
              }}
            >
              {doctor.experience}
            </Text>
            <Text style={{ color: theme.colors.textLight }}>Experience</Text>
          </View>
        </View>
      </View>

      {/* Contact Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <View>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={20} color={theme.colors.primary} />
            <Text
              style={{ color: theme.colors.text, marginLeft: theme.spacing.s }}
            >
              {doctor.phone || "+27 60 735 2577"}
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text
              style={{ color: theme.colors.text, marginLeft: theme.spacing.s }}
            >
              {doctor.location}
            </Text>
          </View>
        </View>
      </View>

      {/* Services Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Services & Pricing</Text>
        <View>
          {doctor.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: theme.colors.text }}>{service.name}</Text>
              </View>
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                R{service.price}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Appointment Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          Alert.alert(
            "Coming Soon",
            "The appointment booking feature is still in development."
          )
        }
        activeOpacity={0.9}
      >
        <Ionicons name="calendar" size={20} color={theme.colors.white} />
        <Text style={styles.buttonText}>Make Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
