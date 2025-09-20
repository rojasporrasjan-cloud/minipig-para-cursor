// lib/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './client'; // Usamos nuestro cliente de Firebase configurado

/**
 * Sube un archivo a Firebase Storage y devuelve la URL de descarga.
 * @param file - El archivo a subir.
 * @param path - La ruta dentro del bucket donde se guardará (ej: 'pigs' o 'products').
 * @returns La URL pública del archivo subido.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  // Genera un nombre de archivo único para evitar colisiones
  const fileName = `${path}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, fileName);

  // Sube el archivo
  const snapshot = await uploadBytes(storageRef, file);

  // Obtiene la URL de descarga pública
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}