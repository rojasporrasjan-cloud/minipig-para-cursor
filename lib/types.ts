// lib/types.ts
export type Category = 'Alimento' | 'Higiene' | 'Accesorios' | 'Camas';
export type Tag = 'Top ventas' | 'Nuevo' | 'Popular' | 'Confort';

export type Product = {
  id: string;
  name: string;
  priceCRC: number;
  category: Category;
  tag?: Tag;
  photoUrl?: string; // opcional (por ahora usamos emoji en tarjetas)
  short: string;
  inStock: boolean;
  stock?: number; // <-- Nuevo campo de stock
  featured?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

// Re-export types from other files
export type { Pig } from './pig';
export type { Sale } from './sale';
export type { 
  PigDiary,
  PostAdoptionMilestone,
  GrowthRecord,
  HealthRecord,
  PrivatePhoto,
  PersonalizedRecommendation,
  PostAdoptionMilestoneType,
  RecommendationTemplate,
} from './diary';