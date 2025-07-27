import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarPickerProps {
  avatars: string[];
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export default function AvatarPicker({ avatars, selectedAvatar, onSelect }: AvatarPickerProps) {
  return (
    <View style={styles.grid}>
      {avatars.map(avatar => (
        <TouchableOpacity
          key={avatar}
          onPress={() => onSelect(avatar)}
          style={[styles.avatarOption, selectedAvatar === avatar && styles.avatarSelected]}
        >
          <Ionicons name={avatar as any} size={40} color={selectedAvatar === avatar ? '#1976d2' : '#888'} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarOption: {
    margin: 8,
    padding: 4,
    borderRadius: 24,
  },
  avatarSelected: {
    backgroundColor: '#e3f2fd',
  },
}); 