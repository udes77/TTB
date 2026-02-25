import React, { createContext, useContext, useEffect, useState } from 'react';
import { sanityService, SanityService, SanitySuburb } from '../services/sanityService';
import { SERVICES, SUBURBS } from '../constants';

interface SanityContextType {
  services: any[];
  suburbs: any[];
  isLoading: boolean;
  isSanityConnected: boolean;
}

const SanityContext = createContext<SanityContextType | undefined>(undefined);

export const SanityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<any[]>(SERVICES);
  const [suburbs, setSuburbs] = useState<any[]>(SUBURBS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSanityConnected, setIsSanityConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
      
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      try {
        const [sanityServices, sanitySuburbs] = await Promise.all([
          sanityService.getServices(),
          sanityService.getSuburbs()
        ]);

        if (sanityServices.length > 0) {
          // Map Sanity services to match local format if needed
          const mappedServices = sanityServices.map(s => ({
            id: s.slug.current,
            title: s.title,
            description: s.description,
            content: s.content,
            iconName: s.iconName
          }));
          setServices(mappedServices);
        }

        if (sanitySuburbs.length > 0) {
          const mappedSuburbs = sanitySuburbs.map(s => ({
            id: s.slug.current,
            name: s.name,
            region: s.region
          }));
          setSuburbs(mappedSuburbs);
        }

        setIsSanityConnected(true);
      } catch (error) {
        console.error('Failed to fetch data from Sanity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SanityContext.Provider value={{ services, suburbs, isLoading, isSanityConnected }}>
      {children}
    </SanityContext.Provider>
  );
};

export const useSanity = () => {
  const context = useContext(SanityContext);
  if (context === undefined) {
    throw new Error('useSanity must be used within a SanityProvider');
  }
  return context;
};
