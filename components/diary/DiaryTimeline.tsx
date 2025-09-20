// components/diary/DiaryTimeline.tsx
import { PostAdoptionMilestone } from '@/lib/types/diary';
import { Pig } from '@/lib/types/pig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DiaryTimelineProps {
  pig: Pig;
  milestones: PostAdoptionMilestone[];
  onAddMilestone: () => void;
}

const MilestoneIconMap = {
  health: '🩺',
  growth: '📏',
  training: '🎓',
  adventure: '🗺️',
  birthday: '🎂',
  milestone: '⭐',
  memory: '💝',
};

export default function DiaryTimeline({ pig, milestones, onAddMilestone }: DiaryTimelineProps) {
  // Función auxiliar para manejar fechas de manera segura
  const parseDate = (date: any): Date => {
    try {
      if (date && typeof date === 'object' && 'toDate' in date) {
        // Es un Timestamp de Firebase
        return (date as any).toDate();
      } else if (date instanceof Date) {
        return date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
      }
      return new Date(); // Fecha por defecto
    } catch (error) {
      console.warn('Error al procesar fecha:', error);
      return new Date(); // Fecha por defecto en caso de error
    }
  };

  // Combinar hitos pre-adopción (del expediente original) con post-adopción
  const preAdoptionMilestones = pig.milestones || [];
  const allMilestones = [
    ...preAdoptionMilestones.map(m => ({
      id: m.id,
      type: 'milestone' as const,
      title: m.title,
      description: m.description,
      date: m.date,
      images: [],
      addedBy: 'system',
      createdAt: m.date,
    })),
    ...milestones,
  ].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header con botón de añadir */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">Línea de Tiempo</h2>
          <p className="text-sm text-brand-text-muted">
            Todos los momentos importantes en la vida de {pig.name}
          </p>
        </div>
        <button
          onClick={onAddMilestone}
          className="btn-pig flex items-center gap-2"
        >
          <span>➕</span>
          Añadir Hito
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {allMilestones.length > 0 ? (
          <div className="space-y-8">
            {allMilestones.map((milestone, index) => {
              const isPreAdoption = milestone.addedBy === 'system';
              const milestoneDate = parseDate(milestone.date);
              
              return (
                <div key={milestone.id} className="relative flex items-start space-x-4">
                  {/* Línea conectora */}
                  {index < allMilestones.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-pink-200"></div>
                  )}
                  
                  {/* Ícono del hito */}
                  <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ring-4 ring-white ${
                    isPreAdoption 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-pink-100 text-pink-600'
                  }`}>
                    <span className="text-lg">
                      {isPreAdoption ? '🏠' : MilestoneIconMap[milestone.type]}
                    </span>
                  </div>

                  {/* Contenido del hito */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-brand-dark">
                        {milestone.title}
                      </h3>
                      {isPreAdoption && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Antes de la adopción
                        </span>
                      )}
                      {!isPreAdoption && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                          Después de la adopción
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-brand-text-muted mb-2">
                      {format(milestoneDate, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                    
                    <p className="text-brand-dark">
                      {milestone.description}
                    </p>

                    {/* Fotos del hito */}
                    {milestone.images && milestone.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {milestone.images.map((imageUrl, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                          >
                            <img
                              src={imageUrl}
                              alt={`Foto del hito: ${milestone.title}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Comienza a documentar la vida de {pig.name}!
            </h3>
            <p className="text-gray-500 mb-6">
              Añade hitos importantes como visitas al veterinario, cumpleaños, o momentos especiales.
            </p>
            <button
              onClick={onAddMilestone}
              className="btn-pig"
            >
              Añadir Primer Hito
            </button>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      {allMilestones.length > 0 && (
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <h4 className="font-semibold text-brand-dark mb-2">Estadísticas</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-brand-text-muted">Total de hitos</p>
              <p className="font-semibold text-brand-dark">{allMilestones.length}</p>
            </div>
            <div>
              <p className="text-brand-text-muted">Hitos post-adopción</p>
              <p className="font-semibold text-brand-dark">{milestones.length}</p>
            </div>
            <div>
              <p className="text-brand-text-muted">Días desde adopción</p>
              <p className="font-semibold text-brand-dark">
                {pig.birthDate ? 
                  Math.floor((Date.now() - new Date(pig.birthDate as any).getTime()) / (1000 * 60 * 60 * 24)) : 
                  'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-brand-text-muted">Último hito</p>
              <p className="font-semibold text-brand-dark">
                {allMilestones.length > 0 ? 
                  format(parseDate(allMilestones[0].date), "dd/MM", { locale: es }) : 
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
