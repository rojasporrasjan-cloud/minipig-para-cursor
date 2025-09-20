// hooks/usePigDiary.ts
import { useState, useEffect } from 'react';
import { useUserProfile } from './useUserProfile';
import {
  PigDiary,
  PostAdoptionMilestone,
  GrowthRecord,
  HealthRecord,
  PrivatePhoto,
  PersonalizedRecommendation,
} from '@/lib/types/diary';
import {
  getPigDiary,
  getDiariesByOwner,
  createPigDiary,
  addPostAdoptionMilestone,
  getPostAdoptionMilestones,
  deletePostAdoptionMilestone,
  addGrowthRecord,
  getGrowthRecords,
  addHealthRecord,
  getHealthRecords,
  addPrivatePhoto,
  getPrivatePhotos,
  deletePrivatePhoto,
  updateDiarySettings,
  getUnreadRecommendations,
  markRecommendationAsRead,
  deleteRecommendation,
} from '@/lib/firebase/diary';
import { generatePersonalizedRecommendations } from '@/lib/recommendationTemplates';
import { RecommendationService } from '@/lib/recommendationService';

export function usePigDiary(pigId?: string) {
  const { user } = useUserProfile();
  const [diary, setDiary] = useState<PigDiary | null>(null);
  const [milestones, setMilestones] = useState<PostAdoptionMilestone[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [privatePhotos, setPrivatePhotos] = useState<PrivatePhoto[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar diario principal
  useEffect(() => {
    const loadDiary = async () => {
      if (!pigId || !user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let diaryData = await getPigDiary(pigId);
        
        // Si no existe el diario, crearlo
        if (!diaryData) {
          const diaryId = await createPigDiary(pigId, user.uid);
          diaryData = await getPigDiary(pigId);
        }
        
        setDiary(diaryData);
      } catch (err) {
        console.error('Error loading diary:', err);
        setError('No se pudo cargar el diario');
      } finally {
        setLoading(false);
      }
    };

    loadDiary();
  }, [pigId, user]);

  // Cargar datos del diario cuando existe
  useEffect(() => {
    const loadDiaryData = async () => {
      if (!diary) return;
      
      try {
        // Por ahora, inicializar con datos vacíos para evitar errores de permisos
        // TODO: Habilitar cuando se configuren las reglas de Firebase
        setMilestones([]);
        setGrowthRecords([]);
        setHealthRecords([]);
        setPrivatePhotos([]);
        setRecommendations([]);
        
        console.log('Diary loaded successfully (demo mode - no Firebase permissions configured)');
      } catch (err) {
        console.warn('Error loading diary data (expected without Firebase permissions):', err);
        // Inicializar con datos vacíos en caso de error
        setMilestones([]);
        setGrowthRecords([]);
        setHealthRecords([]);
        setPrivatePhotos([]);
        setRecommendations([]);
      }
    };

    loadDiaryData();
  }, [diary]);

  // Funciones para manejar hitos
  const addMilestone = async (milestone: Omit<PostAdoptionMilestone, "id" | "createdAt" | "addedBy">) => {
    if (!diary || !user) {
      console.warn('No diary or user found - operating in demo mode');
      // Crear un milestone temporal para demo
      const tempMilestone = {
        ...milestone,
        id: `temp-${Date.now()}`,
        addedBy: 'demo-user',
        createdAt: new Date() as any,
      };
      setMilestones(prev => [...prev, tempMilestone as PostAdoptionMilestone]);
      return tempMilestone.id;
    }
    
    try {
      const newMilestone = {
        ...milestone,
        addedBy: user.uid,
      };
      
      const milestoneId = await addPostAdoptionMilestone(diary.id, newMilestone);
      
      // Recargar hitos
      const updatedMilestones = await getPostAdoptionMilestones(diary.id);
      setMilestones(updatedMilestones);
      
      return milestoneId;
    } catch (error) {
      console.warn('Error adding milestone (demo mode):', error);
      // Crear un milestone temporal para demo
      const tempMilestone = {
        ...milestone,
        id: `temp-${Date.now()}`,
        addedBy: user.uid,
        createdAt: new Date() as any,
      };
      setMilestones(prev => [...prev, tempMilestone as PostAdoptionMilestone]);
      return tempMilestone.id;
    }
  };

  const removeMilestone = async (milestoneId: string) => {
    if (!diary) {
      console.warn('No diary found - operating in demo mode');
      // Remover del estado local en modo demo
      setMilestones(prev => prev.filter(m => m.id !== milestoneId));
      return;
    }
    
    try {
      await deletePostAdoptionMilestone(diary.id, milestoneId);
      
      // Recargar hitos
      const updatedMilestones = await getPostAdoptionMilestones(diary.id);
      setMilestones(updatedMilestones);
    } catch (error) {
      console.warn('Error removing milestone (demo mode):', error);
      // Remover del estado local en caso de error
      setMilestones(prev => prev.filter(m => m.id !== milestoneId));
    }
  };

  // Funciones para manejar registros de crecimiento
  const addGrowth = async (record: Omit<GrowthRecord, "id" | "createdAt" | "addedBy">) => {
    if (!diary || !user) {
      console.warn('No diary or user found - operating in demo mode');
      const tempRecord = {
        ...record,
        id: `temp-growth-${Date.now()}`,
        addedBy: 'demo-user',
        createdAt: new Date() as any,
      };
      setGrowthRecords(prev => [...prev, tempRecord as GrowthRecord]);
      return tempRecord.id;
    }
    
    try {
      const newRecord = {
        ...record,
        addedBy: user.uid,
      };
      
      const recordId = await addGrowthRecord(diary.id, newRecord);
      
      // Recargar registros
      const updatedRecords = await getGrowthRecords(diary.id);
      setGrowthRecords(updatedRecords);
      
      return recordId;
    } catch (error) {
      console.warn('Error adding growth record (demo mode):', error);
      const tempRecord = {
        ...record,
        id: `temp-growth-${Date.now()}`,
        addedBy: user.uid,
        createdAt: new Date() as any,
      };
      setGrowthRecords(prev => [...prev, tempRecord as GrowthRecord]);
      return tempRecord.id;
    }
  };

  // Funciones para manejar registros de salud
  const addHealth = async (record: Omit<HealthRecord, "id" | "createdAt" | "addedBy">) => {
    if (!diary || !user) {
      console.warn('No diary or user found - operating in demo mode');
      const tempRecord = {
        ...record,
        id: `temp-health-${Date.now()}`,
        addedBy: 'demo-user',
        createdAt: new Date() as any,
      };
      setHealthRecords(prev => [...prev, tempRecord as HealthRecord]);
      return tempRecord.id;
    }
    
    try {
      const newRecord = {
        ...record,
        addedBy: user.uid,
      };
      
      const recordId = await addHealthRecord(diary.id, newRecord);
      
      // Recargar registros
      const updatedRecords = await getHealthRecords(diary.id);
      setHealthRecords(updatedRecords);
      
      return recordId;
    } catch (error) {
      console.warn('Error adding health record (demo mode):', error);
      const tempRecord = {
        ...record,
        id: `temp-health-${Date.now()}`,
        addedBy: user.uid,
        createdAt: new Date() as any,
      };
      setHealthRecords(prev => [...prev, tempRecord as HealthRecord]);
      return tempRecord.id;
    }
  };

  // Funciones para manejar fotos privadas
  const addPhoto = async (photo: Omit<PrivatePhoto, "id" | "uploadedAt" | "addedBy">) => {
    if (!diary || !user) {
      console.warn('No diary or user found - operating in demo mode');
      const tempPhoto = {
        ...photo,
        id: `temp-photo-${Date.now()}`,
        addedBy: 'demo-user',
        uploadedAt: new Date() as any,
      };
      setPrivatePhotos(prev => [...prev, tempPhoto as PrivatePhoto]);
      return tempPhoto.id;
    }
    
    try {
      const newPhoto = {
        ...photo,
        addedBy: user.uid,
      };
      
      const photoId = await addPrivatePhoto(diary.id, newPhoto);
      
      // Recargar fotos
      const updatedPhotos = await getPrivatePhotos(diary.id);
      setPrivatePhotos(updatedPhotos);
      
      return photoId;
    } catch (error) {
      console.warn('Error adding photo (demo mode):', error);
      const tempPhoto = {
        ...photo,
        id: `temp-photo-${Date.now()}`,
        addedBy: user.uid,
        uploadedAt: new Date() as any,
      };
      setPrivatePhotos(prev => [...prev, tempPhoto as PrivatePhoto]);
      return tempPhoto.id;
    }
  };

  const removePhoto = async (photoId: string) => {
    if (!diary) {
      console.warn('No diary found - operating in demo mode');
      setPrivatePhotos(prev => prev.filter(p => p.id !== photoId));
      return;
    }
    
    try {
      await deletePrivatePhoto(diary.id, photoId);
      
      // Recargar fotos
      const updatedPhotos = await getPrivatePhotos(diary.id);
      setPrivatePhotos(updatedPhotos);
    } catch (error) {
      console.warn('Error removing photo (demo mode):', error);
      setPrivatePhotos(prev => prev.filter(p => p.id !== photoId));
    }
  };

  // Funciones para configuraciones
  const updateSettings = async (settings: Partial<PigDiary["settings"]>) => {
    if (!diary) throw new Error('No diary found');
    
    await updateDiarySettings(diary.id, settings);
    
    // Actualizar estado local
    setDiary(prev => prev ? { ...prev, settings: { ...prev.settings, ...settings } } : null);
  };

  // Funciones para recomendaciones
  const markRecommendationRead = async (recommendationId: string) => {
    await markRecommendationAsRead(recommendationId);
    
    // Actualizar estado local
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, isRead: true, readAt: new Date() as any }
          : rec
      )
    );
  };

  const removeRecommendation = async (recommendationId: string) => {
    await deleteRecommendation(recommendationId);
    
    // Actualizar estado local
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  };

  // Generar recomendaciones basadas en edad
  const generateRecommendations = async (pig: any) => {
    if (!diary || !user) return;
    
    try {
      // Usar el servicio de recomendaciones
      await RecommendationService.generateAllRecommendations(pig, user.uid);
      
      // Recargar recomendaciones
      const updatedRecommendations = await getUnreadRecommendations(user.uid);
      setRecommendations(updatedRecommendations);
    } catch (error) {
      console.warn('Error generating recommendations:', error);
      // Continuar sin recomendaciones si hay error
    }
  };

  return {
    diary,
    milestones,
    growthRecords,
    healthRecords,
    privatePhotos,
    recommendations,
    loading,
    error,
    addMilestone,
    removeMilestone,
    addGrowth,
    addHealth,
    addPhoto,
    removePhoto,
    updateSettings,
    markRecommendationRead,
    removeRecommendation,
    generateRecommendations,
  };
}

export function useUserDiaries() {
  const { user } = useUserProfile();
  const [diaries, setDiaries] = useState<PigDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiaries = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const diariesData = await getDiariesByOwner(user.uid);
        setDiaries(diariesData);
      } catch (err) {
        console.error('Error loading user diaries:', err);
        setError('No se pudieron cargar los diarios');
      } finally {
        setLoading(false);
      }
    };

    loadDiaries();
  }, [user]);

  return {
    diaries,
    loading,
    error,
  };
}
