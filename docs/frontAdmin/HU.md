# Frontend Admin - Épicas y Historias de Usuario

## Stack Tecnológico
- **Framework**: Expo (React Native)
- **Gestión de estado**: Context API + useReducer (Zustand como alternativa)
- **Estilos**: Módulos CSS individuales por componente
- **Navegación**: React Navigation v7 (Drawer + Stack)
- **Mapas**: react-native-maps para selección de coordenadas

---

## ÉPICA 1 - Autenticación

**Objetivo**: Proteger el acceso a la aplicación admin con autenticación JWT.

### HU-1 Login de administrador

**Como** administrador
**Quiero** iniciar sesión con usuario y contraseña
**Para** acceder al panel de administración.

**Flujo**:
1. Pantalla de login con campos: username, password
2. Llamada a `POST /admin/auth/login`
3. Almacenar token JWT en AsyncStorage
4. Redirigir al Dashboard

**Campos**:
- username (required)
- password (required)

**Endpoints**:
```
POST /admin/auth/login
```

**Estados UI**:
- Cargando (spinner)
- Error (mensaje de error)
- Éxito (redirect)

---

### HU-2 Mantener sesión activa

**Como** administrador
**Quiero** mantener mi sesión iniciada
**Para** no tener que login cada vez que abro la app.

**Flujo**:
1. Al iniciar app, verificar token en AsyncStorage
2. Si existe y no ha expirado, cargar Dashboard
3. Si no, mostrar Login

---

### HU-3 Cerrar sesión

**Como** administrador
**Quiero** cerrar mi sesión
**Para** salir de la aplicación de forma segura.

**Flujo**:
1. Botón "Cerrar sesión" en Settings del Drawer
2. Eliminar token de AsyncStorage
3. Redirigir a Login

---

## ÉPICA 2 - Gestión de Etapas (CRUD)

**Objetivo**: Permitir al admin crear, editar, listar y eliminar etapas del viaje.

### HU-4 Listar todas las etapas

**Como** administrador
**Quiero** ver un listado de todas las etapas
**Para** gestionar el contenido del viaje.

**Pantalla**: Lista de etapas con:
- Número de día
- País
- Origen → Destino
- KM
- Estado (borrador/publicada)
- Botón editar
- Botón eliminar

**Endpoints**:
```
GET /admin/stages
```

**Acciones**:
- Pull-to-refresh
- Loading state
- Empty state si no hay etapas

---

### HU-5 Ver detalle de etapa

**Como** administrador
**Quiero** ver toda la información de una etapa
**Para** revisar antes de publicar.

**Pantalla**: Detalle de etapa con:
- Datos básicos (día, país, origen, destino, km, desnivel)
- Tiempo
- Descripción
- Estado (publicada/borrador)
- Lista de segmentos
- Lista de fotos
- Botones de edición

**Endpoints**:
```
GET /admin/stages/:id  // params.id de la ruta
```

---

### HU-6 Crear etapa

**Como** administrador
**Quiero** crear una nueva etapa
**Para** documentar un día del viaje.

**Pantalla**: Formulario con campos:
- Número de día (number, required)
- País (text, required)
- Origen - Nombre (text, required)
- Origen - Latitud (number, required) - **Selector en mapa**
- Origen - Longitud (number, required) - **Selector en mapa**
- Destino - Nombre (text, required)
- Destino - Latitud (number, required) - **Selector en mapa**
- Destino - Longitud (number, required) - **Selector en mapa**
- KM (number, required)
- Desnivel (number, required)
- Tiempo (text, opcional)
- Descripción (textarea, opcional)
- Publicada (toggle, default: false)

**Validaciones**:
- Número de día: unique, > 0
- Coordenadas: valores válidos de lat/lng
- KM: > 0

**Endpoints**:
```
POST /admin/stages
```

---

### HU-7 Editar etapa

**Como** administrador
**Quiero** modificar una etapa existente
**Para** corregir información.

**Pantalla**: Mismo formulario que crear, precargado con datos existentes.

**Endpoints**:
```
PUT /admin/stages/{id}
```

---

### HU-8 Eliminar etapa

**Como** administrador
**Quiero** eliminar una etapa
**Para** corregir errores o borrar contenido.

**Flujo**:
1. Botón eliminar en lista o detalle
2. Confirmation dialog
3. Llamar DELETE
4. Refrescar lista
5. Mostrar toast de éxito/error

