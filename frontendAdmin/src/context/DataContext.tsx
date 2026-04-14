import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import type { Stats, Stage, DonationFeedItem, MapData, PreviousTrip } from '../types';
import { publicApi } from '../services/api';

interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface DataContextValue {
  stats: DataState<Stats>;
  stages: DataState<Stage[]>;
  donations: DataState<DonationFeedItem[]>;
  mapData: DataState<MapData>;
  previousTrips: DataState<PreviousTrip[]>;
  fetchStats: () => Promise<void>;
  fetchStages: () => Promise<void>;
  fetchDonations: () => Promise<void>;
  fetchMapData: () => Promise<void>;
  fetchPreviousTrips: () => Promise<void>;
  clearErrors: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DataState<Stats>>({
    data: null,
    loading: false,
    error: null,
  });

  const [stages, setStages] = useState<DataState<Stage[]>>({
    data: [],
    loading: false,
    error: null,
  });

  const [donations, setDonations] = useState<DataState<DonationFeedItem[]>>({
    data: [],
    loading: false,
    error: null,
  });

  const [mapData, setMapData] = useState<DataState<MapData>>({
    data: null,
    loading: false,
    error: null,
  });

  const [previousTrips, setPreviousTrips] = useState<DataState<PreviousTrip[]>>({
    data: [],
    loading: false,
    error: null,
  });

  // Use refs to prevent duplicate calls
  const statsFetched = useRef(false);
  const stagesFetched = useRef(false);
  const donationsFetched = useRef(false);
  const mapDataFetched = useRef(false);
  const previousTripsFetched = useRef(false);

  const fetchStats = useCallback(async () => {
    if (statsFetched.current) return;
    statsFetched.current = true;
    
    if (stats.loading) return;
    
    setStats(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await publicApi.getStats();
      setStats({ data, loading: false, error: null });
    } catch (error) {
      statsFetched.current = false;
      setStats({ data: null, loading: false, error: error as Error });
    }
  }, [stats.loading]);

  const fetchStages = useCallback(async () => {
    if (stagesFetched.current) return;
    stagesFetched.current = true;
    
    if (stages.loading) return;
    
    setStages(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await publicApi.getStages();
      setStages({ data, loading: false, error: null });
    } catch (error) {
      stagesFetched.current = false;
      setStages({ data: [], loading: false, error: error as Error });
    }
  }, [stages.loading]);

  const fetchDonations = useCallback(async () => {
    if (donationsFetched.current) return;
    donationsFetched.current = true;
    
    if (donations.loading) return;
    
    setDonations(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await publicApi.getDonationFeed();
      setDonations({ data, loading: false, error: null });
    } catch (error) {
      donationsFetched.current = false;
      setDonations({ data: [], loading: false, error: error as Error });
    }
  }, [donations.loading]);

  const fetchMapData = useCallback(async () => {
    if (mapDataFetched.current) return;
    mapDataFetched.current = true;
    
    if (mapData.loading) return;
    
    setMapData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await publicApi.getMapData();
      setMapData({ data, loading: false, error: null });
    } catch (error) {
      mapDataFetched.current = false;
      setMapData({ data: null, loading: false, error: error as Error });
    }
  }, [mapData.loading]);

  const fetchPreviousTrips = useCallback(async () => {
    if (previousTripsFetched.current) return;
    previousTripsFetched.current = true;
    
    if (previousTrips.loading) return;
    
    setPreviousTrips(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await publicApi.getPreviousTrips();
      setPreviousTrips({ data, loading: false, error: null });
    } catch (error) {
      previousTripsFetched.current = false;
      setPreviousTrips({ data: [], loading: false, error: error as Error });
    }
  }, [previousTrips.loading]);

  const clearErrors = useCallback(() => {
    setStats(prev => ({ ...prev, error: null }));
    setStages(prev => ({ ...prev, error: null }));
    setDonations(prev => ({ ...prev, error: null }));
    setMapData(prev => ({ ...prev, error: null }));
    setPreviousTrips(prev => ({ ...prev, error: null }));
  }, []);

  const value: DataContextValue = {
    stats,
    stages,
    donations,
    mapData,
    previousTrips,
    fetchStats,
    fetchStages,
    fetchDonations,
    fetchMapData,
    fetchPreviousTrips,
    clearErrors,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}

export default DataContext;