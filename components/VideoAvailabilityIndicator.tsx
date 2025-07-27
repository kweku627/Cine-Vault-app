import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { VideoScraperService } from '@/services/VideoScraperService';

interface VideoAvailabilityIndicatorProps {
  movieId: string;
  size?: number;
}

export default function VideoAvailabilityIndicator({ 
  movieId, 
  size = 16 
}: VideoAvailabilityIndicatorProps) {
  const { theme } = useTheme();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, [movieId]);

  const checkAvailability = async () => {
    if (!movieId) return;
    
    try {
      setIsChecking(true);
      const available = await VideoScraperService.checkVideoAvailability(movieId);
      setIsAvailable(available);
    } catch (error) {
      console.error('Error checking video availability:', error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Ionicons 
          name="ellipse" 
          size={size} 
          color={theme.colors.textMuted} 
        />
      </View>
    );
  }

  if (isAvailable === null) {
    return null;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons 
        name={isAvailable ? "play-circle" : "play-circle-outline"} 
        size={size} 
        color={isAvailable ? theme.colors.primary : theme.colors.textMuted} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 