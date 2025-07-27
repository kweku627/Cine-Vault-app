import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { SearchFilters } from '@/types/content';

interface FilterModalProps {
  visible: boolean;
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
  onClose: () => void;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function FilterModal({ visible, filters, onApply, onClose }: FilterModalProps) {
  const { theme } = useTheme();
  const [localFilters, setLocalFilters] = useState(filters);

  const typeOptions: FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'TV Shows' },
  ];

  const genreOptions: FilterOption[] = [
    { value: 'all', label: 'All Genres' },
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'family', label: 'Family' },
    { value: 'animation', label: 'Animation' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci-fi', label: 'Sci-Fi' },
  ];

  const yearOptions: FilterOption[] = [
    { value: 'all', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setLocalFilters((prev: SearchFilters) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = { type: 'all', genre: 'all', year: 'all' };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  const FilterSection = ({ title, options, selectedValue, onSelect }: FilterSectionProps) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterOption,
              { backgroundColor: theme.colors.card },
              selectedValue === option.value && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.filterOptionText,
              { color: theme.colors.textSecondary },
              selectedValue === option.value && { color: theme.colors.surface, fontWeight: '600' }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <FilterSection
            title="Content Type"
            options={typeOptions}
            selectedValue={localFilters.type}
            onSelect={(value) => handleFilterChange('type', value as 'all' | 'movie' | 'series')}
          />

          <FilterSection
            title="Genre"
            options={genreOptions}
            selectedValue={localFilters.genre}
            onSelect={(value) => handleFilterChange('genre', value)}
          />

          <FilterSection
            title="Release Year"
            options={yearOptions}
            selectedValue={localFilters.year}
            onSelect={(value) => handleFilterChange('year', value)}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: theme.colors.card }]} 
            onPress={handleReset}
          >
            <Text style={[styles.resetButtonText, { color: theme.colors.textSecondary }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.applyButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleApply}
          >
            <Text style={[styles.applyButtonText, { color: theme.colors.surface }]}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterOptionText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});