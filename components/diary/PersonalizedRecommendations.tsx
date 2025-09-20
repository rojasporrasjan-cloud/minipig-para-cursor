// components/diary/PersonalizedRecommendations.tsx
import { PersonalizedRecommendation } from '@/lib/types/diary';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PersonalizedRecommendationsProps {
  recommendations: PersonalizedRecommendation[];
  onMarkRead: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

const typeIcons = {
  product: '🛍️',
  article: '📖',
  reminder: '⏰',
  tip: '💡',
};

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

export default function PersonalizedRecommendations({ 
  recommendations, 
  onMarkRead, 
  onRemove 
}: PersonalizedRecommendationsProps) {
  const unreadRecommendations = recommendations.filter(rec => !rec.isRead);
  const readRecommendations = recommendations.filter(rec => rec.isRead);

  const handleMarkAsRead = async (recommendation: PersonalizedRecommendation) => {
    if (!recommendation.isRead) {
      await onMarkRead(recommendation.id);
    }
  };

  const handleRemove = async (recommendationId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta recomendación?')) {
      await onRemove(recommendationId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-brand-dark">Recomendaciones Personalizadas</h2>
        <p className="text-sm text-brand-text-muted">
          Sugerencias basadas en la edad y situación de tu cerdito
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-brand-pink">{unreadRecommendations.length}</div>
          <div className="text-sm text-gray-600">Sin leer</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{readRecommendations.length}</div>
          <div className="text-sm text-gray-600">Leídas</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{recommendations.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Recomendaciones sin leer */}
      {unreadRecommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-brand-dark mb-4">
            Nuevas Recomendaciones ({unreadRecommendations.length})
          </h3>
          <div className="space-y-4">
            {unreadRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="bg-white border-l-4 border-brand-pink rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">{typeIcons[recommendation.type]}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-brand-dark">{recommendation.title}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[recommendation.priority]}`}>
                          {recommendation.priority === 'high' ? 'Alta' : 
                           recommendation.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{recommendation.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          {format(new Date(recommendation.createdAt as any), "dd/MM/yyyy", { locale: es })}
                        </span>
                        {recommendation.expiresAt && (
                          <span>
                            Expira: {format(new Date(recommendation.expiresAt as any), "dd/MM/yyyy", { locale: es })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {recommendation.actionUrl && (
                      <a
                        href={recommendation.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pig text-sm px-3 py-1"
                        onClick={() => handleMarkAsRead(recommendation)}
                      >
                        Ver
                      </a>
                    )}
                    <button
                      onClick={() => handleMarkAsRead(recommendation)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Marcar como leída
                    </button>
                    <button
                      onClick={() => handleRemove(recommendation.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones leídas */}
      {readRecommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-brand-dark mb-4">
            Recomendaciones Leídas ({readRecommendations.length})
          </h3>
          <div className="space-y-3">
            {readRecommendations.slice(0, 5).map((recommendation) => (
              <div
                key={recommendation.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-xl">{typeIcons[recommendation.type]}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-700">{recommendation.title}</h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                          Leída
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{recommendation.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          Leída: {recommendation.readAt ? 
                            format(new Date(recommendation.readAt as any), "dd/MM/yyyy", { locale: es }) : 
                            'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(recommendation.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {readRecommendations.length > 5 && (
            <p className="text-sm text-gray-500 text-center mt-4">
              Y {readRecommendations.length - 5} recomendaciones más...
            </p>
          )}
        </div>
      )}

      {/* Estado vacío */}
      {recommendations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-4xl mb-4">💡</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay recomendaciones aún
          </h3>
          <p className="text-gray-500">
            Las recomendaciones personalizadas aparecerán aquí basadas en la edad y situación de tu cerdito.
          </p>
        </div>
      )}

      {/* Información sobre recomendaciones */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Sobre las Recomendaciones</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Las recomendaciones se generan automáticamente según la edad de tu cerdito</li>
          <li>• Incluyen productos, artículos, recordatorios y tips personalizados</li>
          <li>• Puedes marcar como leídas o eliminar las que no te interesen</li>
          <li>• Las recomendaciones de alta prioridad son especialmente importantes</li>
        </ul>
      </div>
    </div>
  );
}
