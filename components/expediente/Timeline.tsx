// components/expediente/Timeline.tsx
import { Milestone, Pig } from '@/lib/types/pig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const IconMap = {
  birth: '🎉',
  health: '🩺',
  home: '🏡',
};

export default function Timeline({ pig }: { pig: Pig }) {
  // --- RE-HIDRATACIÓN ---
  // Nos aseguramos de que las fechas sean objetos Date antes de ordenarlas.
  const sortedMilestones = (pig.milestones || []).sort((a, b) => 
    new Date(a.date as any).getTime() - new Date(b.date as any).getTime()
  );

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-brand-dark mb-4">Línea de Tiempo de {pig.name}</h3>
      <div className="space-y-6 border-l-2 border-pink-200 ml-3">
        {sortedMilestones.map((milestone) => (
          <div key={milestone.id} className="relative pl-8">
            <div className="absolute -left-[1.3rem] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 ring-4 ring-white">
              <span className="text-xl">{IconMap[milestone.icon]}</span>
            </div>
            <p className="text-xs text-brand-text-muted">
              {format(new Date(milestone.date as any), "d 'de' MMMM, yyyy", { locale: es })}
            </p>
            <h4 className="font-semibold text-brand-dark">{milestone.title}</h4>
            <p className="text-sm text-brand-text-muted">{milestone.description}</p>
          </div>
        ))}
        {sortedMilestones.length === 0 && (
          <p className="pl-8 text-sm text-gray-400">Aún no hay hitos registrados en la historia de {pig.name}.</p>
        )}
      </div>
    </div>
  );
}