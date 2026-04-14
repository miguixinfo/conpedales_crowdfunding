---
## Goal

El usuario está construyendo el frontend admin de una aplicación móvil para un proyecto de crowdfunding ciclista (ConPedales), usando React Native con Expo. El backend ya existe en `c:\Users\Jlemonn1\Desktop\Freelance\ConPedales\Crowfounding\back`. El objetivo es crear una app móvil para administración de etapas, segmentos, eventos y fotos de un viaje en bicicleta de Toledo a Atenas.

## Instructions

- Seguir la documentación en `c:\Users\Jlemonn1\Desktop\Freelance\ConPedales\Crowfounding\docs\frontAdmin\` (HU.md, ARQUITECTURA.md, SPEC.md)
- Usar el patrón de navegación clásico de React Navigation (Drawer + Stack), igual que Suances-app
- Usar Zustand para estado (no Context API)
- Usar react-native-maps para CoordinatePicker (selección de coordenadas con mapa)
- URL backend: `http://172.20.10.7:8081` (configurable en ApiConfig.ts)
- AsyncStorage es suficiente para tokens
- Cuando token expire (401): logout automático

## Discoveries

1. **Estructura de navegación**: Drawer + Stacks anidados
2. **Stack tecnológico**: Expo SDK 52, TypeScript, React Navigation v7, Zustand, Axios, react-native-maps, expo-image-picker
3. **Colores principales**: primary: '#2E7D32' (verde), secondary: '#FF6F00' (naranja)
4. **Backend endpoints**: Documentados en api.ts
5. **CoordinatePicker**: Modal con mapa interactivo para seleccionar coordenadas
6. **Navegación Stages→Segments**: Los segmentos se acceden desde el detalle de una etapa

## Accomplished

**Fase 0 - Base del Proyecto**: ✅ Completada
- Proyecto Expo creado en `appAdmin/`
- Dependencias instaladas
- Estructura de carpetas creada
- Theme configurado
- Navegación base
- App.tsx con auth check

**Fase 1 - Autenticación**: ✅ Completada
- `src/services/api.ts` - Axios instance con interceptors
- `src/services/auth.ts` - Servicio de login
- `src/store/authStore.ts` - Zustand store
- `src/screens/auth/LoginScreen.tsx` - UI completa
- `src/navigation/MainNavigator.tsx` - Logout en Drawer

**Fase 2 - Dashboard + Stats**: ✅ Completada
- `src/services/stats.ts` - getStats, getLatestStage
- `src/store/statsStore.ts` - Store conectado a API
- `src/components/stats/` - StatCard, StatsGrid, LatestStageCard, QuickActions
- `src/screens/dashboard/DashboardScreen.tsx` - Dashboard completo

**Fase 3 - Gestión de Etapas**: ✅ Completada
- `src/services/stages.ts` - CRUD completo
- `src/store/stagesStore.ts` - Store con CRUD
- `src/components/stages/StageCard.tsx`
- `src/components/map/CoordinatePicker.tsx`
- `src/screens/stages/StageListScreen.tsx`
- `src/screens/stages/StageDetailScreen.tsx`
- `src/screens/stages/StageFormScreen.tsx`

**Fase 4 - Gestión de Segmentos**: ✅ Completada
- `src/services/segments.ts` - CRUD + eventos
- `src/store/segmentsStore.ts` - Store CRUD + eventos
- `src/components/segments/SegmentCard.tsx`
- `src/screens/segments/SegmentDetailScreen.tsx`
- `src/screens/segments/SegmentFormScreen.tsx`
- `src/screens/events/EventFormScreen.tsx`

**Refactorización de tipos**: ✅ Completada
- `src/types/index.ts` - Tipos centralizados
- `src/utils/validation.ts` - Validadores reutilizables
- Todos los imports actualizados

