// components/home/HealthStatusCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HealthStatusCardProps {
  lastCheckup?: string;
  nextAppointment?: string;
  medications?: number;
}

const HealthStatusCard = ({
  lastCheckup,
  nextAppointment,
  medications = 0,
}: HealthStatusCardProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Summary</Text>
        <Ionicons name="medkit" size={20} color="#3B82F6" />
      </View>

      <View style={styles.item}>
        <Ionicons name="calendar" size={16} color="#6B7280" />
        <Text style={styles.text}>{lastCheckup || "No recent checkups"}</Text>
      </View>

      <View style={styles.item}>
        <Ionicons name="time" size={16} color="#6B7280" />
        <Text style={styles.text}>
          {nextAppointment || "No upcoming appointments"}
        </Text>
      </View>

      <View style={styles.item}>
        <Ionicons name="medical" size={16} color="#6B7280" />
        <Text style={styles.text}>
          {medications} active medication{medications !== 1 ? "s" : ""}
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
