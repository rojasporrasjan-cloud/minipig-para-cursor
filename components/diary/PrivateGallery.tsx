// components/diary/PrivateGallery.tsx
import { PrivatePhoto } from '@/lib/types/diary';
import { Pig } from '@/lib/types/pig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PrivateGalleryProps {
  pig: Pig;
  photos: PrivatePhoto[];
  onAddPhoto: () => void;
}

export default function PrivateGallery({ pig, photos, onAddPhoto }: PrivateGalleryProps) {
  // Ordenar fotos por fecha (más recientes primero)
  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime()
  );

  // Agrupar fotos por mes
  const photosByMonth = sortedPhotos.reduce((acc, photo) => {
    const date = new Date(photo.date as any);
    const monthKey = format(date, 'MMMM yyyy', { locale: es });
    
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(photo);
    return acc;
  }, {} as Record<string, PrivatePhoto[]>);

  const totalPhotos = photos.length;
  const recentPhotos = sortedPhotos.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">Galería Privada</h2>
          <p className="text-sm text-brand-text-muted">
            Tus fotos privadas de {pig.name}
          </p>
        </div>
        <button
          onClick={onAddPhoto}
          className="btn-pig flex items-center gap-2"
        >
          <span>📸</span>
          Añadir Fotos
        </button>
      </div>

      {/* Estadísticas */}
      {totalPhotos > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-brand-pink">{totalPhotos}</div>
            <div className="text-sm text-gray-600">Fotos totales</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(photosByMonth).length}
            </div>
            <div className="text-sm text-gray-600">Meses con fotos</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalPhotos > 0 ? Math.round(totalPhotos / Object.keys(photosByMonth).length) : 0}
            </div>
            <div className="text-sm text-gray-600">Promedio/mes</div>
          </div>
        </div>
      )}

      {/* Fotos recientes */}
      {recentPhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-brand-dark mb-4">Fotos Recientes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentPhotos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Foto de ${pig.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galería completa por meses */}
      {Object.keys(photosByMonth).length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-brand-dark">Galería Completa</h3>
          {Object.entries(photosByMonth)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([month, monthPhotos]) => (
              <div key={month} className="space-y-3">
                <h4 className="text-md font-medium text-brand-dark capitalize">
                  {month} ({monthPhotos.length} {monthPhotos.length === 1 ? 'foto' : 'fotos'})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {monthPhotos.map((photo) => {
                    const photoDate = new Date(photo.date as any);
                    return (
                      <div key={photo.id} className="group relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={photo.url}
                            alt={photo.caption || `Foto de ${pig.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        
                        {/* Overlay con información */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-end">
                          <div className="p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            {photo.caption && (
                              <p className="truncate mb-1">{photo.caption}</p>
                            )}
                            <p>{format(photoDate, "dd/MM/yyyy", { locale: es })}</p>
                            {photo.tags && photo.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {photo.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className="bg-white bg-opacity-20 px-1 py-0.5 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Comienza la galería de {pig.name}!
          </h3>
          <p className="text-gray-500 mb-6">
            Sube fotos privadas para crear un álbum digital de recuerdos especiales.
          </p>
          <button
            onClick={onAddPhoto}
            className="btn-pig"
          >
            Subir Primera Foto
          </button>
        </div>
      )}

      {/* Consejos */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-2">📸 Consejos para la Galería</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Añade etiquetas para organizar tus fotos (#playa, #cumpleaños)</li>
          <li>• Las fotos son privadas, solo tú puedes verlas</li>
          <li>• Incluye descripciones para recordar el contexto</li>
          <li>• Sube fotos de diferentes momentos: jugando, durmiendo, comiendo</li>
        </ul>
      </div>
    </div>
  );
}
