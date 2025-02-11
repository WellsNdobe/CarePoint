import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Doctor } from "@/types/doctor";
import { router } from "expo-router";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.push(`/doctors/${doctor.id}`)}
    >
      <Image
        source={{ uri: doctor.image }}
        style={styles.doctorImage}
        resizeMode="cover"
      />

      <View style={styles.textContainer}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialization}</Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={16} color="#4B5563" />
          <Text style={styles.locationText}>{doctor.location}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={20} color="#3B82F6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  favoriteButton: {
    padding: 8,
    alignSelf: "flex-start",
  },
});
