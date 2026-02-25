import React, { createContext, useContext, useEffect, useState } from 'react';
import { sanityService, SanityService, SanitySuburb } from '../services/sanityService';
import { SERVICES, SUBURBS } from '../constants';

interface SanityContextType {
  services: any[];
  suburbs: any[];
  isLoading: boolean;
  isSanityConnected: boolean;
  connectionError: string | null;
}

const SanityContext = createContext<SanityContextType | undefined>(undefined);

export const SanityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<any[]>(SERVICES);
  const [suburbs, setSuburbs] = useState<any[]>(SUBURBS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSanityConnected, setIsSanityConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

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
          const mappedServices = sanityServices.map(s => ({
            id: s.slug?.current || s._id,
            title: s.title,
            description: s.description,
            content: s.content,
            iconName: s.iconName
          }));
          setServices(mappedServices);
        }

        if (sanitySuburbs.length > 0) {
          const mappedSuburbs = sanitySuburbs.map(s => ({
            id: s.slug?.current || s._id,
            name: s.name,
            region: s.region
          }));
          setSuburbs(mappedSuburbs);
        }

        setIsSanityConnected(true);
        setConnectionError(null);
      } catch (error: any) {
        console.error('Failed to fetch data from Sanity:', error);
        
        let friendlyError = error.message || 'Unknown connection error';
        
        // Detect CORS or Network errors (usually TypeError: Failed to fetch)
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          friendlyError = 'CORS or Network Error: Please ensure this URL is added to Sanity CORS origins and your Project ID is correct.';
        } else if (error.message?.includes('projectId')) {
          friendlyError = 'Invalid Project ID: Please check your VITE_SANITY_PROJECT_ID environment variable.';
        }
        
        setConnectionError(friendlyError);
        setIsSanityConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SanityContext.Provider value={{ services, suburbs, isLoading, isSanityConnected, connectionError }}>
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
