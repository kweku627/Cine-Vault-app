import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TrailerContent } from '@/types/content';

interface WatchLaterContextType {
  watchLaterList: TrailerContent[];
  addToWatchLater: (trailer: TrailerContent) => void;
  removeFromWatchLater: (trailerId: string) => void;
  isInWatchLater: (id: string) => boolean;
}

const WatchLaterContext = createContext<WatchLaterContextType | undefined>(undefined);

export const WatchLaterProvider = ({ children }: { children: ReactNode }) => {
  const [watchLaterList, setWatchLaterList] = useState<TrailerContent[]>([]);

  const addToWatchLater = (trailer: TrailerContent) => {
    setWatchLaterList((prev) => {
      if (!prev.some((item) => item.id === trailer.id)) {
        return [...prev, { ...trailer, isSaved: true }];
      }
      return prev;
    });
  };

  const removeFromWatchLater = (trailerId: string) => {
    setWatchLaterList((prev) => prev.filter((item) => item.id !== trailerId));
  };

  const isInWatchLater = (id: string) => watchLaterList.some(item => item.id === id);

  return (
    <WatchLaterContext.Provider value={{ watchLaterList, addToWatchLater, removeFromWatchLater, isInWatchLater }}>
      {children}
    </WatchLaterContext.Provider>
  );
};

export const useWatchLater = () => {
  const context = useContext(WatchLaterContext);
  if (!context) {
    throw new Error('useWatchLater must be used within a WatchLaterProvider');
  }
  return context;
};