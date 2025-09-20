"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LogoKey } from '@/components/PigLogos';

interface LogoContextType {
  selectedLogo: LogoKey;
  setSelectedLogo: (logo: LogoKey) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLogo, setSelectedLogo] = useState<LogoKey>('logo1'); // Logo por defecto

  return (
    <LogoContext.Provider value={{ selectedLogo, setSelectedLogo }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};