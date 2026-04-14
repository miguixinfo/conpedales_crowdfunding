# SPEC.md - Frontend Admin ConPedales

## 1. Overview

**Nombre del proyecto**: ConPedales Admin
**Tipo**: Aplicación móvil (React Native / Expo)
**Descripción**: Panel de administración para gestionar el contenido del viaje Toledo → Atenas en bicicleta: etapas, segmentos, eventos y fotos.
**Usuario objetivo**: Administradores del proyecto ConPedales

---

## 2. Technology Stack

| Categoría | Tecnología |
|-----------|------------|
| Framework | Expo SDK 52 |
| Lenguaje | TypeScript |
| Navegación | React Navigation v7 (Drawer + Stack) |
| Estado | Zustand (stores) |
| Estilos | CSS Modules por componente |
| Mapas | react-native-maps |
| Imágenes | expo-image-picker |
| Storage | @react-native-async-storage/async-storage |
| HTTP | Axios |
| UI Base | Componentes custom (sin librería externa) |

---

## 3. Screen Structure

### 3.1 Autenticación

| Pantalla | Archivo | Descripción |
|----------|---------|-------------|
| Login | `src/screens/auth/LoginScreen.tsx` | Pantalla de inicio de sesión |

### 3.2 Main (Drawer + Stacks)

| Pantalla | Archivo | Descripción |
|----------|---------|-------------|
| Dashboard | `src/screens/dashboard/DashboardScreen.tsx` | Stats y última etapa |
| Stages List | `src/screens/stages/StageListScreen.tsx` | Listado de etapas |
| Stage Detail | `src/screens/stages/StageDetailScreen.tsx` | Detalle de etapa |
| Stage Form | `src/screens/stages/StageFormScreen.tsx` | Crear/Editar etapa |
| Segment Detail | `src/screens/segments/SegmentDetailScreen.tsx` | Detalle de segmento |
| Segment Form | `src/screens/segments/SegmentFormScreen.tsx` | Crear/Editar segmento |
| Event Form | `src/screens/events/EventFormScreen.tsx` | Crear evento |
| Photos Gallery | `src/screens/photos/PhotoGalleryScreen.tsx` | Galería de fotos |
| Photo Upload | `src/screens/photos/PhotoUploadScreen.tsx` | Subir foto |

### 3.3 Navigation Flow

```
App.tsx
    ↓
[Token exists?] → Yes → MainNavigator (Drawer)
    ↓
    No
    ↓
AuthNavigator (Login)
    ↓
[Login success] → MainNavigator

MainNavigator (Drawer)
├── Dashboard (Stack)
├── Stages (Stack)
│   ├── StageListScreen
│   ├── StageDetailScreen
│   └── StageFormScreen (create/edit)
├── Segments (Stack)
│   ├── SegmentDetailScreen
│   └── SegmentFormScreen
├── Photos (Stack)
│   ├── PhotoGalleryScreen
│   └── PhotoUploadScreen
└── Settings (abre Drawer)
```

---

## 4. Feature Requirements

### 4.1 Autenticación

- [ ] Pantalla login con username y password
- [ ] Validación de campos requeridos
- [ ] Llamada POST /admin/auth/login
- [ ] Guardar token JWT en AsyncStorage
- [ ] Manejo de errores (credenciales inválidas)
- [ ] Loading state durante login
- [ ] Verificar token al iniciar app
- [ ] Cerrar sesión (eliminar token, redirigir a login)

### 4.2 Dashboard

- [ ] Mostrar stats globales: km totales, km financiados, desnivel, etapas, donado, donaciones, donantes únicos
- [ ] Datos de GET /stats
- [ ] Card con última etapa publicada (GET /stages/latest)
- [ ] Pull-to-refresh para actualizar stats
- [ ] Quick actions: crear etapa, subir foto

### 4.3 Gestión de Etapas

**Listar etapas** (`GET /admin/stages`):
- [ ] Lista de etapas con: día, país, origen → destino, km, estado (publicada/borrador)
- [ ] Pull-to-refresh
- [ ] Loading state
- [ ] Empty state si no hay etapas
- [ ] Botón crear etapa
- [ ] Botones editar/eliminar por item

