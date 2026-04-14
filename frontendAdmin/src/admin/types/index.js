export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    type: string;
    email: string;
    role: string;
    expiresIn: number;
  };
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Donation {
  id: number;
  nombre: string;
  monto: number;
  comentario: string | null;
  email: string | null;
  telefono: string | null;
  fecha: string;
  contactoRequerido: boolean;
  kmFinanciados: number;
}

export interface Stage {
  id: number;
  numero: number;
  titulo: string;
  fecha: string | null;
  km: number;
  desnivel: number | null;
  tiempo: string | null;
  resumen: string | null;
  enCurso: boolean;
  completada: boolean;
}

export interface StageRequest {
  numero: number;
  titulo: string;
  fecha: string | null;
  km: number;
  desnivel: number | null;
  tiempo: string | null;
  resumen: string | null;
  enCurso: boolean;
  completada: boolean;
}

export interface Waypoint {
  id: number;
  latitud: number;
  longitud: number;
  nombre: string;
  pais: string;
  orden: number;
  kmAcumulado: number;
  estado: 'PENDIENTE' | 'ACTUAL' | 'COMPLETADO';
}

export interface WaypointRequest {
  latitud: number;
  longitud: number;
  nombre: string;
  pais: string;
  orden: number;
  kmAcumulado: number;
  estado: 'PENDIENTE' | 'ACTUAL' | 'COMPLETADO';
}

export interface Trip {
  id: number;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  fechaInicio: string | null;
  diasEstimados: number | null;
  kmTotal: number;
  kmRecorridos: number;
  activo: boolean;
}

export interface TripRequest {
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  fechaInicio: string | null;
  diasEstimados: number | null;
  kmTotal: number;
  kmRecorridos: number;
  activo: boolean;
}

export interface PreviousTrip {
  id: number;
  titulo: string;
  anio: number;
  distancia: number;
  descripcion: string | null;
  icono: string | null;
  imagen: string | null;
}

export interface PreviousTripRequest {
  titulo: string;
  anio: number;
  distancia: number;
  descripcion: string | null;
  icono: string | null;
  imagen: string | null;
}

export interface Setting {
  id: number;
  clave: string;
  valor: string;
  descripcion: string | null;
  editable: boolean;
}

export interface SettingRequest {
  valor: string;
  descripcion?: string;
}

export interface MetricsUpdate {
  diasViaje?: string;
  desnivel?: string;
  paises?: string;
}

export interface DashboardStats {
  totalDonado: number;
  totalDonaciones: number;
  kmRecorridos: number;
  kmMeta: number;
  etapasCompletadas: number;
  totalEtapas: number;
  paisesVisitados: number;
  diasTranscurridos: number;
}
