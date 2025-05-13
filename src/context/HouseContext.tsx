import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { House } from '../lib/types';
import { getFeaturedHouse, getHouseBySlug } from '../lib/houseService';

interface HouseContextType {
  house: House | null;
  loading: boolean;
  error: Error | null;
  refetchHouse: () => Promise<void>;
  fetchHouseBySlug: (slug: string) => Promise<void>;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export function HouseProvider({ children }: { children: React.ReactNode }) {
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeaturedHouse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const featuredHouseData = await getFeaturedHouse();
      setHouse(featuredHouseData);
    } catch (err) {
      console.error('Error fetching featured house data:', err);
      setError(err as Error);
      setHouse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHouseBySlugHandler = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      setHouse(null);
      const houseData = await getHouseBySlug(slug);
      setHouse(houseData);
      if (!houseData) {
        console.warn(`House with slug "${slug}" not found, context updated to null.`);
      }
    } catch (err) {
      console.error(`Error fetching house data for slug ${slug}:`, err);
      setError(err as Error);
      setHouse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    house,
    loading,
    error,
    refetchHouse: fetchFeaturedHouse,
    fetchHouseBySlug: fetchHouseBySlugHandler
  };

  return (
    <HouseContext.Provider value={value}>
      {children}
    </HouseContext.Provider>
  );
}

export function useHouse() {
  const context = useContext(HouseContext);
  if (context === undefined) {
    throw new Error('useHouse must be used within a HouseProvider');
  }
  return context;
} 