import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AvatarPicker from '@/components/profilManagement/AvatarPicker';
import ChildToggle from '@/components/profilManagement/ChildToggle';

const avatarOptions = ['person-circle', 'person-circle-outline', 'happy', 'sad', 'star'];

export default function EditProfileScreen() {
  const { id } = useLocalSearchParams();
  // Placeholder: Load profile data by id
  const [name, setName] = useState('Sample Name');
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [isKids, setIsKids] = useState(false);

  const handleSave = () => {
    // Save logic here
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Profile Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Choose Avatar</Text>
      <AvatarPicker avatars={avatarOptions} selectedAvatar={avatar} onSelect={setAvatar} />
      <ChildToggle value={isKids} onValueChange={setIsKids} />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
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
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 