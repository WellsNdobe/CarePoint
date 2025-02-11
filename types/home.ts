// types/home.ts
export interface Appointment {
  id: string;
  doctor: string;
  specialization: string;
  date: string;
  time: string;
}

export interface Reminder {
  id: string;
  type: "vaccine" | "checkup" | "test";
  name: string;
  dueDate: string;
}
