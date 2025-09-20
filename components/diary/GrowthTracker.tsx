// components/diary/GrowthTracker.tsx
import { GrowthRecord } from '@/lib/types/diary';
import { Pig } from '@/lib/types/pig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface GrowthTrackerProps {
  pig: Pig;
  growthRecords: GrowthRecord[];
  onAddRecord: () => void;
}

export default function GrowthTracker({ pig, growthRecords, onAddRecord }: GrowthTrackerProps) {
  // Ordenar registros por fecha (más reciente primero)
  const sortedRecords = [...growthRecords].sort(
    (a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime()
  );

  // Calcular estadísticas básicas
  const totalRecords = growthRecords.length;
  const latestWeight = growthRecords.length > 0 ? growthRecords[0].weight : null;
  const firstWeight = growthRecords.length > 0 ? growthRecords[growthRecords.length - 1].weight : null;
  const weightGain = latestWeight && firstWeight ? latestWeight - firstWeight : null;

  // Generar datos para gráfica simple (últimos 10 registros)
  const chartData = sortedRecords.slice(0, 10).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">Seguimiento de Crecimiento</h2>
          <p className="text-sm text-brand-text-muted">
            Registra el peso y crecimiento de {pig.name}
          </p>
        </div>
        <button
          onClick={onAddRecord}
          className="btn-pig flex items-center gap-2"
        >
          <span>📏</span>
          Registrar Peso
        </button>
      </div>

      {/* Estadísticas */}
      {totalRecords > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-brand-pink">{latestWeight?.toFixed(1)} kg</div>
            <div className="text-sm text-gray-600">Peso actual</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {weightGain ? (weightGain > 0 ? '+' : '') + weightGain.toFixed(1) : '0'} kg
            </div>
            <div className="text-sm text-gray-600">Ganancia total</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{totalRecords}</div>
            <div className="text-sm text-gray-600">Registros</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {totalRecords > 1 ? 
                ((weightGain || 0) / (totalRecords - 1)).toFixed(2) : 
                '0'
              } kg
            </div>
            <div className="text-sm text-gray-600">Promedio por registro</div>
          </div>
        </div>
      )}

      {/* Gráfica simple */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-brand-dark mb-4">
            Evolución del Peso
          </h3>
          <div className="space-y-3">
            {chartData.map((record, index) => {
              const date = new Date(record.date as any);
              const isLatest = index === chartData.length - 1;
              
              return (
                <div key={record.id} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-gray-600">
                    {format(date, "dd/MM")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-brand-pink h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(100, (record.weight / Math.max(...chartData.map(r => r.weight))) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className={`text-sm font-medium ${isLatest ? 'text-brand-pink' : 'text-gray-900'}`}>
                        {record.weight} kg
                      </div>
                    </div>
                    {record.notes && (
                      <p className="text-xs text-gray-500 mt-1">{record.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de registros */}
      {sortedRecords.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-brand-dark">Historial de Registros</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {sortedRecords.map((record, index) => {
              const date = new Date(record.date as any);
              const isLatest = index === 0;
              
              return (
                <div key={record.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isLatest ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        📏
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-brand-dark">
                            {record.weight} kg
                          </span>
                          {isLatest && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-pink text-white">
                              Actual
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(date, "d 'de' MMMM, yyyy", { locale: es })}
                        </div>
                        {record.notes && (
                          <div className="text-sm text-gray-500 mt-1">
                            {record.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {record.length && (
                        <div className="text-sm text-gray-600">
                          Largo: {record.length} cm
                        </div>
                      )}
                      {record.height && (
                        <div className="text-sm text-gray-600">
                          Alto: {record.height} cm
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
          <div className="text-4xl mb-4">📏</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Comienza a registrar el crecimiento de {pig.name}!
          </h3>
          <p className="text-gray-500 mb-6">
            Mantén un registro del peso y medidas para seguir su desarrollo.
          </p>
          <button
            onClick={onAddRecord}
            className="btn-pig"
          >
            Registrar Primer Peso
          </button>
        </div>
      )}

      {/* Consejos */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para el registro</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Registra el peso siempre a la misma hora del día</li>
          <li>• Usa una báscula digital para mayor precisión</li>
          <li>• Incluye notas sobre cambios en la alimentación o actividad</li>
          <li>• Los mini pigs adultos suelen pesar entre 15-40 kg</li>
        </ul>
      </div>
    </div>
  );
}
