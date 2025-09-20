// lib/types/testimonial.ts
import { Timestamp } from "firebase/firestore";

export type TestimonialStatus = 'pending' | 'approved';

export type Testimonial = {
  id?: string;
  userId: string;       // ID del usuario que envía la historia
  userName: string;     // Nombre del usuario
  pigId: string;        // ID del cerdito sobre el que se escribe
  pigName: string;      // Nombre del cerdito
  text: string;         // El testimonio o anécdota
  imageUrl: string;     // La foto que sube el cliente
  status: TestimonialStatus; // Estado para tu aprobación
  createdAt: Timestamp;
};