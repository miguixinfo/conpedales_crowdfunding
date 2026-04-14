# Arquitectura del Frontend Admin

## 1. Estructura del Proyecto

```
conpedales-admin/
├── App.tsx                       # Entry point con NavigationContainer
├── src/
│   ├── navigation/
│   │   ├── AuthNavigator.tsx    # Stack: Login
│   │   ├── MainNavigator.tsx    # Drawer + nested stacks
│   │   └── types.ts             # Tipos de navegación
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── stages/
│   │   │   ├── StageListScreen.tsx
│   │   │   ├── StageDetailScreen.tsx
│   │   │   ├── StageFormScreen.tsx    # Create/Edit
│   │   │   └── StageItem.tsx          # List item
│   │   ├── segments/
│   │   │   ├── SegmentDetailScreen.tsx
│   │   │   └── SegmentFormScreen.tsx
│   │   ├── events/
│   │   │   └── EventFormScreen.tsx
│   │   └── photos/
│   │       ├── PhotoGalleryScreen.tsx
│   │       └── PhotoUploadScreen.tsx
│   ├── components/              # Componentes reutilizables
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── stages/
│   │   │   ├── StageCard.tsx
│   │   │   ├── StageForm.tsx
│   │   │   └── StageList.tsx
│   │   ├── segments/
│   │   │   ├── SegmentCard.tsx
│   │   │   ├── SegmentForm.tsx
│   │   │   └── SegmentList.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventForm.tsx
│   │   │   └── EventList.tsx
│   │   ├── photos/
│   │   │   ├── PhotoGrid.tsx
│   │   │   ├── PhotoCard.tsx
│   │   │   └── PhotoUploader.tsx
│   │   ├── map/
│   │   │   ├── CoordinatePicker.tsx
│   │   │   └── MapView.tsx
│   │   └── stats/
│   │       ├── StatCard.tsx
│   │       └── StatsGrid.tsx
│   ├── context/                 # Context API providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── StagesContext.tsx    # Stages CRUD
│   │   ├── SegmentsContext.tsx  # Segments CRUD
│   │   ├── EventsContext.tsx    # Events CRUD
│   │   ├── PhotosContext.tsx    # Photos CRUD
│   │   └── AppContext.tsx       # Combined provider
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useStages.ts
│   │   ├── useSegments.ts
│   │   ├── useEvents.ts
│   │   ├── usePhotos.ts
│   │   ├── useStats.ts
│   │   └── useApi.ts
│   ├── services/                # API layer
│   │   ├── api.ts              # Axios instance
│   │   ├── auth.ts             # Auth endpoints
│   │   ├── stages.ts           # Stages endpoints
│   │   ├── segments.ts         # Segments endpoints
│   │   ├── events.ts           # Events endpoints
│   │   ├── photos.ts           # Photos endpoints
│   │   └── stats.ts            # Stats endpoints
│   ├── types/                   # TypeScript types
│   │   ├── index.ts            # Shared types
│   │   ├── stages.ts           # Stage types
│   │   ├── segments.ts         # Segment types
│   │   ├── events.ts          # Event types
│   │   ├── photos.ts          # Photo types
│   │   └── auth.ts            # Auth types
│   ├── utils/                   # Utilities
│   │   ├── storage.ts          # AsyncStorage helpers
│   │   ├── validation.ts      # Form validation
│   │   └── format.ts          # Formatting helpers
│   ├── constants/               # Constants
│   │   ├── api.ts             # API URLs
│   │   ├── colors.ts          # Color palette
│   │   └── config.ts          # App config
│   └── assets/                 # Static assets
│       ├── images/
│       └── fonts/
├── android/                     # Android native code
├── ios/                         # iOS native code
├── package.json
├── tsconfig.json
├── babel.config.js
└── app.json
```

---

## 2. Navegación

### Estructura de Navegación (igual que Suances)

```
App.tsx
├── AuthNavigator (Stack)
│   └── LoginScreen
└── MainNavigator (Drawer)
    ├── DashboardStack
    │   └── DashboardScreen
    ├── StagesStack
    │   ├── StageListScreen
    │   ├── StageDetailScreen
    │   └── StageFormScreen (create/edit)
    ├── PhotosStack
    │   ├── PhotoGalleryScreen
    │   └── PhotoUploadScreen
    └── Settings (abre Drawer)
```

### Menú del Drawer
- Dashboard (icon: home-outline)
- Etapas (icon: bicycle-outline)
- Fotos (icon: camera-outline)
- Cerrar sesión (icon: log-out-outline, separado al final)

---

## 3. Gestión de Estado (Zustand)

