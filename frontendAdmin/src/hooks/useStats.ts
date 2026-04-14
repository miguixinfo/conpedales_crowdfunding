import { useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import { DONATION_CONFIG } from '../config/constants';
import type { Stats } from '../types';

export function useStats() {
  const { stats, fetchStats } = useDataContext();

  useEffect(() => {
    if (!stats.data && !stats.loading) {
      fetchStats();
    }
  }, [stats.data, stats.loading, fetchStats]);

  return {
    stats: stats.data,
    loading: stats.loading,
    error: stats.error,
    refetch: fetchStats,
  };
}

export function useKmProgress() {
  const { stats, fetchStats } = useDataContext();

  useEffect(() => {
    if (!stats.data && !stats.loading) {
      fetchStats();
    }
  }, [stats.data, stats.loading, fetchStats]);

  const totalFunded = stats.data?.totalFunded ?? 0;
  const kmFinanced = Math.floor(totalFunded / DONATION_CONFIG.pricePerKm);

  return {
    totalFunded,
    kmFinanced,
    totalDonations: stats.data?.totalDonations ?? 0,
    totalDonors: stats.data?.totalDonors ?? 0,
    loading: stats.loading,
    error: stats.error,
    refetch: fetchStats,
  };
}

export default useStats;