import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileCardProps {
  name: string;
  avatar: string;
  isKids?: boolean;
  onPress?: () => void;
}

export default function ProfileCard({ name, avatar, isKids, onPress }: ProfileCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={avatar as any} size={48} color={isKids ? '#4fc3f7' : '#ffb300'} />
      <Text style={styles.name}>{name}</Text>
      {isKids && <Text style={styles.kidsLabel}>Kids</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    width: 120,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  kidsLabel: {
    fontSize: 12,
    color: '#4fc3f7',
    marginTop: 4,
  },
}); 