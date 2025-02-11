// components/home/RemindersList.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Reminder {
  id: string;
  type: "vaccine" | "checkup" | "test";
  name: string;
  dueDate: string;
}

interface RemindersListProps {
  reminders: Reminder[];
}

const RemindersList = ({ reminders }: RemindersListProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "vaccine":
        return "medkit";
      case "checkup":
        return "heart";
      case "test":
        return "flask";
      default:
        return "alert-circle";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Reminders</Text>

      {reminders.map((reminder) => (
        <TouchableOpacity key={reminder.id} style={styles.reminderCard}>
          <Ionicons name={getIcon(reminder.type)} size={24} color="#3B82F6" />
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderName}>{reminder.name}</Text>
            <Text style={styles.dueDate}>{reminder.dueDate}</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Mark Done</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  reminderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reminderName: {
    fontWeight: "500",
    color: "#1F2937",
  },
  dueDate: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  actionText: {
    color: "#3B82F6",
    fontWeight: "500",
  },
});

export default RemindersList;
