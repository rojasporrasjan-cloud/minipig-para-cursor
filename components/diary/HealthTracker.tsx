// components/diary/HealthTracker.tsx
import { HealthRecord } from '@/lib/types/diary';
import { Pig } from '@/lib/types/pig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HealthTrackerProps {
  pig: Pig;
  healthRecords: HealthRecord[];
  onAddRecord: () => void;
}

const healthTypeLabels = {
  vaccination: 'Vacunación',
  deworming: 'Desparasitación',
  checkup: 'Revisión General',
  treatment: 'Tratamiento',
  other: 'Otro',
};

const healthTypeIcons = {
  vaccination: '💉',
  deworming: '🩹',
  checkup: '🩺',
  treatment: '💊',
  other: '📋',
};

export default function HealthTracker({ pig, healthRecords, onAddRecord }: HealthTrackerProps) {
  // Ordenar registros por fecha (más reciente primero)
  const sortedRecords = [...healthRecords].sort(
    (a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime()
  );

  // Agrupar por tipo
  const recordsByType = healthRecords.reduce((acc, record) => {
    if (!acc[record.type]) acc[record.type] = [];
    acc[record.type].push(record);
    return acc;
  }, {} as Record<string, HealthRecord[]>);

  // Encontrar próximas fechas importantes
  const upcomingVaccinations = healthRecords
    .filter(record => record.type === 'vaccination' && record.nextDue)
    .filter(record => new Date(record.nextDue as any) > new Date())
    .sort((a, b) => new Date(a.nextDue as any).getTime() - new Date(b.nextDue as any).getTime());

  const upcomingDeworming = healthRecords
    .filter(record => record.type === 'deworming' && record.nextDue)
    .filter(record => new Date(record.nextDue as any) > new Date())
    .sort((a, b) => new Date(a.nextDue as any).getTime() - new Date(b.nextDue as any).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">Registro de Salud</h2>
          <p className="text-sm text-brand-text-muted">
            Mantén el historial médico de {pig.name}
          </p>
        </div>
        <button
          onClick={onAddRecord}
          className="btn-pig flex items-center gap-2"
        >
          <span>🩺</span>
          Registrar Visita
        </button>
      </div>

      {/* Recordatorios importantes */}
      {(upcomingVaccinations.length > 0 || upcomingDeworming.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Recordatorios Importantes</h3>
          
          {upcomingVaccinations.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">💉 Próximas Vacunas</h4>
              <div className="space-y-2">
                {upcomingVaccinations.slice(0, 2).map((record) => (
                  <div key={record.id} className="flex items-center justify-between text-sm">
                    <span className="text-yellow-700">{record.title}</span>
                    <span className="font-medium text-yellow-800">
                      {format(new Date(record.nextDue as any), "dd/MM/yyyy", { locale: es })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcomingDeworming.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-2">🩹 Próximas Desparasitaciones</h4>
              <div className="space-y-2">
                {upcomingDeworming.slice(0, 2).map((record) => (
                  <div key={record.id} className="flex items-center justify-between text-sm">
                    <span className="text-yellow-700">{record.title}</span>
                    <span className="font-medium text-yellow-800">
                      {format(new Date(record.nextDue as any), "dd/MM/yyyy", { locale: es })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estadísticas por tipo */}
      {Object.keys(recordsByType).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(recordsByType).map(([type, records]) => (
            <div key={type} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl mb-2">{healthTypeIcons[type as keyof typeof healthTypeIcons]}</div>
              <div className="text-lg font-bold text-brand-dark">{records.length}</div>
              <div className="text-xs text-gray-600">{healthTypeLabels[type as keyof typeof healthTypeLabels]}</div>
            </div>
          ))}
        </div>
      )}

      {/* Historial de registros */}
      {sortedRecords.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-brand-dark">Historial Médico</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {sortedRecords.map((record, index) => {
              const date = new Date(record.date as any);
              const isRecent = index < 3; // Destacar los 3 más recientes
              
              return (
                <div key={record.id} className={`px-6 py-4 ${isRecent ? 'bg-pink-50' : ''}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isRecent ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {healthTypeIcons[record.type]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-brand-dark">{record.title}</h4>
                        {isRecent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-pink text-white">
                            Reciente
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {format(date, "d 'de' MMMM, yyyy", { locale: es })}
                      </div>
                      
                      {record.description && (
                        <p className="text-sm text-gray-700 mb-2">{record.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {record.veterinarian && (
                          <span>👨‍⚕️ {record.veterinarian}</span>
                        )}
                        {record.location && (
                          <span>📍 {record.location}</span>
                        )}
                        {record.cost && (
                          <span>💰 {record.cost.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}</span>
                        )}
                      </div>
                      
                      {record.nextDue && (
                        <div className="mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          ⏰ Próximo: {format(new Date(record.nextDue as any), "dd/MM/yyyy", { locale: es })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-4xl mb-4">🩺</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Comienza el registro médico de {pig.name}!
          </h3>
          <p className="text-gray-500 mb-6">
            Registra vacunas, visitas al veterinario y tratamientos para mantener un historial completo.
          </p>
          <button
            onClick={onAddRecord}
            className="btn-pig"
          >
            Registrar Primera Visita
          </button>
        </div>
      )}

      {/* Consejos de salud */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h4 className="font-semibold text-green-900 mb-2">💚 Consejos de Salud</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Programa revisiones regulares con el veterinario</li>
          <li>• Mantén las vacunas al día según el calendario</li>
          <li>• La desparasitación debe ser regular (cada 3-6 meses)</li>
          <li>• Observa cambios en comportamiento o apetito</li>
          <li>• Guarda los comprobantes de todas las visitas</li>
        </ul>
      </div>
    </div>
  );
}
