import { useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import type { Photo } from '../types';

export function usePhotos() {
  const { mapData, fetchMapData } = useDataContext();

  useEffect(() => {
    if (!mapData.data && !mapData.loading) {
      fetchMapData();
    }
  }, [mapData.data, mapData.loading, fetchMapData]);

  const photos: Photo[] = mapData.data?.photos ?? [];

  return {
    photos,
    loading: mapData.loading,
    error: mapData.error,
    refetch: fetchMapData,
  };
}

export function useHighlightPhotos() {
  const { mapData, fetchMapData } = useDataContext();

  useEffect(() => {
    if (!mapData.data && !mapData.loading) {
      fetchMapData();
    }
  }, [mapData.data, mapData.loading, fetchMapData]);

  const highlights: Photo[] = (mapData.data?.photos ?? [])
    .filter(p => p.isHighlight);

  return {
    photos: highlights,
    loading: mapData.loading,
    error: mapData.error,
    refetch: fetchMapData,
  };
}

export default usePhotos;