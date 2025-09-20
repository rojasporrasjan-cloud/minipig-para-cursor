// lib/welcomeKitTemplates.ts

// Define la estructura de cada tarea en nuestra checklist.
export type ChecklistTemplateItem = {
  id: string; // Un identificador único para la tarea
  text: string; // El texto que verá el usuario
  link?: string; // Un enlace opcional a una guía en tu blog
};

// Esta es la lista de tareas que compondrá el Kit de Bienvenida.
export const welcomeKitChecklist: ChecklistTemplateItem[] = [
  { 
    id: 'prepare-space', 
    text: 'Preparar su cama y un espacio seguro en casa.' 
  },
  { 
    id: 'read-food-guide', 
    text: 'Leer nuestra guía de alimentación recomendada.', 
    link: '/blog/alimentacion-recomendada' // ¡Conectado directamente a tu blog!
  },
  { 
    id: 'schedule-vet', 
    text: 'Programar la primera visita de control con el veterinario.' 
  },
  { 
    id: 'share-photo', 
    text: '¡Compartir su primera foto y etiquetarnos en redes sociales!' 
  },
];