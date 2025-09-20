# 📔 Diario de Vida Digital - Documentación

## Resumen

El **Diario de Vida Digital** es una funcionalidad avanzada que permite a los dueños de mini pigs mantener un registro completo y personalizado de la vida de sus mascotas después de la adopción. Esta característica transforma el sitio de un simple criadero a un compañero de vida a largo plazo.

## 🎯 Objetivos

- **Fidelización**: Crear una razón para que los clientes regresen al sitio web regularmente
- **Valor agregado**: Proporcionar herramientas útiles para el cuidado de mini pigs
- **Retención**: Mantener a los clientes comprometidos más allá de la compra inicial
- **Cross-selling**: Generar oportunidades de venta a través de recomendaciones personalizadas

## 🏗️ Arquitectura

### Modelos de Datos

#### PigDiary
```typescript
type PigDiary = {
  id: string;
  pigId: string;
  ownerId: string;
  postAdoptionMilestones: PostAdoptionMilestone[];
  growthRecords: GrowthRecord[];
  healthRecords: HealthRecord[];
  privatePhotos: PrivatePhoto[];
  settings: DiarySettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivityAt: Timestamp;
}
```

#### PostAdoptionMilestone
```typescript
type PostAdoptionMilestone = {
  id: string;
  type: 'health' | 'growth' | 'training' | 'adventure' | 'birthday' | 'milestone' | 'memory';
  title: string;
  description: string;
  date: Timestamp;
  images?: string[];
  addedBy: string;
  createdAt: Timestamp;
}
```

### Componentes Principales

1. **PigDiaryDashboard**: Componente principal que orquesta toda la funcionalidad
2. **DiaryTimeline**: Línea de tiempo que combina hitos pre y post-adopción
3. **GrowthTracker**: Seguimiento de peso y crecimiento con gráficas
4. **HealthTracker**: Registro médico con recordatorios
5. **PrivateGallery**: Galería privada de fotos con etiquetas
6. **PersonalizedRecommendations**: Sistema de recomendaciones inteligentes
7. **DiarySettings**: Configuración de privacidad y preferencias

## 🚀 Funcionalidades

### 1. Línea de Tiempo Evolutiva
- **Hitos pre-adopción**: Información del criadero (nacimiento, vacunas iniciales)
- **Hitos post-adopción**: Eventos añadidos por el dueño
- **Tipos de hitos**: Salud, crecimiento, entrenamiento, aventuras, cumpleaños, memorias
- **Fotos**: Cada hito puede incluir imágenes

### 2. Registro de Crecimiento
- **Peso**: Seguimiento periódico del peso
- **Medidas**: Longitud y altura opcionales
- **Gráficas**: Visualización del crecimiento a lo largo del tiempo
- **Estadísticas**: Ganancia de peso, promedio, tendencias

### 3. Registro de Salud
- **Tipos**: Vacunas, desparasitaciones, revisiones, tratamientos
- **Recordatorios**: Fechas de próximas citas importantes
- **Información médica**: Veterinario, ubicación, costos
- **Historial completo**: Seguimiento médico detallado