**Ver detalle** (`GET /admin/stages/{id}`):
- [ ] Mostrar todos los datos de la etapa
- [ ] Toggle publicar/borrador
- [ ] Lista de segmentos asociados
- [ ] Lista de fotos asociadas
- [ ] Botón editar
- [ ] Botón eliminar

**Crear etapa** (`POST /admin/stages`):
- [ ] Formulario con validación
- [ ] Campos: dayNumber, country, startName, startLat, startLng, endName, endLat, endLng, km, elevationGain, movingTime, description, isPublished
- [ ] **CoordinatePicker** para origen (selección en mapa)
- [ ] **CoordinatePicker** para destino (selección en mapa)
- [ ] Validación: día > 0, coords válidas, km > 0

**Editar etapa** (`PUT /admin/stages/{id}`):
- [ ] Mismo formulario que crear, precargado
- [ ] Actualizar datos

**Eliminar etapa** (`DELETE /admin/stages/{id}`):
- [ ] Confirmation dialog
- [ ] Eliminar y refresh list
- [ ] Toast de éxito/error

### 4.4 Gestión de Segmentos

**Listar segmentos** ( dentro de etapa):
- [ ] Ver segmentos de una etapa específica
- [ ] Mostrar: inicio → fin, km, desnivel, número de eventos

**Crear segmento** (`POST /admin/segments`):
- [ ] Formulario con stageId (pasado por params/navigation)
- [ ] Campos: stageId, startName, startLat, startLng, endName, endLat, endLng, km, elevationGain
- [ ] **CoordinatePicker** para inicio y fin

**Editar segmento** (`PUT /admin/segments/{id}`):
- [ ] Formulario precargado
- [ ] Actualizar

**Eliminar segmento** (`DELETE /admin/segments/{id}`):
- [ ] Confirmation dialog
- [ ] Eliminar y refresh

### 4.5 Gestión de Eventos

**Listar eventos** (`GET /admin/segments/{id}/events`):
- [ ] Lista de eventos del segmento
- [ ] Mostrar: tipo, descripción, coordenadas

**Crear evento** (`POST /admin/segments/{id}/events`):
- [ ] Selector de tipo: pinchazo, mecánico, interacción social, comida, paisaje
- [ ] Campo descripción
- [ ] **CoordinatePicker** opcional para ubicación
- [ ] Validación: tipo requerido

**Eliminar evento** (`DELETE /admin/segments/events/{id}`):
- [ ] Confirmation dialog
- [ ] Eliminar y refresh

### 4.6 Gestión de Fotos

**Galería de fotos**:
- [ ] Grid de fotos
- [ ] Filtrar por etapa (opcional)
- [ ] Indicador de foto destacada (estrella)
- [ ] Preview al pulsar
- [ ] Eliminar foto

**Subir foto**:
- [ ] ImagePicker (galería/cámara)
- [ ] Preview de imagen seleccionada
- [ ] Formulario: caption, stageId (optional), segmentId (optional), isHighlight, takenAt (optional)
- [ ] Flujo: 1) Pedir upload URL → 2) Subir a R2 → 3) Registrar en DB
- [ ] Progress indicator durante upload
- [ ] Toast éxito/error

### 4.7 Integración con Mapas

- [ ] Componente CoordinatePicker con react-native-maps
- [ ] Mostrar mapa centrado en coordenadas iniciales (o España si no hay)
- [ ] Permitir pulsar para seleccionar punto
- [ ] Mostrar marker en punto seleccionado
- [ ] Devolver lat/lng al componente padre
- [ ] Usado en: StageForm (origen/destino), SegmentForm (inicio/fin), EventForm (ubicación)

---

## 5. UI/UX Requirements

### 5.1 Diseño General

- **Estilo**: clean, natural, aventura (temacycling)
- **Colores**:
  - Primary: #2E7D32 (verde naturaleza)
  - Secondary: #FF6F00 (naranja aventura)
  - Background: #FAFAFA
  - Surface: #FFFFFF
  - Text: #212121
  - Error: #D32F2F
  - Success: #388E3C
