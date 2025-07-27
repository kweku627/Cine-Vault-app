import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RatingItem {
  id: string;
  type: 'movie' | 'series';
  userRating: number;
  averageRating: number;
  totalRatings: number;
}

interface RatingsContextType {
  ratedItems: RatingItem[];
  setRating: (id: string, type: 'movie' | 'series', rating: number) => void;
  getUserRating: (id: string) => number;
  getAverageRating: (id: string) => number;
  getTotalRatings: (id: string) => number;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

export const RatingsProvider = ({ children }: { children: ReactNode }) => {
  const [ratedItems, setRatedItems] = useState<RatingItem[]>([]);

  const setRating = (id: string, type: 'movie' | 'series', rating: number) => {
    setRatedItems((prev) => {
      const existingItem = prev.find(item => item.id === id);
      
      if (existingItem) {
        // Update existing rating
        const newTotalRatings = existingItem.totalRatings + 1;
        const newAverageRating = ((existingItem.averageRating * existingItem.totalRatings) + rating) / newTotalRatings;
        
        return prev.map(item => 
          item.id === id 
            ? { ...item, userRating: rating, averageRating: newAverageRating, totalRatings: newTotalRatings }
            : item
        );
      } else {
        // Add new rating
        return [...prev, { id, type, userRating: rating, averageRating: rating, totalRatings: 1 }];
      }
    });
  };

  const getUserRating = (id: string) => {
    const item = ratedItems.find(item => item.id === id);
    return item?.userRating || 0;
  };

  const getAverageRating = (id: string) => {
    const item = ratedItems.find(item => item.id === id);
    return item?.averageRating || 0;
  };

  const getTotalRatings = (id: string) => {
    const item = ratedItems.find(item => item.id === id);
    return item?.totalRatings || 0;
  };

  return (
    <RatingsContext.Provider value={{ ratedItems, setRating, getUserRating, getAverageRating, getTotalRatings }}>
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = () => {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
}; 