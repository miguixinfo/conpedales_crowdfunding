import { useEffect } from 'react';
import { useDataContext } from '../context/DataContext';
import type { DonationFeedItem } from '../types';

export function useDonations() {
  const { donations, fetchDonations } = useDataContext();

  useEffect(() => {
    if (donations.data.length === 0 && !donations.loading) {
      fetchDonations();
    }
  }, [donations.data, donations.loading, fetchDonations]);

  return {
    donations: donations.data,
    loading: donations.loading,
    error: donations.error,
    refetch: fetchDonations,
  };
}

export function useDonationFeed(limit: number = 10) {
  const { donations, fetchDonations } = useDataContext();

  useEffect(() => {
    if (donations.data.length === 0 && !donations.loading) {
      fetchDonations();
    }
  }, [donations.data, donations.loading, fetchDonations]);

  const feed = donations.data.slice(0, limit);

  return {
    donations: feed,
    total: donations.data.length,
    loading: donations.loading,
    error: donations.error,
    refetch: fetchDonations,
  };
}

export default useDonations;