- **Tipografía**: Sistema (San Francisco/Roboto)
- **Iconos**: Ionicons (incluidos en Expo)

### 5.2 Componentes Comunes

- **Button**: primary (filled), secondary (outline), text. Estados: default, pressed, disabled, loading
- **Input**: text, number. Estados: default, focused, error. Label siempre visible
- **Loading**: spinner centrado con texto opcional
- **EmptyState**: icono + mensaje + botón acción
- **ConfirmDialog**: título, mensaje, botones confirmar/cancelar
- **Toast**: mensaje temporal (éxito/error) en bottom

### 5.3 Navigation Header

- Mostrar título de pantalla (usando `headerShown: true` en Stack)
- Botón atrás automático en Stack
- Menú hamburger en Drawer

### 5.4 Drawer Menu Items

- Dashboard (icon: home-outline/home)
- Etapas (icon: bicycle-outline/bicycle)
- Fotos (icon: camera-outline/camera)
- Cerrar sesión (icon: log-out-outline, al final, separado)

---

## 6. API Integration

### Base URL
```
development: http://localhost:8080
production: https://api.conpedales.com (configurable via env)
```

### Headers
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'
}
```

### Endpoints a consumir

| Método | Endpoint | Uso |
|--------|---------|-----|
| POST | /admin/auth/login | Login |
| GET | /admin/stages | Listar etapas |
| GET | /admin/stages/{id} | Detalle etapa |
| POST | /admin/stages | Crear etapa |
| PUT | /admin/stages/{id} | Editar etapa |
| DELETE | /admin/stages/{id} | Eliminar etapa |
| GET | /admin/segments/{id} | Ver segmento |
| POST | /admin/segments | Crear segmento |
| PUT | /admin/segments/{id} | Editar segmento |
| DELETE | /admin/segments/{id} | Eliminar segmento |
| GET | /admin/segments/{id}/events | Ver eventos |
| POST | /admin/segments/{id}/events | Crear evento |
| DELETE | /admin/segments/events/{id} | Eliminar evento |
| POST | /admin/photos/upload-url | Pedir URL upload |
| POST | /admin/photos | Registrar foto |
| DELETE | /admin/photos/{id} | Eliminar foto |
| GET | /stats | Stats globales |
| GET | /stages/latest | Última etapa |

---

## 7. State Management (Zustand)

### authStore.ts
```typescript
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadStoredAuth: () => Promise<void>;
}
```

### stagesStore.ts
```typescript
interface StagesState {
  stages: Stage[];
  currentStage: Stage | null;
  isLoading: boolean;
  fetchStages: () => Promise<void>;
  fetchStage: (id: number) => Promise<void>;
  createStage: (data: CreateStageDTO) => Promise<void>;
  updateStage: (id: number, data: UpdateStageDTO) => Promise<void>;
  deleteStage: (id: number) => Promise<void>;
}
```

### statsStore.ts
```typescript
interface StatsState {
  stats: Stats | null;
  latestStage: Stage | null;
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchLatestStage: () => Promise<void>;
}
```

---

## 8. Error Handling

- **Errores de red**: Mostrar toast "Error de conexión"
- **401 Unauthorized**: Logout automático, redirigir a login
- **400 Bad Request**: Mostrar mensaje del servidor
- **500 Server Error**: Mostrar "Error del servidor"
- **Form validation**: Mensajes inline bajo cada campo

---

## 9. Security

- Token almacenado en AsyncStorage (no MMKV ni SecureStore por simplicidad)
- Verificar token al iniciar app
- Limpiar token al hacer logout
- No exponer token en logs

---

## 10. Performance

- Lazy loading de imágenes en galería
- Pagination en listas grandes (si aplica)
- Memoización de componentes con useMemo/useCallback
- Optimizar re-renders con React.memo

---

## 11. Testing (Future)

- Unit tests para servicios y hooks
- Integration tests para flujos principales
- E2E con Detox (opcional)

---

## 12. Future Considerations

- Offline support (guardar drafts localmente)
- Notificaciones push para nuevos donors
- Modo offline para ver etapas publicades
- Export/import de datos