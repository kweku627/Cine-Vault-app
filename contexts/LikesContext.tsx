import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikeItem {
  id: string;
  type: 'movie' | 'series';
  isLiked: boolean;
  likesCount: number;
}

interface LikesContextType {
  likedItems: LikeItem[];
  toggleLike: (id: string, type: 'movie' | 'series') => void;
  isLiked: (id: string) => boolean;
  getLikesCount: (id: string) => number;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export const LikesProvider = ({ children }: { children: ReactNode }) => {
  const [likedItems, setLikedItems] = useState<LikeItem[]>([]);

  const toggleLike = (id: string, type: 'movie' | 'series') => {
    setLikedItems((prev) => {
      const existingItem = prev.find(item => item.id === id);
      
      if (existingItem) {
        // Toggle existing like
        return prev.map(item => 
          item.id === id 
            ? { ...item, isLiked: !item.isLiked, likesCount: item.isLiked ? item.likesCount - 1 : item.likesCount + 1 }
            : item
        );
      } else {
        // Add new like
        return [...prev, { id, type, isLiked: true, likesCount: 1 }];
      }
    });
  };

  const isLiked = (id: string) => {
    const item = likedItems.find(item => item.id === id);
    return item?.isLiked || false;
  };

  const getLikesCount = (id: string) => {
    const item = likedItems.find(item => item.id === id);
    return item?.likesCount || 0;
  };

  return (
    <LikesContext.Provider value={{ likedItems, toggleLike, isLiked, getLikesCount }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
}; 