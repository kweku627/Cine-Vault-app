import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface ChildToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
}

export default function ChildToggle({ value, onValueChange, label = 'Kids Profile' }: ChildToggleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
}); 