// lib/types/pig.ts
import { Timestamp } from "firebase/firestore";

export type PigStatus = 'disponible' | 'reservado' | 'vendido';
export type PigVisibility = 'public' | 'private';
export type PigSex = 'macho' | 'hembra';

/**
 * Representa un hito importante en la vida de un cerdito.
 * 'icon' se usará para mostrar un ícono temático en la línea de tiempo.
 */
export type Milestone = {
  id: string; // Un ID único para cada hito, ej: timestamp
  date: Timestamp;
  title: string;
  description: string;
  icon: 'birth' | 'health' | 'home'; // Tipos de hitos predefinidos
};

export type Pig = {
  id?: string;
  name: string;
  name_lowercase?: string;
  ageMonths: number;
  priceCRC: number;
  status: PigStatus;
  visibility: PigVisibility;
  sex: PigSex;
  
  description?: string;
  images?: string[];
  
  // --- NUEVOS CAMPOS PARA EL EXPEDIENTE Y LA PÁGINA PRINCIPAL ---
  birthDate?: Timestamp; // Fecha exacta de nacimiento
  milestones?: Milestone[]; // Un array para la historia del cerdito
  isPigOfTheMonth?: boolean; // Para destacarlo en la página de inicio

  ownerId?: string;
  completedChecklistItems?: string[];

  // Marcas de tiempo
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};