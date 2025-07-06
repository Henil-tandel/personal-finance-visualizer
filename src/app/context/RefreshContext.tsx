'use client';

import { createContext, useContext, useState } from 'react';

interface RefreshContextType {
  refreshFlag: boolean;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <RefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) throw new Error('useRefresh must be used inside RefreshProvider');
  return context;
};