Igual que en la app de Suances, usamos stores de Zustand:

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/auth';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(username, password);
      await AsyncStorage.setItem('auth_token', response.token);
      set({ token: response.token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    set({ token: null, isAuthenticated: false });
  },
  
  loadStoredAuth: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    set({ token, isAuthenticated: !!token, isLoading: false });
  },
}));
```

### Stores por dominio
- `authStore.ts` - Autenticación
- `stagesStore.ts` - CRUD etapas
- `segmentsStore.ts` - CRUD segmentos
- `photosStore.ts` - Gestión de fotos
- `statsStore.ts` - Estadísticas

---

## 4. Integración con API

### Axios Instance

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

### Servicios

```typescript
// src/services/stages.ts
export const getStages = () => api.get('/admin/stages');
export const getStage = (id: number) => api.get(`/admin/stages/${id}`);
export const createStage = (data: CreateStageDTO) => api.post('/admin/stages', data);
export const updateStage = (id: number, data: UpdateStageDTO) => api.put(`/admin/stages/${id}`, data);
export const deleteStage = (id: number) => api.delete(`/admin/stages/${id}`);
```

---

## 5. Componentes de Mapa

### CoordinatePicker

Componente para seleccionar coordenadas en el mapa:
- Mostrar mapa con react-native-maps
- Permitir pulsar para seleccionar punto
- Mostrar marker en punto seleccionado
- Devolver lat/lng al componente padre
- Usado en: StageForm, SegmentForm, EventForm

```typescript
interface CoordinatePickerProps {
  initialCoordinates?: { lat: number; lng: number };
  onSelect: (coords: { lat: number; lng: number }) => void;
  label: string;
}
```

---

## 6. Estilos

### Módulos CSS por componente

Cada componente tiene su archivo CSS module:

```
Button.tsx
Button.module.css

StageCard.tsx
StageCard.module.css
```

### Colores (constants/colors.ts)

```typescript
export const colors = {
  primary: '#2E7D32',      // Verde natural
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  secondary: '#FF6F00',    // Naranja aventura
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
};
```

---

## 7. Seguridad

### AsyncStorage para token

```typescript
// storage.ts
export const Storage = {
  async setToken(token: string) {
    await AsyncStorage.setItem('auth_token', token);
  },
  async getToken() {
    return AsyncStorage.getItem('auth_token');
  },
  async removeToken() {
    await AsyncStorage.removeItem('auth_token');
  },
};
```

### Auth Check en App.tsx

```typescript
// App.tsx
export default function App() {
  const { isAuthenticated, loadStoredAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadStoredAuth();
      setIsInitializing(false);
    };
    init();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
}
```

---

## 8. Dependencias Principales

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/drawer": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-screens": "^4.0.0",
    "react-native-safe-area-context": "^5.0.0",
    "react-native-gesture-handler": "^2.20.0",
    "react-native-maps": "^1.18.0",
    "expo-image-picker": "~16.0.0",
    "@react-native-async-storage/async-storage": "2.1.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "expo-status-bar": "~2.0.0"
  }
}
```

---

## 9. Pantallas Principales

### Login (src/screens/auth/LoginScreen.tsx)
- Logo/app name
- Input username
- Input password
- Botón login
- Error message
- Loading state

### Dashboard (src/screens/dashboard/DashboardScreen.tsx)
- Stats cards (km, km financiados, desnivel, etapas, donado, donaciones)
- Última etapa publicada card
- Quick actions: nueva etapa, subir foto

### Stages List (src/screens/stages/StageListScreen.tsx)
- Header con título y botón crear
- Lista de StageCard (pull-to-refresh)
- Empty state

### Stage Detail (src/screens/stages/StageDetailScreen.tsx)
- Datos de etapa
- Toggle publicar/borrador
- Lista segmentos (expandable)
- Lista fotos (expandable)
- Botones editar/eliminar

### Stage Form (src/screens/stages/StageFormScreen.tsx)
- Formulario con CoordinatePicker para origen y destino
- Validación inline
- Loading state
- Modo create/edit basado en si recibe ID

### Photo Upload (src/screens/photos/PhotoUploadScreen.tsx)
- Image picker
- Preview
- Form: caption, etapa/segmento, destacada
- Progress bar

---

## 10. Flujos de Usuario

### Login → Dashboard
1. Usuario abre app
2. Layout verifica token en storage
3. Si no hay token → Login
4. Usuario ingresa credenciales
5. API retorna token
6. Guardar token y setear auth state
7. Navigate a Dashboard

### Crear Etapa
1. Dashboard → Botón "Nueva etapa"
2. Navigate a StageForm
3. Usuario completa campos
4. CoordinatePicker para origen (mapa)
5. CoordinatePicker para destino (mapa)
6. Submit → POST /admin/stages
7. Loading state
8. Success → Navigate back + refresh list
9. Error → Mostrar toast

### Subir Foto
1. Photos → Botón "Subir"
2. ImagePicker abre galería
3. Preview imagen
4. Form: caption, asociar a etapa/segmento
5. POST /admin/photos/upload-url
6. Upload a R2 (directo)
7. POST /admin/photos con URL
8. Success → Navigate back