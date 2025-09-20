// components/diary/AddMilestoneModal.tsx
import { useState } from 'react';
import { PostAdoptionMilestoneType } from '@/lib/types/diary';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (milestone: Omit<any, 'id' | 'createdAt' | 'addedBy'>) => Promise<void>;
  pigName: string;
}

const milestoneTypes: { value: PostAdoptionMilestoneType; label: string; icon: string; description: string }[] = [
  {
    value: 'health',
    label: 'Salud',
    icon: '🩺',
    description: 'Vacunas, visitas al veterinario, tratamientos'
  },
  {
    value: 'growth',
    label: 'Crecimiento',
    icon: '📏',
    description: 'Cambios de peso, tamaño, hitos físicos'
  },
  {
    value: 'training',
    label: 'Entrenamiento',
    icon: '🎓',
    description: 'Trucos aprendidos, mejoras de comportamiento'
  },
  {
    value: 'adventure',
    label: 'Aventura',
    icon: '🗺️',
    description: 'Viajes, paseos, nuevas experiencias'
  },
  {
    value: 'birthday',
    label: 'Cumpleaños',
    icon: '🎂',
    description: 'Celebraciones y fechas especiales'
  },
  {
    value: 'milestone',
    label: 'Hito General',
    icon: '⭐',
    description: 'Momentos importantes y logros'
  },
  {
    value: 'memory',
    label: 'Recuerdo',
    icon: '💝',
    description: 'Momentos especiales y memorias'
  },
];

export default function AddMilestoneModal({ isOpen, onClose, onAdd, pigName }: AddMilestoneModalProps) {
  const [type, setType] = useState<PostAdoptionMilestoneType>('milestone');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implementar subida de imágenes a Firebase Storage
      const imageUrls: string[] = [];
      
      await onAdd({
        type,
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        images: imageUrls,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setImages([]);
      setType('milestone');
      
      onClose();
    } catch (error) {
      console.error('Error adding milestone:', error);
      alert('Error al añadir el hito. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Máximo 5 fotos
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-dark">
              Añadir Hito para {pigName}
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
            {/* Tipo de hito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de hito
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {milestoneTypes.map((milestoneType) => (
                  <button
                    key={milestoneType.value}
                    type="button"
                    onClick={() => setType(milestoneType.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      type === milestoneType.value
                        ? 'border-brand-pink bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{milestoneType.icon}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {milestoneType.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {milestoneType.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título del hito *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Ej: Primera visita al veterinario"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Cuéntanos más detalles sobre este momento especial..."
                required
              />
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del hito
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            {/* Fotos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                disabled={loading}
                className="flex-1 btn-pig disabled:opacity-50"
              >
                {loading ? 'Añadiendo...' : 'Añadir Hito'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
