// ============================================
// STAGE - Etapas del viaje
// ============================================
export interface Stage {
  id: number;
  dayNumber: number;
  country: string;
  startName: string;
  startLat: number;
  startLng: number;
  endName: string;
  endLat: number;
  endLng: number;
  km: number;
  elevationGain: number;
  movingTime: string | null;
  description: string | null;
  isPublished: boolean;
  createdAt: string;
  segments?: RouteSegment[];
  photos?: Photo[];
}

export interface RouteSegment {
  id: number;
  stageId: number;
  startName: string;
  startLat: number;
  startLng: number;
  endName: string;
  endLat: number;
  endLng: number;
  km: number;
  elevationGain: number;
  createdAt: string;
  events?: RouteSegmentEvent[];
  photos?: Photo[];
}

export interface RouteSegmentEvent {
  id: number;
  segmentId: number;
  type: 'PUNCTURE' | 'MECHANICAL' | 'SOCIAL' | 'FOOD' | 'VIEWPOINT' | 'WEATHER' | 'OTHER';
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface Photo {
  id: number;
  stageId: number | null;
  segmentId: number | null;
  url: string;
  caption: string | null;
  takenAt: string;
  latitude: number | null;
  longitude: number | null;
  isHighlight: boolean;
  createdAt: string;
}

// ============================================
// STATS - Estadísticas globales
// ============================================
export interface Stats {
  totalKm: number;
  totalElevation: number;
  totalStages: number;
  totalDonations: number;
  totalFunded: number;
  totalDonors: number;
}

// ============================================
// DONATIONS - Donaciones
// ============================================
export interface DonationFeedItem {
  name: string;
  amount: number;
  comment: string | null;
  date: string;
}

export interface CreateCheckoutDTO {
  amount: number;
  name?: string;
  email?: string;
  comment?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
}

// ============================================
// MAP - Datos del mapa
// ============================================
export interface MapData {
  stages: StageMap[];
  segments: SegmentMap[];
  photos: PhotoMap[];
  events: EventMap[];
}

export interface StageMap {
  id: number;
  dayNumber: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  country: string;
}

export interface SegmentMap {
  id: number;
  stageId: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

export interface PhotoMap {
  id: number;
  url: string;
  latitude: number;
  longitude: number;
}

export interface EventMap {
  id: number;
  type: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
}

// ============================================
// PREVIOUS TRIP - Viajes anteriores
// ============================================
export interface PreviousTrip {
  id: number;
  titulo: string;
  anio: number;
  distancia: number;
  descripcion: string | null;
  icono: string | null;
  imagen: string | null;
}

// ============================================
// API RESPONSE - Respuesta genérica
// ============================================
export interface ApiResponse<T> {
  data: T;
  message?: string;
}