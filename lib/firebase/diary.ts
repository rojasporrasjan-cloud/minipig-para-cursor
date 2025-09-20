// lib/firebase/diary.ts
import { db } from "./client";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  PigDiary,
  PostAdoptionMilestone,
  GrowthRecord,
  HealthRecord,
  PrivatePhoto,
  PersonalizedRecommendation,
} from "@/lib/types/diary";

// db ya está importado desde client.ts

// ===== DIARIO PRINCIPAL =====

/**
 * Crea un nuevo diario para un cerdito adoptado
 */
export async function createPigDiary(pigId: string, ownerId: string): Promise<string> {
  const diaryRef = doc(collection(db, "pigDiaries"));
  const now = serverTimestamp() as Timestamp;
  
  const diary: Omit<PigDiary, "id"> = {
    pigId,
    ownerId,
    postAdoptionMilestones: [],
    growthRecords: [],
    healthRecords: [],
    privatePhotos: [],
    settings: {
      isPublic: false,
      allowRecommendations: true,
      birthdayReminders: true,
      healthReminders: true,
    },
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  };

  await setDoc(diaryRef, diary);
  return diaryRef.id;
}

/**
 * Obtiene el diario de un cerdito por su ID
 */
export async function getPigDiary(pigId: string): Promise<PigDiary | null> {
  try {
    // Intentar obtener directamente por ID primero
    const diaryRef = doc(db, "pigDiaries", pigId);
    const diaryDoc = await getDoc(diaryRef);
    
    if (diaryDoc.exists()) {
      return { id: diaryDoc.id, ...diaryDoc.data() } as PigDiary;
    }
    
    // Si no existe, buscar por query (puede fallar por permisos)
    const q = query(
      collection(db, "pigDiaries"),
      where("pigId", "==", pigId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const docData = snapshot.docs[0];
    return { id: docData.id, ...docData.data() } as PigDiary;
  } catch (error) {
    console.warn('Error getting pig diary:', error);
    return null;
  }
}

/**
 * Obtiene todos los diarios de un dueño
 */
export async function getDiariesByOwner(ownerId: string): Promise<PigDiary[]> {
  const q = query(
    collection(db, "pigDiaries"),
    where("ownerId", "==", ownerId),
    orderBy("lastActivityAt", "desc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PigDiary));
}

/**
 * Actualiza la configuración del diario
 */
export async function updateDiarySettings(
  diaryId: string,
  settings: Partial<PigDiary["settings"]>
): Promise<void> {
  const diaryRef = doc(db, "pigDiaries", diaryId);
  await updateDoc(diaryRef, {
    settings: settings,
    updatedAt: serverTimestamp(),
  });
}

// ===== HITOS POST-ADOPCIÓN =====

/**
 * Añade un nuevo hito al diario
 */
export async function addPostAdoptionMilestone(
  diaryId: string,
  milestone: Omit<PostAdoptionMilestone, "id" | "createdAt">
): Promise<string> {
  const milestoneRef = doc(collection(db, "pigDiaries", diaryId, "milestones"));
  const now = serverTimestamp() as Timestamp;
  
  const newMilestone: PostAdoptionMilestone = {
    ...milestone,
    id: milestoneRef.id,
    createdAt: now,
  };

  await setDoc(milestoneRef, newMilestone);
  
  // Actualizar el diario principal
  await updateDoc(doc(db, "pigDiaries", diaryId), {
    updatedAt: now,
    lastActivityAt: now,
  });

  return milestoneRef.id;
}

/**
 * Obtiene todos los hitos de un diario
 */
export async function getPostAdoptionMilestones(diaryId: string): Promise<PostAdoptionMilestone[]> {
  const q = query(
    collection(db, "pigDiaries", diaryId, "milestones"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data() as PostAdoptionMilestone);
}

/**
 * Elimina un hito del diario
 */
export async function deletePostAdoptionMilestone(
  diaryId: string,
  milestoneId: string
): Promise<void> {
  await deleteDoc(doc(db, "pigDiaries", diaryId, "milestones", milestoneId));
  
  // Actualizar el diario principal
  await updateDoc(doc(db, "pigDiaries", diaryId), {
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });
}

// ===== REGISTROS DE CRECIMIENTO =====

/**
 * Añade un registro de crecimiento
 */
export async function addGrowthRecord(
  diaryId: string,
  record: Omit<GrowthRecord, "id" | "createdAt">
): Promise<string> {
  const recordRef = doc(collection(db, "pigDiaries", diaryId, "growth"));
  const now = serverTimestamp() as Timestamp;
  
  const newRecord: GrowthRecord = {
    ...record,
    id: recordRef.id,
    createdAt: now,
  };

  await setDoc(recordRef, newRecord);
  
  // Actualizar el diario principal
  await updateDoc(doc(db, "pigDiaries", diaryId), {
    updatedAt: now,
    lastActivityAt: now,
  });

  return recordRef.id;
}

/**
 * Obtiene todos los registros de crecimiento
 */
export async function getGrowthRecords(diaryId: string): Promise<GrowthRecord[]> {
  const q = query(
    collection(db, "pigDiaries", diaryId, "growth"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data() as GrowthRecord);
}

// ===== REGISTROS DE SALUD =====

/**
 * Añade un registro de salud
 */
export async function addHealthRecord(
  diaryId: string,
  record: Omit<HealthRecord, "id" | "createdAt">
): Promise<string> {
  const recordRef = doc(collection(db, "pigDiaries", diaryId, "health"));
  const now = serverTimestamp() as Timestamp;
  
  const newRecord: HealthRecord = {
    ...record,
    id: recordRef.id,
    createdAt: now,
  };

  await setDoc(recordRef, newRecord);
  
  // Actualizar el diario principal
  await updateDoc(doc(db, "pigDiaries", diaryId), {
    updatedAt: now,
    lastActivityAt: now,
  });

  return recordRef.id;
}

/**
 * Obtiene todos los registros de salud
 */
export async function getHealthRecords(diaryId: string): Promise<HealthRecord[]> {
  const q = query(
    collection(db, "pigDiaries", diaryId, "health"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data() as HealthRecord);
}

// ===== FOTOS PRIVADAS =====

/**
 * Añade una foto privada
 */
export async function addPrivatePhoto(
  diaryId: string,
  photo: Omit<PrivatePhoto, "id" | "uploadedAt">
): Promise<string> {
  const photoRef = doc(collection(db, "pigDiaries", diaryId, "photos"));
  const now = serverTimestamp() as Timestamp;
  
  const newPhoto: PrivatePhoto = {
    ...photo,
    id: photoRef.id,
    uploadedAt: now,
  };

  await setDoc(photoRef, newPhoto);
  
  // Actualizar el diario principal
  await updateDoc(doc(db, "pigDiaries", diaryId), {
    updatedAt: now,
    lastActivityAt: now,
  });

  return photoRef.id;
}

/**
 * Obtiene todas las fotos privadas
 */
export async function getPrivatePhotos(diaryId: string): Promise<PrivatePhoto[]> {
  const q = query(
    collection(db, "pigDiaries", diaryId, "photos"),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data() as PrivatePhoto);
}

/**
 * Elimina una foto privada
 */
export async function deletePrivatePhoto(
  diaryId: string,
  photoId: string
): Promise<void> {
  await deleteDoc(doc(db, "pigDiaries", diaryId, "photos", photoId));
  
  // Actualizar el diario principal
  await updateDoc(doc(db, "pigDiaries", diaryId), {
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });
}

// ===== RECOMENDACIONES PERSONALIZADAS =====

/**
 * Crea una recomendación personalizada
 */
export async function createPersonalizedRecommendation(
  recommendation: Omit<PersonalizedRecommendation, "id" | "createdAt" | "isRead">
): Promise<string> {
  const recommendationRef = doc(collection(db, "personalizedRecommendations"));
  const now = serverTimestamp() as Timestamp;
  
  const newRecommendation: PersonalizedRecommendation = {
    ...recommendation,
    id: recommendationRef.id,
    createdAt: now,
    isRead: false,
  };

  await setDoc(recommendationRef, newRecommendation);
  return recommendationRef.id;
}

/**
 * Obtiene las recomendaciones no leídas de un usuario
 */
export async function getUnreadRecommendations(ownerId: string): Promise<PersonalizedRecommendation[]> {
  // Consulta simplificada sin orderBy para evitar necesidad de índice compuesto
  const q = query(
    collection(db, "personalizedRecommendations"),
    where("ownerId", "==", ownerId),
    where("isRead", "==", false)
  );
  const snapshot = await getDocs(q);
  
  // Ordenar manualmente en el cliente
  const recommendations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PersonalizedRecommendation));
  return recommendations.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Marca una recomendación como leída
 */
export async function markRecommendationAsRead(recommendationId: string): Promise<void> {
  const recommendationRef = doc(db, "personalizedRecommendations", recommendationId);
  await updateDoc(recommendationRef, {
    isRead: true,
    readAt: serverTimestamp(),
  });
}

/**
 * Elimina una recomendación
 */
export async function deleteRecommendation(recommendationId: string): Promise<void> {
  await deleteDoc(doc(db, "personalizedRecommendations", recommendationId));
}
