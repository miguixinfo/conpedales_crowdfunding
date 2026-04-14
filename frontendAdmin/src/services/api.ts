import axios from 'axios';
import type {
  Stage,
  Stats,
  DonationFeedItem,
  CreateCheckoutDTO,
  CheckoutResponse,
  MapData,
  Photo,
  PreviousTrip,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// PUBLIC API - Endpoints públicos
// ============================================
export const publicApi = {
  // Stages
  getStages: () => 
    api.get<Stage[]>('/stages').then(res => res.data),
  
  getStageById: (id: number) => 
    api.get<Stage>(`/stages/${id}`).then(res => res.data),
  
  getLatestStage: () => 
    api.get<Stage>('/stages/latest').then(res => res.data),

  // Stats
  getStats: () => 
    api.get<Stats>('/stats').then(res => res.data),

  // Donations
  getDonationFeed: () => 
    api.get<DonationFeedItem[]>('/donations/feed').then(res => res.data),
  
  createCheckout: (data: CreateCheckoutDTO) => 
    api.post<CheckoutResponse>('/donations/checkout', data).then(res => res.data),

  // Map
  getMapData: () => 
    api.get<MapData>('/map').then(res => res.data),

  // Photos
  getPhotos: () => 
    api.get<Photo[]>('/photos').then(res => res.data),
  
  getPhotosByStage: (stageId: number) => 
    api.get<Photo[]>(`/photos/stage/${stageId}`).then(res => res.data),
  
  getHighlightPhotos: () => 
    api.get<Photo[]>('/photos/highlight').then(res => res.data),

  getPreviousTrips: () => 
    api.get<PreviousTrip[]>('/previous-trips').then(res => res.data),
};

export default api;