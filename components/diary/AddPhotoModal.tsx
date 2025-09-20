// components/diary/AddPhotoModal.tsx
import { useState } from 'react';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (photo: Omit<any, 'id' | 'uploadedAt' | 'addedBy'>) => Promise<void>;
  pigName: string;
}

export default function AddPhotoModal({ isOpen, onClose, onAdd, pigName }: AddPhotoModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles].slice(0, 10)); // Máximo 10 fotos
    setCaptions(prev => [...prev, ...new Array(selectedFiles.length).fill('')]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setCaptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    setCaptions(prev => {
      const newCaptions = [...prev];
      newCaptions[index] = caption;
      return newCaptions;
    });
  };

  const addTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags(prev => [...prev, cleanTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      alert('Por favor selecciona al menos una foto');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implementar subida de imágenes a Firebase Storage
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const caption = captions[i] || '';
        
        // Simular URL de imagen subida
        const imageUrl = URL.createObjectURL(file);
        
        await onAdd({
          url: imageUrl,
          caption: caption.trim() || undefined,
          date: new Date(date),
          tags: tags.length > 0 ? tags : undefined,
        });
      }
      
      // Reset form
      setFiles([]);
      setCaptions([]);
      setTags([]);
      setDate(new Date().toISOString().split('T')[0]);
      
      onClose();
    } catch (error) {
      console.error('Error adding photos:', error);
      alert('Error al subir las fotos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-dark">
              Añadir Fotos de {pigName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de archivos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Fotos (máximo 10)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formatos soportados: JPG, PNG, WebP. Tamaño máximo: 10MB por foto.
              </p>
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de las fotos
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            {/* Etiquetas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas (opcional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-pink text-white"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-pink-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Añadir etiqueta (presiona Enter)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ejemplos: #playa, #cumpleaños, #jugando, #durmiendo
              </p>
            </div>

            {/* Vista previa de fotos */}
            {files.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Vista Previa ({files.length} {files.length === 1 ? 'foto' : 'fotos'})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="space-y-2">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                      <textarea
                        placeholder="Descripción de la foto..."
                        value={captions[index] || ''}
                        onChange={(e) => updateCaption(index, e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-brand-pink focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consejos */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Consejos</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Las fotos son completamente privadas, solo tú puedes verlas</li>
                <li>• Añade descripciones para recordar el contexto</li>
                <li>• Usa etiquetas para organizar y encontrar fotos fácilmente</li>
                <li>• Puedes subir hasta 10 fotos a la vez</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className="flex-1 btn-pig disabled:opacity-50"
              >
                {loading ? 'Subiendo...' : `Subir ${files.length} ${files.length === 1 ? 'Foto' : 'Fotos'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
