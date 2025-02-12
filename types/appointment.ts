export interface Appointment {
  id?: string;
  patientName: string;
  contactInfo: string;
  doctorId: number;
  doctorName: string;
  services: string[];
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  userId?: string;
}
