import { useEffect, useMemo } from 'react';
import { useDataContext } from '../context/DataContext';
import type { MapData, StageMap } from '../types';
import { COUNTRY_COLORS } from '../config/constants';

export function useMap() {
  const { mapData, fetchMapData } = useDataContext();

  useEffect(() => {
    if (!mapData.data && !mapData.loading) {
      fetchMapData();
    }
  }, [mapData.data, mapData.loading, fetchMapData]);

  return {
    mapData: mapData.data,
    loading: mapData.loading,
    error: mapData.error,
    refetch: fetchMapData,
  };
}

export interface MapPoint {
  lat: number;
  lng: number;
  name: string;
  country: string;
  km?: number;
  isStart?: boolean;
  isEnd?: boolean;
}

export function useMapPoints() {
  const { mapData, fetchMapData } = useDataContext();

  useEffect(() => {
    if (!mapData.data && !mapData.loading) {
      fetchMapData();
    }
  }, [mapData.data, mapData.loading, fetchMapData]);

  const points: MapPoint[] = useMemo(() => {
    if (!mapData.data?.stages) return [];
    
    const allPoints: MapPoint[] = [];
    let accumulatedKm = 0;
    
    mapData.data.stages.forEach((stage: StageMap, index: number) => {
      const isFirst = index === 0;
      const isLast = index === mapData.data!.stages.length - 1;
      
      accumulatedKm += stage.km || 0;
      
      allPoints.push({
        lat: stage.startLat,
        lng: stage.startLng,
        name: stage.startName || `Stage ${stage.dayNumber} Start`,
        country: stage.country,
        km: accumulatedKm,
        isStart: true,
        isEnd: false,
      });
      
      if (isLast) {
        allPoints.push({
          lat: stage.endLat,
          lng: stage.endLng,
          name: stage.endName || `Stage ${stage.dayNumber} End`,
          country: stage.country,
          km: accumulatedKm,
          isStart: false,
          isEnd: true,
        });
      }
    });
    
    return allPoints;
  }, [mapData.data]);

  const countries = useMemo(() => {
    if (!mapData.data?.stages) return [];
    return [...new Set(mapData.data.stages.map((s: StageMap) => s.country))];
  }, [mapData.data]);

  const getCountryColor = (country: string): string => {
    return COUNTRY_COLORS[country] || '#666';
  };

  return {
    points,
    countries,
    mapData: mapData.data,
    loading: mapData.loading,
    error: mapData.error,
    getCountryColor,
    refetch: fetchMapData,
  };
}

export default useMap;