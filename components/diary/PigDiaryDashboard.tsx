// components/diary/PigDiaryDashboard.tsx
import { useState, useEffect } from 'react';
import { Pig } from '@/lib/types/pig';
import { usePigDiary } from '@/hooks/usePigDiary';
import DiaryTimeline from './DiaryTimeline';
import GrowthTracker from './GrowthTracker';
import HealthTracker from './HealthTracker';
import PrivateGallery from './PrivateGallery';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import DiarySettings from './DiarySettings';
import AddMilestoneModal from './AddMilestoneModal';
import AddGrowthModal from './AddGrowthModal';
import AddHealthModal from './AddHealthModal';
import AddPhotoModal from './AddPhotoModal';

type TabType = 'timeline' | 'growth' | 'health' | 'photos' | 'recommendations' | 'settings';

interface PigDiaryDashboardProps {
  pig: Pig;
}

export default function PigDiaryDashboard({ pig }: PigDiaryDashboardProps) {
  const {
    diary,
    milestones,
    growthRecords,
    healthRecords,
    privatePhotos,
    recommendations,
    loading,
    error,
    addMilestone,
    addGrowth,
    addHealth,
    addPhoto,
    updateSettings,
    markRecommendationRead,
    removeRecommendation,
    generateRecommendations,
  } = usePigDiary(pig.id);

  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddGrowth, setShowAddGrowth] = useState(false);
  const [showAddHealth, setShowAddHealth] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  // Generar recomendaciones cuando se carga el diario
  // TODO: Habilitar cuando se configuren los permisos de Firebase correctamente
  // useEffect(() => {
  //   if (diary && recommendations.length === 0) {
  //     generateRecommendations(pig);
  //   }
  // }, [diary, recommendations.length, generateRecommendations, pig]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-pig"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se pudo crear el diario para {pig.name}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'timeline' as TabType, label: 'Línea de Tiempo', icon: '📅' },
    { id: 'growth' as TabType, label: 'Crecimiento', icon: '📏' },
    { id: 'health' as TabType, label: 'Salud', icon: '🩺' },
    { id: 'photos' as TabType, label: 'Fotos', icon: '📸' },
    { id: 'recommendations' as TabType, label: 'Recomendaciones', icon: '💡' },
    { id: 'settings' as TabType, label: 'Configuración', icon: '⚙️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timeline':
        return (
          <DiaryTimeline
            pig={pig}
            milestones={milestones}
            onAddMilestone={() => setShowAddMilestone(true)}
          />
        );
      case 'growth':
        return (
          <GrowthTracker
            pig={pig}
            growthRecords={growthRecords}
            onAddRecord={() => setShowAddGrowth(true)}
          />
        );
      case 'health':
        return (
          <HealthTracker
            pig={pig}
            healthRecords={healthRecords}
            onAddRecord={() => setShowAddHealth(true)}
          />
        );
      case 'photos':
        return (
          <PrivateGallery
            pig={pig}
            photos={privatePhotos}
            onAddPhoto={() => setShowAddPhoto(true)}
          />
        );
      case 'recommendations':
        return (
          <PersonalizedRecommendations
            recommendations={recommendations}
            onMarkRead={markRecommendationRead}
            onRemove={removeRecommendation}
          />
        );
      case 'settings':
        return (
          <DiarySettings
            diary={diary}
            onUpdateSettings={updateSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del Diario */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              Diario de Vida de {pig.name}
            </h1>
            <p className="text-brand-text-muted mt-1">
              Registra y celebra cada momento especial de tu mini pig
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-brand-text-muted">
              Última actividad
            </p>
            <p className="text-sm font-medium text-brand-dark">
              {diary.lastActivityAt ? 
                new Date(diary.lastActivityAt as any).toLocaleDateString('es-CR') : 
                'Nunca'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-brand-pink text-brand-pink'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.id === 'recommendations' && recommendations.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {recommendations.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Modales */}
      <AddMilestoneModal
        isOpen={showAddMilestone}
        onClose={() => setShowAddMilestone(false)}
        onAdd={addMilestone}
        pigName={pig.name}
      />

      <AddGrowthModal
        isOpen={showAddGrowth}
        onClose={() => setShowAddGrowth(false)}
        onAdd={addGrowth}
        pigName={pig.name}
      />

      <AddHealthModal
        isOpen={showAddHealth}
        onClose={() => setShowAddHealth(false)}
        onAdd={addHealth}
        pigName={pig.name}
      />

      <AddPhotoModal
        isOpen={showAddPhoto}
        onClose={() => setShowAddPhoto(false)}
        onAdd={addPhoto}
        pigName={pig.name}
      />
    </div>
  );
}
