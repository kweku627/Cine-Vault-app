import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import ProfileCard from '@/components/profilManagement/ProfileCard';

const mockProfiles = [
  { id: '1', name: 'John', avatar: 'person-circle', isKids: false },
  { id: '2', name: 'Jane', avatar: 'person-circle-outline', isKids: true },
];

export default function ProfileSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who’s Watching?</Text>
      <FlatList
        data={mockProfiles}
        keyExtractor={item => item.id}
        horizontal={false}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProfileCard
            name={item.name}
            avatar={item.avatar}
            isKids={item.isKids}
            onPress={() => router.push(`/profileManagement/${item.id}`)}
          />
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/profileManagement/create')}>
        <ProfileCard name="Add Profile" avatar="add-circle" onPress={() => router.push('/profileManagement/create')} />
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
  list: {
    alignItems: 'center',
    marginBottom: 32,
  },
  addButton: {
    marginTop: 16,
  },
}); 