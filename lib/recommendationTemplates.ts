// lib/recommendationTemplates.ts
import { RecommendationTemplate } from './types/diary';

/**
 * Templates para generar recomendaciones automáticas basadas en la edad del cerdito
 */
export const recommendationTemplates: RecommendationTemplate[] = [
  // Recomendaciones para cerditos bebés (0-3 meses)
  {
    id: 'baby-feeding-guide',
    minAgeMonths: 0,
    maxAgeMonths: 3,
    type: 'article',
    title: 'Guía de alimentación para bebés',
    description: 'Tu cerdito está en la etapa más delicada. Aprende sobre la alimentación correcta para bebés.',
    actionUrl: '/blog/alimentacion-bebes',
    priority: 'high',
    isActive: true,
  },
  {
    id: 'baby-starter-kit',
    minAgeMonths: 0,
    maxAgeMonths: 2,
    type: 'product',
    title: 'Kit de bienvenida para bebés',
    description: 'Todo lo que necesitas para los primeros días de tu nuevo amigo.',
    actionUrl: '/tienda/kit-bienvenida-bebes',
    priority: 'high',
    isActive: true,
  },

  // Recomendaciones para cerditos jóvenes (3-6 meses)
  {
    id: 'training-basics',
    minAgeMonths: 3,
    maxAgeMonths: 6,
    type: 'article',
    title: 'Entrenamiento básico para jóvenes',
    description: 'Tu cerdito está listo para aprender los comandos básicos. ¡Empieza ahora!',
    actionUrl: '/blog/entrenamiento-basico',
    priority: 'medium',
    isActive: true,
  },
  {
    id: 'toys-young-pigs',
    minAgeMonths: 2,
    maxAgeMonths: 6,
    type: 'product',
    title: 'Juguetes para cerditos jóvenes',
    description: 'Estimula su mente y evita el aburrimiento con estos juguetes especiales.',
    actionUrl: '/tienda/juguetes-jovenes',
    priority: 'medium',
    isActive: true,
  },

  // Recomendaciones para cerditos adolescentes (6-12 meses)
  {
    id: 'spay-neuter-info',
    minAgeMonths: 6,
    maxAgeMonths: 8,
    type: 'article',
    title: '¿Es hora de la esterilización?',
    description: 'Tu cerdito está en la edad ideal para considerar la esterilización.',
    actionUrl: '/blog/esterilizacion-minipigs',
    priority: 'high',
    isActive: true,
  },
  {
    id: 'adolescent-diet',
    minAgeMonths: 6,
    maxAgeMonths: 12,
    type: 'article',
    title: 'Cambios en la alimentación adolescente',
    description: 'Ajusta la dieta de tu cerdito según su nueva etapa de desarrollo.',
    actionUrl: '/blog/alimentacion-adolescente',
    priority: 'medium',
    isActive: true,
  },

  // Recomendaciones para cerditos adultos (12+ meses)
  {
    id: 'adult-maintenance',
    minAgeMonths: 12,
    type: 'article',
    title: 'Cuidados de mantenimiento para adultos',
    description: 'Tu cerdito ya es adulto. Aprende sobre los cuidados específicos para esta etapa.',
    actionUrl: '/blog/cuidados-adultos',
    priority: 'low',
    isActive: true,
  },
  {
    id: 'senior-preparation',
    minAgeMonths: 36,
    type: 'article',
    title: 'Preparándonos para la edad dorada',
    description: 'Tu cerdito está entrando en su edad dorada. Conoce los cambios que vienen.',
    actionUrl: '/blog/cuidados-senior',
    priority: 'medium',
    isActive: true,
  },

  // Recordatorios de salud
  {
    id: 'vaccination-reminder',
    minAgeMonths: 3,
    type: 'reminder',
    title: 'Recordatorio de vacunas',
    description: 'Es importante mantener las vacunas al día. Consulta con tu veterinario.',
    priority: 'high',
    isActive: true,
  },
  {
    id: 'deworming-reminder',
    minAgeMonths: 2,
    type: 'reminder',
    title: 'Recordatorio de desparasitación',
    description: 'No olvides la desparasitación regular de tu cerdito.',
    priority: 'high',
    isActive: true,
  },

  // Tips generales
  {
    id: 'summer-care',
    minAgeMonths: 0,
    type: 'tip',
    title: 'Cuidados especiales en verano',
    description: 'El calor puede ser peligroso para los mini pigs. Aprende cómo protegerlo.',
    actionUrl: '/blog/cuidados-verano',
    priority: 'medium',
    isActive: true,
  },
  {
    id: 'winter-care',
    minAgeMonths: 0,
    type: 'tip',
    title: 'Preparándonos para el invierno',
    description: 'Los mini pigs necesitan cuidados especiales durante los meses fríos.',
    actionUrl: '/blog/cuidados-invierno',
    priority: 'medium',
    isActive: true,
  },
];

/**
 * Genera recomendaciones personalizadas para un cerdito basado en su edad
 */
export function generatePersonalizedRecommendations(
  pigAgeMonths: number,
  currentMonth: number = new Date().getMonth() + 1
): RecommendationTemplate[] {
  return recommendationTemplates
    .filter(template => {
      if (!template.isActive) return false;
      
      // Verificar edad
      const ageMatch = pigAgeMonths >= template.minAgeMonths && 
        (template.maxAgeMonths === undefined || pigAgeMonths <= template.maxAgeMonths);
      
      if (!ageMatch) return false;
      
      // Verificar si es una recomendación estacional
      if (template.id === 'summer-care') {
        return currentMonth >= 6 && currentMonth <= 9; // Junio-Septiembre
      }
      if (template.id === 'winter-care') {
        return currentMonth >= 11 || currentMonth <= 2; // Noviembre-Febrero
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenar por prioridad: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}
