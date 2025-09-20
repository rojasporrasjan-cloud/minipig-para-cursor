// components/diary/DiarySettings.tsx
import { useState } from 'react';
import { PigDiary } from '@/lib/types/diary';

interface DiarySettingsProps {
  diary: PigDiary;
  onUpdateSettings: (settings: Partial<PigDiary['settings']>) => Promise<void>;
}

export default function DiarySettings({ diary, onUpdateSettings }: DiarySettingsProps) {
  const [settings, setSettings] = useState(diary.settings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSettingChange = (key: keyof PigDiary['settings'], value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await onUpdateSettings(settings);
      setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
    } finally {
      setLoading(false);
    }
  };

  const settingOptions = [
    {
      key: 'isPublic' as const,
      title: 'Hacer público el diario',
      description: 'Permite que otros usuarios vean el diario de tu cerdito (sin información privada)',
      icon: '🌐',
      warning: 'Esta opción hace visible tu diario a otros usuarios de la plataforma.'
    },
    {
      key: 'allowRecommendations' as const,
      title: 'Recibir recomendaciones automáticas',
      description: 'Permite que el sistema genere recomendaciones personalizadas basadas en la edad de tu cerdito',
      icon: '💡',
      warning: null
    },
    {
      key: 'birthdayReminders' as const,
      title: 'Recordatorios de cumpleaños',
      description: 'Recibe notificaciones sobre el cumpleaños de tu cerdito',
      icon: '🎂',
      warning: null
    },
    {
      key: 'healthReminders' as const,
      title: 'Recordatorios de salud',
      description: 'Recibe notificaciones sobre vacunas y desparasitaciones pendientes',
      icon: '🩺',
      warning: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-brand-dark">Configuración del Diario</h2>
        <p className="text-sm text-brand-text-muted">
          Personaliza cómo funciona tu diario de vida digital
        </p>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Configuraciones */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-brand-dark">Preferencias</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {settingOptions.map((option) => (
            <div key={option.key} className="px-6 py-4">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-brand-dark">{option.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      {option.warning && (
                        <p className="text-sm text-orange-600 mt-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {option.warning}
                        </p>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[option.key]}
                        onChange={(e) => handleSettingChange(option.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-pink peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información del diario */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-brand-dark mb-3">Información del Diario</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Creado:</span>
            <span className="ml-2 font-medium">
              {diary.createdAt ? 
                new Date(diary.createdAt as any).toLocaleDateString('es-CR') : 
                'N/A'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-600">Última actualización:</span>
            <span className="ml-2 font-medium">
              {diary.updatedAt ? 
                new Date(diary.updatedAt as any).toLocaleDateString('es-CR') : 
                'N/A'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-600">Última actividad:</span>
            <span className="ml-2 font-medium">
              {diary.lastActivityAt ? 
                new Date(diary.lastActivityAt as any).toLocaleDateString('es-CR') : 
                'Nunca'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-600">ID del diario:</span>
            <span className="ml-2 font-mono text-xs bg-gray-200 px-2 py-1 rounded">
              {diary.id}
            </span>
          </div>
        </div>
      </div>

      {/* Privacidad */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">🔒 Privacidad y Seguridad</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Todas tus fotos privadas son completamente seguras y solo tú puedes verlas</li>
          <li>• Los registros de salud y crecimiento son privados por defecto</li>
          <li>• Si haces público el diario, solo se mostrarán los hitos generales</li>
          <li>• Puedes cambiar la configuración de privacidad en cualquier momento</li>
        </ul>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-pig disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}