**Endpoints**:
```
DELETE /admin/stages/{id}
```

---

### HU-9 Publicar/Despublicar etapa

**Como** administrador
**Quiero** cambiar el estado de publicación de una etapa
**Para** controlarla visibilidad pública.

**Flujo**:
1. Toggle en detalle de etapa
2. Guardar cambio
3. Refrescar datos

**Endpoints**:
```
PUT /admin/stages/{id} (con isPublished)
```

---

## ÉPICA 3 - Gestión de Segmentos (Rutitas)

**Objetivo**: Crear y gestionar los segmentos (rutitas) dentro de cada etapa.

### HU-10 Listar segmentos de una etapa

**Como** administrador
**Quiero** ver los segmentos de una etapa
**Para** gestionarlos.

**Pantalla**: Lista de segmentos dentro del detalle de etapa:
- Nombre inicio → Nombre fin
- KM
- Desnivel
- Número de eventos
- Botón agregar eventos
- Botón editar
- Botón eliminar

**Endpoints**:
```
GET /admin/segments/{id}
```

---

### HU-11 Crear segmento

**Como** administrador
**Quiero** crear un segmento/rutita
**Para** documentar una parte del día.

**Pantalla**: Formulario en modal o pantalla nueva:
- Etapa (seleccionada, no editable)
- Inicio - Nombre (text, required)
- Inicio - Latitud (number, required) - **Selector en mapa**
- Inicio - Longitud (number, required) - **Selector en mapa**
- Fin - Nombre (text, required)
- Fin - Latitud (number, required) - **Selector en mapa**
- Fin - Longitud (number, required) - **Selector en mapa**
- KM (number, required)
- Desnivel (number, required)

**Endpoints**:
```
POST /admin/segments
```

---

### HU-12 Editar segmento

**Como** administrador
**Quiero** modificar un segmento
**Para** corregir datos.

**Endpoints**:
```
PUT /admin/segments/{id}
```

---

### HU-13 Eliminar segmento

**Como** administrador
**Quiero** eliminar un segmento
**Para** corregir errores.

**Endpoints**:
```
DELETE /admin/segments/{id}
```

---

## ÉPICA 4 - Gestión de Eventos

**Objetivo**: Añadir eventos (pinchazos, mecánico, etc.) a los segmentos.

### HU-14 Listar eventos de un segmento

**Como** administrador
**Quiero** ver los eventos de un segmento
**Para** gestionarlos.

**Pantalla**: Lista de eventos dentro del detalle de segmento:
- Tipo de evento (icono + nombre)
- Descripción
- Coordenadas (si aplica)
- Botón eliminar

**Endpoints**:
```
GET /admin/segments/{segmentId}/events
```

---

### HU-15 Crear evento

**Como** administrador
**Quiero** añadir un evento a un segmento
**Para** documentar incidencias o momentos destacados.

**Pantalla**: Formulario:
- Tipo de evento (picker: pinchazo, mecánico, interacción social, comida, paisaje)
- Descripción (textarea, opcional)
- Latitud (number, opcional) - **Selector en mapa**
- Longitud (number, opcional) - **Selector en mapa**

**Endpoints**:
```
POST /admin/segments/{segmentId}/events
```

---

### HU-16 Eliminar evento

**Como** administrador
**Quiero** eliminar un evento
**Para** corregir errores.

**Endpoints**:
```
DELETE /admin/segments/events/{eventId}
```

---

## ÉPICA 5 - Gestión de Fotos

**Objetivo**: Subir y asociar fotos a etapas y segmentos.

### HU-17 Listar fotos

**Como** administrador
**Quiero** ver las fotos de una etapa o segmento
**Para** gestionarlas.

**Pantalla**: Grid de fotos con:
- Thumbnail
- Indicador de highlight (estrella)
- Botón eliminar

**Endpoints**:
```
GET /admin/photos (para todas)
GET /photos/stage/{id} (para etapa)
```

---

### HU-18 Subir foto

**Como** administrador
**Quiero** subir una foto al viaje
**Para** ilustrar etapas o segmentos.

