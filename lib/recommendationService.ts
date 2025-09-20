// lib/recommendationService.ts
import { 
  createPersonalizedRecommendation,
  getUnreadRecommendations,
} from './firebase/diary';
import { generatePersonalizedRecommendations } from './recommendationTemplates';
import { Pig } from './types/pig';

/**
 * Servicio para gestionar recomendaciones personalizadas
 */
export class RecommendationService {
  /**
   * Genera recomendaciones iniciales para un cerdito recién adoptado
   */
  static async generateInitialRecommendations(pig: Pig, ownerId: string): Promise<void> {
    try {
      // Calcular edad en meses basado en birthDate
      const ageMonths = pig.birthDate ? 
        Math.floor((Date.now() - new Date(pig.birthDate as any).getTime()) / (1000 * 60 * 60 * 24 * 30)) :
        pig.ageMonths;

      // Generar recomendaciones basadas en la edad
      const templates = generatePersonalizedRecommendations(ageMonths);
      
      // Por ahora, crear todas las recomendaciones sin verificar duplicados
      // TODO: Implementar verificación de duplicados cuando se creen los índices necesarios
      const newRecommendations = templates;

      // Crear las recomendaciones en Firebase
      for (const template of newRecommendations) {
        const recommendationData: any = {
          pigId: pig.id!,
          ownerId,
          type: template.type,
          title: template.title,
          description: template.description,
          actionUrl: template.actionUrl,
          priority: template.priority,
        };
        
        // Solo agregar expiresAt si no es undefined
        if (template.type === 'reminder') {
          recommendationData.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) as any; // 30 días
        }
        
        await createPersonalizedRecommendation(recommendationData);
      }

      console.log(`Generated ${newRecommendations.length} initial recommendations for ${pig.name}`);
    } catch (error) {
      console.error('Error generating initial recommendations:', error);
    }
  }

  /**
   * Genera recomendaciones para cumpleaños
   */
  static async generateBirthdayRecommendations(pig: Pig, ownerId: string): Promise<void> {
    try {
      if (!pig.birthDate) return;

      const birthDate = new Date(pig.birthDate as any);
      const today = new Date();
      
      // Verificar si el cumpleaños está próximo (dentro de 7 días)
      const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      const daysUntilBirthday = Math.ceil((birthdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilBirthday >= 0 && daysUntilBirthday <= 7) {
        await createPersonalizedRecommendation({
          pigId: pig.id!,
          ownerId,
          type: 'tip',
          title: `¡El cumpleaños de ${pig.name} se acerca!`,
          description: `¡${pig.name} cumple años en ${daysUntilBirthday} día${daysUntilBirthday !== 1 ? 's' : ''}! ¿Has pensado en celebrarlo?`,
          actionUrl: '/tienda',
          priority: 'medium',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) as any, // 7 días
        });
      }
    } catch (error) {
      console.error('Error generating birthday recommendations:', error);
    }
  }

  /**
   * Genera recomendaciones estacionales
   */
  static async generateSeasonalRecommendations(pig: Pig, ownerId: string): Promise<void> {
    try {
      const currentMonth = new Date().getMonth() + 1;
      let recommendation;

      if (currentMonth >= 6 && currentMonth <= 9) { // Verano (Junio-Septiembre)
        recommendation = {
          pigId: pig.id!,
          ownerId,
          type: 'tip' as const,
          title: 'Cuidados especiales en verano',
          description: 'El calor puede ser peligroso para los mini pigs. Aprende cómo proteger a tu cerdito durante los meses calurosos.',
          actionUrl: '/blog/cuidados-verano',
          priority: 'medium' as const,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) as any, // 90 días
        };
      } else if (currentMonth >= 11 || currentMonth <= 2) { // Invierno (Noviembre-Febrero)
        recommendation = {
          pigId: pig.id!,
          ownerId,
          type: 'tip' as const,
          title: 'Preparándonos para el invierno',
          description: 'Los mini pigs necesitan cuidados especiales durante los meses fríos. Descubre cómo mantener a tu cerdito cómodo.',
          actionUrl: '/blog/cuidados-invierno',
          priority: 'medium' as const,
          expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) as any, // 120 días
        };
      }

      if (recommendation) {
        // Por ahora, crear la recomendación sin verificar duplicados
        // TODO: Implementar verificación de duplicados cuando se creen los índices necesarios
        await createPersonalizedRecommendation(recommendation);
      }
    } catch (error) {
      console.error('Error generating seasonal recommendations:', error);
    }
  }

  /**
   * Genera todas las recomendaciones relevantes para un cerdito
   */
  static async generateAllRecommendations(pig: Pig, ownerId: string): Promise<void> {
    try {
      // Por ahora, solo generar recomendaciones iniciales para evitar errores de permisos
      await this.generateInitialRecommendations(pig, ownerId);
      
      // TODO: Habilitar estas funciones cuando se configuren los permisos correctamente
      // await this.generateBirthdayRecommendations(pig, ownerId);
      // await this.generateSeasonalRecommendations(pig, ownerId);
    } catch (error) {
      console.error('Error generating all recommendations:', error);
      // No lanzar el error para que la aplicación continúe funcionando
    }
  }
}