### 4. Galería Privada
- **Fotos privadas**: Solo el dueño puede verlas
- **Etiquetas**: Sistema de etiquetas para organización (#playa, #cumpleaños)
- **Descripciones**: Contexto para cada foto
- **Organización por meses**: Agrupación cronológica

### 5. Recomendaciones Inteligentes
- **Basadas en edad**: Contenido relevante según la edad del cerdito
- **Tipos**: Productos, artículos, recordatorios, tips
- **Prioridades**: Alta, media, baja
- **Estacionales**: Cuidados específicos por temporada
- **Cumpleaños**: Recordatorios automáticos

## 🔧 Implementación Técnica

### Estructura de Archivos

```
lib/
├── types/diary.ts                    # Tipos de datos del diario
├── recommendationTemplates.ts        # Templates de recomendaciones
├── recommendationService.ts          # Servicio de recomendaciones
└── firebase/diary.ts                 # Funciones de Firebase

hooks/
└── usePigDiary.ts                    # Hook personalizado

components/diary/
├── PigDiaryDashboard.tsx             # Dashboard principal
├── DiaryTimeline.tsx                 # Línea de tiempo
├── GrowthTracker.tsx                 # Seguimiento de crecimiento
├── HealthTracker.tsx                 # Registro de salud
├── PrivateGallery.tsx                # Galería privada
├── PersonalizedRecommendations.tsx   # Recomendaciones
├── DiarySettings.tsx                 # Configuración
├── AddMilestoneModal.tsx             # Modal para añadir hitos
├── AddGrowthModal.tsx                # Modal para registrar peso
├── AddHealthModal.tsx                # Modal para visitas médicas
└── AddPhotoModal.tsx                 # Modal para subir fotos

app/mi-cuenta/diario/[pigId]/
└── page.tsx                          # Página del diario
```

### Base de Datos (Firestore)

#### Colecciones
- `pigDiaries`: Diarios principales
- `pigDiaries/{diaryId}/milestones`: Hitos post-adopción
- `pigDiaries/{diaryId}/growth`: Registros de crecimiento
- `pigDiaries/{diaryId}/health`: Registros de salud
- `pigDiaries/{diaryId}/photos`: Fotos privadas
- `personalizedRecommendations`: Recomendaciones personalizadas

### Hook usePigDiary

```typescript
const {
  diary,                    // Diario principal
  milestones,              // Hitos del diario
  growthRecords,           // Registros de crecimiento
  healthRecords,           // Registros de salud
  privatePhotos,           // Fotos privadas
  recommendations,         // Recomendaciones
  loading,                 // Estado de carga
  error,                   // Errores
  addMilestone,           // Añadir hito
  addGrowth,              // Registrar crecimiento
  addHealth,              // Registrar salud
  addPhoto,               // Añadir foto
  updateSettings,         // Actualizar configuración
  markRecommendationRead, // Marcar recomendación como leída
  removeRecommendation,   // Eliminar recomendación
  generateRecommendations // Generar recomendaciones
} = usePigDiary(pigId);
```

## 🎨 Experiencia de Usuario

### Flujo Principal
1. **Acceso**: Desde "Mi Cuenta" → Botón "📔 Diario" en cada cerdito
2. **Navegación**: Pestañas para diferentes secciones
3. **Interacción**: Modales intuitivos para añadir contenido
4. **Personalización**: Configuración de privacidad y preferencias

### Características UX
- **Responsive**: Funciona en móviles y desktop
- **Intuitivo**: Iconos y colores consistentes
- **Accesible**: Navegación por teclado y lectores de pantalla
- **Rápido**: Carga optimizada con lazy loading

## 📊 Métricas y Analytics

### Métricas de Engagement
- Tiempo de sesión en el diario
- Frecuencia de actualizaciones
- Número de hitos añadidos
- Uso de recomendaciones

### Métricas de Conversión
- Clics en recomendaciones de productos
- Conversiones desde recomendaciones
- Retención de usuarios post-adopción

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
1. **Notificaciones push**: Recordatorios de salud y cumpleaños
2. **Compartir social**: Opción de compartir hitos públicos
3. **Exportar datos**: PDF del diario completo
4. **IA avanzada**: Análisis de patrones de salud
5. **Comunidad**: Conectar con otros dueños de mini pigs

### Integraciones
- **WhatsApp**: Notificaciones por WhatsApp
- **Email**: Recordatorios por correo
- **Calendario**: Sincronización con Google Calendar
- **Veterinarios**: Integración con clínicas veterinarias

## 🛡️ Privacidad y Seguridad

### Datos Privados
- Todas las fotos son completamente privadas
- Solo el dueño puede acceder a su diario
- Información médica protegida
- Configuración de privacidad granular

### Permisos
- Verificación de propiedad del cerdito
- Autenticación requerida
- Validación de datos en frontend y backend

## 📈 Impacto Esperado

### Métricas de Negocio
- **Retención**: +40% en usuarios post-adopción
- **Engagement**: +60% en tiempo de sesión
- **Cross-selling**: +25% en ventas de productos
- **Satisfacción**: +50% en NPS de clientes

### Valor para el Cliente
- Herramienta útil para el cuidado de su mascota
- Recordatorios importantes de salud
- Recomendaciones personalizadas
- Memoria digital permanente

---

*Esta funcionalidad representa un salto significativo en la propuesta de valor de Yo Tengo un Mini Pig, transformando la relación con los clientes de transaccional a relacional a largo plazo.*