**Fase 5 - Gestión de Fotos**: ✅ Completada
- `src/services/photos.ts` - Upload URL + CRUD + updatePhoto
- `src/store/photosStore.ts` - Store con upload progress + toggleHighlight
- `src/components/photos/PhotoCard.tsx` - Con toggle de highlight
- `src/components/photos/index.ts`
- `src/screens/photos/PhotoGalleryScreen.tsx` - Galería con filtros + toggle highlight
- `src/screens/photos/PhotoUploadScreen.tsx` - Upload con selección de etapa y segmento
- Navegación actualizada con PhotoUpload

**Features adicionales implementadas:**
- Sección de fotos en StageDetailScreen (HU-5)
- Selección de segmento opcional en PhotoUploadScreen (HU-20)
- Toggle de foto destacada (isHighlight) en PhotoCard y PhotoGalleryScreen (HU-21)

## Relevant files / directories

**Proyecto**: `c:\Users\Jlemonn1\Desktop\Freelance\ConPedales\Crowfounding\appAdmin\`

**Types**: `src/types/index.ts`

**Services**:
- `src/services/api.ts` - Endpoints
- `src/services/auth.ts`
- `src/services/stats.ts`
- `src/services/stages.ts`
- `src/services/segments.ts`
- `src/services/photos.ts`

**Stores**:
- `src/store/authStore.ts`
- `src/store/statsStore.ts`
- `src/store/stagesStore.ts`
- `src/store/segmentsStore.ts`
- `src/store/photosStore.ts`

**Screens**:
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/dashboard/DashboardScreen.tsx`
- `src/screens/stages/StageListScreen.tsx`
- `src/screens/stages/StageDetailScreen.tsx`
- `src/screens/stages/StageFormScreen.tsx`
- `src/screens/segments/SegmentDetailScreen.tsx`
- `src/screens/segments/SegmentFormScreen.tsx`
- `src/screens/events/EventFormScreen.tsx`
- `src/screens/photos/PhotoGalleryScreen.tsx`
- `src/screens/photos/PhotoUploadScreen.tsx`

**Components**:
- `src/components/common/` - Button, Input, Loading, EmptyState, ConfirmDialog
- `src/components/stages/StageCard.tsx`
- `src/components/segments/SegmentCard.tsx`
- `src/components/stats/` - StatCard, StatsGrid, LatestStageCard, QuickActions
- `src/components/map/CoordinatePicker.tsx`
- `src/components/photos/PhotoCard.tsx`

**Navigation**:
- `src/navigation/AuthNavigator.tsx`
- `src/navigation/MainNavigator.tsx`
- `src/navigation/types.ts`

## Backend Endpoints

**Admin**:
- `POST /admin/auth/login` - Login
- `GET /admin/stages` - Listar etapas
- `GET /admin/stages/:id` - Detalle etapa
- `POST /admin/stages` - Crear etapa
- `PUT /admin/stages/:id` - Editar etapa
- `DELETE /admin/stages/:id` - Eliminar etapa
- `GET /admin/segments/:id` - Detalle segmento
- `POST /admin/segments` - Crear segmento
- `PUT /admin/segments/:id` - Editar segmento
- `DELETE /admin/segments/:id` - Eliminar segmento
- `GET /admin/segments/:id/events` - Eventos del segmento
- `POST /admin/segments/:id/events` - Crear evento
- `DELETE /admin/segments/events/:id` - Eliminar evento
- `POST /admin/photos/upload-url` - URL de upload
- `POST /admin/photos` - Crear foto
- `PUT /admin/photos/:id` - Actualizar foto (preparado, pendiente en backend)
- `DELETE /admin/photos/:id` - Eliminar foto

**Públicos**:
- `GET /stats` - Estadísticas globales
- `GET /stages/latest` - Última etapa publicada
- `GET /photos` - Todas las fotos
- `GET /photos/stage/:id` - Fotos por etapa
- `GET /photos/highlight` - Fotos destacadas

## What's Next

1. **Testing**: Ejecutar `npx expo start` y probar el flujo completo
2. **Backend**: Implementar endpoint `PUT /admin/photos/:id` para toggle highlight
3. **Mejoras opcionales**:
   - Verificar flujo de upload de fotos con Cloudflare R2 real
   - Añadir geolocalización en fotos (usar CoordinatePicker)
   - Añadir fecha/hora de toma de foto
---