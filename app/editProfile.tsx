import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AvatarPicker from '@/components/profilManagement/AvatarPicker';
import ChildToggle from '@/components/profilManagement/ChildToggle';
import { router } from 'expo-router';

const avatarOptions = ['person-circle', 'person-circle-outline', 'happy', 'sad', 'star'];

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const [name, setName] = useState('Sample Name');
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [isKids, setIsKids] = useState(false);

  const handleSave = () => {
    // Save logic here
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
      <Text style={[styles.title, { color: theme.colors.text }]}>Edit Profile</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Profile Name"
        placeholderTextColor={theme.colors.textMuted}
        value={name}
        onChangeText={setName}
      />
      <Text style={[styles.label, { color: theme.colors.text }]}>Choose Avatar</Text>
      <AvatarPicker avatars={avatarOptions} selectedAvatar={avatar} onSelect={setAvatar} />
      <ChildToggle value={isKids} onValueChange={setIsKids} />
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={handleSave}>
        <Text style={[styles.saveText, { color: theme.colors.surface }]}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 16,
  },
  saveText: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 