**Flujo completo**:
1. Botón "Subir foto"
2. Abrir selector de imágenes (expo-image-picker)
3. Mostrar preview
4. Llamar `POST /admin/photos/upload-url` para obtener URL de upload
5. Subir imagen a Cloudflare R2 (directamente desde cliente)
6. Llamar `POST /admin/photos` con la URL resultante

**Campos**:
- Archivo de imagen
- Caption (opcional)
- Fecha de toma (opcional)
- Coordenadas (opcional)
- Es destacada (toggle)

**Endpoints**:
```
POST /admin/photos/upload-url
POST /admin/photos
```

**Estados UI**:
- Seleccionar imagen
- Subiendo (progress)
- Éxito/Error

---

### HU-19 Asociar foto a etapa

**Como** administrador
**Quiero** asociar una foto a una etapa
**Para** mostrar fotos generales del día.

**Flujo**:
1. Al crear/editar foto, seleccionar stageId
2. La foto aparece en el detalle de la etapa

**Endpoints**:
```
POST /admin/photos (con stageId)
```

---

### HU-20 Associar foto a segmento

**Como** administrador
**Quiero** asociar una foto a un segmento
**Para** representar eventos concretos.

**Flujo**:
1. Al crear/editar foto, seleccionar segmentId

**Endpoints**:
```
POST /admin/photos (con segmentId)
```

---

### HU-21 Marcar foto como destacada

**Como** administrador
**Quiero** marcar una foto como destacada
**Para** que aparezca en la galería principal.

**Flujo**:
1. Toggle en el detalle de foto
2. Guardar cambio

**Endpoints**:
```
PUT /admin/photos/{id} (con isHighlight)
```

---

### HU-22 Eliminar foto

**Como** administrador
**Quiero** eliminar una foto
**Para** borrar contenido no deseado.

**Endpoints**:
```
DELETE /admin/photos/{id}
```

---

## ÉPICA 6 - Dashboard y Stats

**Objetivo**: Proporcionar una visión general del estado del proyecto.

### HU-23 Ver estadísticas globales

**Como** administrador
**Quiero** ver métricas del proyecto
**Para** entender el progreso.

**Pantalla**: Dashboard con:
- KM totales
- KM financiados (1€ = 1km)
- Desnivel total
- Etapas creadas
- Total donado
- Número de donaciones
- Número de donantes únicos

**Endpoints**:
```
GET /stats
```

---

### HU-24 Ver última etapa publicada

**Como** administrador
**Quiero** ver rápidamente la última etapa
**Para** saber el progreso reciente.

**Pantalla**: Card en Dashboard con:
- Resumen de la última etapa publicada
- Botón para ir al detalle

**Endpoints**:
```
GET /stages/latest
```

---

## Resumen de Endpoints Consumidos

### Autenticación
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| POST | /admin/auth/login | Login |

### Etapas
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET | /admin/stages | Listar todas |
| GET | /admin/stages/{id} | Ver detalle |
| POST | /admin/stages | Crear |
| PUT | /admin/stages/{id} | Editar |
| DELETE | /admin/stages/{id} | Eliminar |

### Segmentos
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET | /admin/segments/{id} | Ver segmento |
| POST | /admin/segments | Crear |
| PUT | /admin/segments/{id} | Editar |
| DELETE | /admin/segments/{id} | Eliminar |

### Eventos
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET | /admin/segments/{id}/events | Listar eventos |
| POST | /admin/segments/{id}/events | Crear evento |
| DELETE | /admin/segments/events/{id} | Eliminar evento |

### Fotos
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| POST | /admin/photos/upload-url | Generar URL upload |
| POST | /admin/photos | Crear foto |
| DELETE | /admin/photos/{id} | Eliminar foto |

### Públicos (lectura)
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET | /stats | Estadísticas globales |
| GET | /stages/latest | Última etapa |

---

## Orden de implementación sugerido

### Sprint 1 - Autenticación
- HU-1, HU-2, HU-3

### Sprint 2 - CRUD Etapas
- HU-4, HU-5, HU-6, HU-7, HU-8, HU-9

### Sprint 3 - Gestión de Segmentos
- HU-10, HU-11, HU-12, HU-13

### Sprint 4 - Gestión de Eventos
- HU-14, HU-15, HU-16

### Sprint 5 - Gestión de Fotos
- HU-17, HU-18, HU-19, HU-20, HU-21, HU-22

### Sprint 6 - Dashboard
- HU-23, HU-24