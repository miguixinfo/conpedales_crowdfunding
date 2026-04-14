# ConPedales 🚴‍♂️

¡Bienvenido al repositorio de **ConPedales**! Este proyecto es una plataforma de crowdfunding y seguimiento en tiempo real para el viaje en bicicleta desde **Toledo hasta Atenas**.

La plataforma permite a los usuarios seguir el progreso del viaje, ver el diario de ruta, interactuar con el mapa interactivo y realizar donaciones a través de Stripe. También incluye potentes herramientas de administración tanto en web como en dispositivos móviles.

---

## 🏗️ Estructura del Proyecto

El proyecto está organizado como un monorepositorio que contiene los siguientes componentes:

| Directorio | Componente | Descripción |
|------------|------------|-------------|
| [`/back`](./back) | **Backend** | API REST desarrollada con Spring Boot. |
| [`/frontendAdmin`](./frontendAdmin) | **Web App** | Aplicación web principal (Public + Admin) desarrollada con React y Vite. |
| [`/appAdmin`](./appAdmin) | **Mobile App** | Aplicación móvil administrativa desarrollada con React Native y Expo. |
| [`/deploy`](./deploy) | **Configuración** | Archivos relacionados con el despliegue y Docker. |
| [`/docs`](./docs) | **Documentación** | Recursos adicionales y documentación del proyecto. |

---

## 🚀 Tecnologías Utilizadas

### Backend ☕
- **Lenguaje:** Java 21.
- **Framework:** Spring Boot 3.5.x
- **Seguridad:** Spring Security + JWT (JSON Web Tokens).
- **Base de Datos:** PostgreSQL.
- **Persistencia:** Spring Data JPA + Hibernate.
- **Integraciones:** 
  - **Stripe:** Gestión de pagos y webhooks.
  - **Cloudflare R2 (S3 API):** Almacenamiento de imágenes y archivos.
- **Otros:** Lombok, Validation, Maven.

### Web Frontend 💻
- **Framework:** React 19 + Vite.
- **Estilos:** Tailwind CSS.
- **Animaciones:** Framer Motion.
- **Mapas:** Leaflet + React Leaflet.
- **Navegación:** React Router 7.
- **Comunicación:** Axios.

### Mobile App 📱
- **Framework:** React Native + Expo.
- **Estado:** Zustand.
- **Navegación:** React Navigation.
- **Funcionalidades:** Mapas, acceso al sistema de archivos, sensores.

---

## 🛠️ Instalación y Arranque

### Pre-requisitos
- Docker y Docker Compose.
- JDK 21.
- Node.js (v18+ recomendado).
- Cuenta de Stripe (opcional para desarrollo local).

### Configuración de Entorno
1. Copia el archivo `.env.example` a `.env` en la raíz del proyecto.
2. Completa las variables de entorno necesarias (claves de API de Stripe, base de datos, etc.).

### 1. Levantar la Infraestructura (Base de Datos)
Desde la raíz del proyecto:
```bash
docker-compose up -d postgres
```

### 2. Arrancar el Backend
```bash
cd back
./mvnw spring-boot:run
```
El backend estará disponible en `http://localhost:8081`.

### 3. Arrancar la Web App
```bash
cd frontendAdmin
npm install
npm run dev
```
La web estará disponible en `http://localhost:5173`.

### 4. Arrancar la App Móvil
```bash
cd appAdmin
npm install
npx expo start
```

---

## 🐳 Despliegue con Docker
El proyecto incluye un `docker-compose.yml` para levantar todo el stack tecnológico de forma simplificada:

```bash
docker-compose up --build
```

---

## 📸 Funcionalidades Principales
- **Crowdfunding:** Integración completa con Stripe para donaciones seguras.
- **Diario de Ruta:** Gestión de etapas con fotos y relatos del viaje.
- **Mapa Interactivo:** Seguimiento en tiempo real de la ubicación y waypoints del viaje.
- **Panel Admin:** Gestión total de donaciones, etapas, rutas y configuración desde web o móvil.
- **Seguridad:** Sistema de autenticación robusto para el área administrativa.

---

## 📄 Licencia
Este proyecto se distribuye bajo la licencia ISC.

---

Desarrollado con ❤️ para el viaje Toledo-Atenas. 🚲✨
