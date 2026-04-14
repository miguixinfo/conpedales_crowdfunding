import { useEffect, useMemo } from 'react';
import { useDataContext } from '../context/DataContext';
import type { Stage } from '../types';

export function useStages() {
  const { stages, fetchStages } = useDataContext();

  useEffect(() => {
    if (stages.data.length === 0 && !stages.loading) {
      fetchStages();
    }
  }, [stages.data, stages.loading, fetchStages]);

  return {
    stages: stages.data,
    loading: stages.loading,
    error: stages.error,
    refetch: fetchStages,
  };
}

export function useLatestStages(limit: number = 3) {
  const { stages, fetchStages } = useDataContext();

  useEffect(() => {
    if (stages.data.length === 0 && !stages.loading) {
      fetchStages();
    }
  }, [stages.data, stages.loading, fetchStages]);

  const latestStages = useMemo(() => {
    if (!stages.data || stages.data.length === 0) return [];
    return [...stages.data]
      .sort((a, b) => b.dayNumber - a.dayNumber)
      .slice(0, limit);
  }, [stages.data, limit]);

  return {
    stages: latestStages,
    loading: stages.loading,
    error: stages.error,
    refetch: fetchStages,
  };
}

export function useCurrentStage() {
  const { stages, fetchStages } = useDataContext();

  useEffect(() => {
    if (stages.data.length === 0 && !stages.loading) {
      fetchStages();
    }
  }, [stages.data, stages.loading, fetchStages]);

  const currentStage = useMemo(() => {
    if (!stages.data || stages.data.length === 0) return null;
    const published = stages.data.filter(s => s.isPublished);
    if (published.length === 0) return null;
    return published[published.length - 1];
  }, [stages.data]);

  return {
    stage: currentStage,
    loading: stages.loading,
    error: stages.error,
    refetch: fetchStages,
  };
}

export function useStageById(id: number | null) {
  const { stages, fetchStages } = useDataContext();

  useEffect(() => {
    if (stages.data.length === 0 && !stages.loading) {
      fetchStages();
    }
  }, [stages.data, stages.loading, fetchStages]);

  const stage = useMemo(() => {
    if (!id || !stages.data) return null;
    return stages.data.find(s => s.id === id) ?? null;
  }, [stages.data, id]);

  return {
    stage,
    loading: stages.loading,
    error: stages.error,
    refetch: fetchStages,
  };
}

export default useStages;