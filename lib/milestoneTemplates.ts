// lib/milestoneTemplates.ts
import { Milestone } from './types/pig';

export type MilestoneTemplate = {
  key: string;
  title: string;
  defaultDescription: string;
  icon: Milestone['icon'];
};

export const milestoneTemplates: MilestoneTemplate[] = [
  {
    key: 'nacimiento',
    title: 'Nacimiento',
    defaultDescription: '¡Bienvenido al mundo! Un nuevo comienzo lleno de aventuras.',
    icon: 'birth',
  },
  {
    key: 'vacuna',
    title: 'Primera Vacuna',
    defaultDescription: 'Protegido y saludable. Recibí mi primera vacuna.',
    icon: 'health',
  },
  {
    key: 'desparasitacion',
    title: 'Desparasitación',
    defaultDescription: 'Libre de parásitos y listo para jugar sin preocupaciones.',
    icon: 'health',
  },
  {
    key: 'revision-vet',
    title: 'Revisión Veterinaria',
    defaultDescription: 'Visita al veterinario para un chequeo general. ¡Todo en orden!',
    icon: 'health',
  },
  {
    key: 'adopcion',
    title: 'Nuevo Hogar',
    defaultDescription: '¡El día más feliz! Encontré a mi nueva familia para toda la vida.',
    icon: 'home',
  },
];