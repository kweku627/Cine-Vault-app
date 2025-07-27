import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.35;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface ContentRowProps {
  title: string;
  content: any[];
  style?: any;
}

export default function ContentRow({ title, content, style }: ContentRowProps) {
  const { theme } = useTheme();

  const handleContentPress = (item: any) => {
    if (item.type === 'series') {
      router.push(`/watch-series/${item.id}`);
    } else {
      router.push(`/movie/${item.id}`);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              index === 0 && styles.firstCard,
              index === content.length - 1 && styles.lastCard
            ]}
            onPress={() => handleContentPress(item)}
            activeOpacity={0.8}
          >
            <Image
              source={
                item.poster && item.poster.trim() !== ''
                  ? { uri: item.poster }
                  : require('../assets/images/default-poster.png')
              }
              style={styles.poster}
              resizeMode="cover"
            />
            <Text style={styles.contentTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingLeft: 20,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
  },
  firstCard: {
    marginLeft: 0,
  },
  lastCard: {
    marginRight: 20,
  },
  poster: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 8,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
});