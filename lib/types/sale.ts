import { Timestamp } from "firebase/firestore";

export const saleStatuses = ['consulta', 'reservado', 'pagado', 'entregado', 'cancelado'] as const;
export type SaleStatus = typeof saleStatuses[number];

// --- Estructura para el Cupón de Bienvenida ---
export type WelcomeCoupon = {
  code: string; // El código único, ej: BIENVENIDOLUNA15
  discount: number; // El porcentaje de descuento, ej: 15
  status: 'active' | 'used'; // Para controlar que sea de un solo uso
};

export type Sale = {
  id?: string;
  pigId: string;
  pigName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerId?: string;
  
  // --- Campo para el Cupón de Bienvenida ---
  welcomeCoupon?: WelcomeCoupon;

  saleDate: Timestamp;
  price: number;
  status: SaleStatus;
  notes?: string;
  createdAt?: Timestamp;
};