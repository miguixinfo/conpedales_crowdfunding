import type { Stage, Stats, DonationFeedItem, Photo, MapData } from '../types';
import { DONATION_CONFIG, TRIP_INFO } from '../config/constants';
import { countCountries, calculateDaysSinceStart } from '../utils/calculations';
import { formatDate } from '../utils/formatters';

// ============================================
// STAGE - Adaptadores para componentes
// ============================================

export interface StageCardProps {
  id: number;
  number: number;
  title: string;
  distance: number;
  elevation: number;
  summary: string | null;
  date: string;
  current: boolean;
}

export function adaptStageForCard(stage: Stage, isLatest: boolean = false): StageCardProps {
  return {
    id: stage.id,
    number: stage.dayNumber,
    title: `${stage.startName} → ${stage.endName}`,
    distance: stage.km,
    elevation: stage.elevationGain,
    summary: stage.description,
    date: formatDate(stage.createdAt),
    current: isLatest && stage.isPublished,
  };
}

export function adaptStagesForCards(stages: Stage[]): StageCardProps[] {
  const published = stages.filter(s => s.isPublished);
  const sortedByDay = [...published].sort((a, b) => b.dayNumber - a.dayNumber);
  
  if (sortedByDay.length === 0) return [];
  
  const latestDayNumber = sortedByDay[0].dayNumber;
  
  return sortedByDay.map(stage => 
    adaptStageForCard(stage, stage.dayNumber === latestDayNumber)
  );
}

// ============================================
// STATS - Adaptadores para métricas
// ============================================

export interface MetricsProps {
  totalKm: number;
  totalElevation: number;
  totalStages: number;
  totalDonations: number;
  daysOnRoad: number;
  countriesVisited: number;
}

export function adaptStatsForMetrics(stats: Stats | null, stages: Stage[]): MetricsProps {
  return {
    totalKm: stats?.totalKm ?? 0,
    totalElevation: stats?.totalElevation ?? 0,
    totalStages: stats?.totalStages ?? 0,
    totalDonations: stats?.totalDonations ?? 0,
    daysOnRoad: calculateDaysSinceStart(),
    countriesVisited: countCountries(stages),
  };
}

// ============================================
// DONATION - Adaptadores para feed
// ============================================

export interface DonationCardProps {
  name: string;
  amount: number;
  comment: string | null;
  date: string;
}

export function adaptDonationForCard(donation: DonationFeedItem): DonationCardProps {
  return {
    name: donation.name || 'Anónimo',
    amount: donation.amount,
    comment: donation.comment,
    date: formatDate(donation.date),
  };
}

export function adaptDonationsForCards(donations: DonationFeedItem[]): DonationCardProps[] {
  return donations.map(adaptDonationForCard);
}

// ============================================
// PROGRESS - Adaptadores para barra de progreso
// ============================================

export interface ProgressProps {
  fundedKm: number;
  goalKm: number;
  percentage: number;
  totalDonations: number;
}

export function adaptProgress(stats: Stats | null, goalKm: number = TRIP_INFO.totalKmGoal): ProgressProps {
  const fundedKm = stats?.totalFunded ? Math.floor(stats.totalFunded / DONATION_CONFIG.pricePerKm) : 0;
  const percentage = goalKm > 0 ? Math.min(100, Math.round((fundedKm / goalKm) * 100)) : 0;
  
  return {
    fundedKm,
    goalKm,
    percentage,
    totalDonations: stats?.totalDonations ?? 0,
  };
}

// ============================================
// MAP - Adaptadores para mapa
// ============================================

export interface MapRoutePoint {
  lat: number;
  lng: number;
  name: string;
  country: string;
  stage?: string;
  km?: number;
  status: 'completed' | 'current' | 'pending';
}

export function adaptStagesForMap(stages: Stage[]): MapRoutePoint[] {
  const published = stages.filter(s => s.isPublished);
  const sortedByDay = [...published].sort((a, b) => a.dayNumber - b.dayNumber);
  
  const points: MapRoutePoint[] = [];
  let accumulatedKm = 0;
  
  sortedByDay.forEach((stage, index) => {
    accumulatedKm += stage.km;
    
    points.push({
      lat: stage.startLat,
      lng: stage.startLng,
      name: stage.startName,
      country: stage.country,
      stage: `Stage ${stage.dayNumber}`,
      km: accumulatedKm - stage.km,
      status: 'completed',
    });
    
    if (index === sortedByDay.length - 1) {
      points.push({
        lat: stage.endLat,
        lng: stage.endLng,
        name: stage.endName,
        country: stage.country,
        stage: `Stage ${stage.dayNumber}`,
        km: accumulatedKm,
        status: 'completed',
      });
    }
  });
  
  return points;
}

// ============================================
// PHOTO - Adaptadores para galería
// ============================================

export interface PhotoCardProps {
  id: number;
  url: string;
  caption: string | null;
  takenAt: string | null;
  stageName: string | null;
  isHighlight: boolean;
}

export function adaptPhotoForCard(photo: Photo, stages: Stage[]): PhotoCardProps {
  const stage = stages.find(s => s.id === photo.stageId);
  const stageName = stage ? `${stage.startName} → ${stage.endName}` : null;
  
  return {
    id: photo.id,
    url: photo.url,
    caption: photo.caption,
    takenAt: photo.takenAt ? formatDate(photo.takenAt) : null,
    stageName,
    isHighlight: photo.isHighlight,
  };
}

export function adaptPhotosForCards(photos: Photo[], stages: Stage[]): PhotoCardProps[] {
  return photos.map(photo => adaptPhotoForCard(photo, stages));
}

// ============================================
// MAP DATA - Adaptadores para mapa completo
// ============================================

export interface MapMarker {
  id: number;
  type: 'stage-start' | 'stage-end' | 'photo' | 'event';
  lat: number;
  lng: number;
  name: string;
  description?: string;
  icon?: string;
}

export function adaptMapDataForMarkers(mapData: MapData): MapMarker[] {
  const markers: MapMarker[] = [];
  
  // Stages markers
  mapData.stages?.forEach(stage => {
    markers.push({
      id: stage.id,
      type: 'stage-start',
      lat: stage.startLat,
      lng: stage.startLng,
      name: stage.startName,
    });
    markers.push({
      id: stage.id,
      type: 'stage-end',
      lat: stage.endLat,
      lng: stage.endLng,
      name: stage.endName,
    });
  });
  
  // Photos markers
  mapData.photos?.forEach(photo => {
    if (photo.latitude && photo.longitude) {
      markers.push({
        id: photo.id,
        type: 'photo',
        lat: photo.latitude,
        lng: photo.longitude,
        name: photo.caption || 'Foto',
        description: photo.caption || undefined,
      });
    }
  });
  
  // Events markers
  mapData.events?.forEach(event => {
    if (event.latitude && event.longitude) {
      markers.push({
        id: event.id,
        type: 'event',
        lat: event.latitude,
        lng: event.longitude,
        name: event.type,
        description: event.description || undefined,
      });
    }
  });
  
  return markers;
}