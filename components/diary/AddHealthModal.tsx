// components/diary/AddHealthModal.tsx
import { useState } from 'react';

interface AddHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (record: Omit<any, 'id' | 'createdAt' | 'addedBy'>) => Promise<void>;
  pigName: string;
}

const healthTypes = [
  { value: 'vaccination', label: 'Vacunación', icon: '💉' },
  { value: 'deworming', label: 'Desparasitación', icon: '🩹' },
  { value: 'checkup', label: 'Revisión General', icon: '🩺' },
  { value: 'treatment', label: 'Tratamiento', icon: '💊' },
  { value: 'other', label: 'Otro', icon: '📋' },
];

export default function AddHealthModal({ isOpen, onClose, onAdd, pigName }: AddHealthModalProps) {
  const [type, setType] = useState<'vaccination' | 'deworming' | 'checkup' | 'treatment' | 'other'>('checkup');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [veterinarian, setVeterinarian] = useState('');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('');
  const [nextDue, setNextDue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('El título es requerido');
      return;
    }

    setLoading(true);
    
    try {
      await onAdd({
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        date: new Date(date),
        veterinarian: veterinarian.trim() || undefined,
        location: location.trim() || undefined,
        cost: cost ? parseFloat(cost) : undefined,
        nextDue: nextDue ? new Date(nextDue) : undefined,
      });
      
      // Reset form
      setType('checkup');
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setVeterinarian('');
      setLocation('');
      setCost('');
      setNextDue('');
      
      onClose();
    } catch (error) {
      console.error('Error adding health record:', error);
      alert('Error al registrar la visita. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Generar título automático basado en el tipo
  const generateTitle = (type: string) => {
    switch (type) {
      case 'vaccination':
        return 'Vacuna';
      case 'deworming':
        return 'Desparasitación';
      case 'checkup':
        return 'Revisión General';
      case 'treatment':
        return 'Tratamiento';
      default:
        return '';
    }
  };

  // Actualizar título cuando cambia el tipo
  const handleTypeChange = (newType: typeof type) => {
    setType(newType);
    if (!title || title === generateTitle(type)) {
      setTitle(generateTitle(newType));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-dark">
              Registrar Visita Médica de {pigName}
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
            {/* Tipo de visita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de visita
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {healthTypes.map((healthType) => (
                  <button
                    key={healthType.value}
                    type="button"
                    onClick={() => handleTypeChange(healthType.value as any)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      type === healthType.value
                        ? 'border-brand-pink bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{healthType.icon}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {healthType.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Ej: Vacuna contra parvovirus"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción - Opcional
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Detalles sobre la visita, diagnóstico, recomendaciones..."
              />
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de la visita
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            {/* Veterinario */}
            <div>
              <label htmlFor="veterinarian" className="block text-sm font-medium text-gray-700 mb-2">
                Veterinario - Opcional
              </label>
              <input
                type="text"
                id="veterinarian"
                value={veterinarian}
                onChange={(e) => setVeterinarian(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Nombre del veterinario"
              />
            </div>

            {/* Ubicación */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación/Clínica - Opcional
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="Nombre de la clínica o ubicación"
              />
            </div>

            {/* Costo */}
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                Costo (₡) - Opcional
              </label>
              <input
                type="number"
                id="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Próxima cita (para vacunas y desparasitaciones) */}
            {(type === 'vaccination' || type === 'deworming') && (
              <div>
                <label htmlFor="nextDue" className="block text-sm font-medium text-gray-700 mb-2">
                  Próxima cita - Opcional
                </label>
                <input
                  type="date"
                  id="nextDue"
                  value={nextDue}
                  onChange={(e) => setNextDue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para recordatorios automáticos
                </p>
              </div>
            )}

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
                {loading ? 'Registrando...' : 'Registrar Visita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
