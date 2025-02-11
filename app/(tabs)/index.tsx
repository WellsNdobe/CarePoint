// app/(tabs)/index.tsx
import { ScrollView, StatusBar } from "react-native";
import {
  HealthStatusCard,
  DynamicAppointments,
  EmergencyCard,
} from "@/components/home/index";
import { Appointment, Reminder } from "@/types/home";

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

      <HealthStatusCard
        lastCheckup="Last checkup: 3 months ago"
        medications={2}
      />

      <EmergencyCard />
      <DynamicAppointments appointments={mockAppointments} />
    </ScrollView>
  );
}
