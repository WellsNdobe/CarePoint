export interface Service {
  name: string;
  price: number;
}

export interface Doctor {
  image?: string;
  id: number;
  name: string;
  specialization: string;
  location: string;
  services: Service[];
  phone?: string;
  experience?: string;
  rating?: string;
}
