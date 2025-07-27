import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DownloadScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download Screen</Text>
      {/* Add your download UI and logic here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 