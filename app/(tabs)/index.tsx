// app/(tabs)/index.tsx
import { ScrollView, StatusBar } from "react-native";
import {
  HealthStatusCard,
  DynamicAppointments,
  EmergencyCard,
} from "@/components/home/index";
import { Appointment, Reminder } from "@/types/home";
import UserCard from "@/components/home/UserCard";

const mockAppointments: Appointment[] = [];
const mockReminders: Reminder[] = [
  {
    id: "1",
    type: "vaccine",
    name: "Flu Shot",
    dueDate: "Due by October 15",
  },
  {
    id: "2",
    type: "checkup",
    name: "Annual Physical",
    dueDate: "Due in 2 weeks",
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <StatusBar
        // Android only
        barStyle="dark-content" // changes text/icons
      />
      <UserCard />
      <HealthStatusCard />

      <EmergencyCard />
      <DynamicAppointments />
    </ScrollView>
  );
}
