import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { watchLaterApiService, WatchLaterItem } from '@/services/WatchLaterApiService';

// Define the API response structure based on your backend
interface ApiUser {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string | null;
  dateOfBirth: string;
  emailVerified: boolean;
  accountActive: boolean;
  resetToken: string | null;
  resetTokenExpiry: number | null;
}

// Frontend user profile structure
interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  name: string;
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { logout, user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchLaterItems, setWatchLaterItems] = useState<WatchLaterItem[]>([]);
  const [watchLaterLoading, setWatchLaterLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadWatchLaterItems();
  }, [authUser]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading user profile...');
      console.log('🔄 Auth user:', authUser);
      console.log('🔄 Auth user ID:', authUser?.id);
      console.log('🔄 Auth user type:', typeof authUser?.id);
      console.log('🔄 Auth user email:', authUser?.email);

      // Use auth user data directly since it contains all the information we need
      if (authUser) {
        console.log('✅ Using auth user data directly');
        
        const userProfile: UserProfile = {
          id: authUser.id.toString(),
          username: authUser.username,
          email: authUser.email,
          avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          name: `${authUser.firstname} ${authUser.lastname}`.trim() || authUser.username,
        };
        
        console.log('✅ Created user profile from auth data:', userProfile);
        setUser(userProfile);
        return;
      }

      // Fallback: try to get all users first (this should work based on your backend logs)
      try {
        console.log('🔄 Fetching all users...');
        const response = await fetch('http://10.171.140.120:8080/users');
        console.log('🔄 All users response status:', response.status);
        
        if (response.ok) {
          const users: ApiUser[] = await response.json();
          console.log('✅ All users response:', users);
          
          // Strategy 1a: Find user by ID from auth context
          if (authUser?.id) {
            console.log('🔄 Looking for user with ID:', authUser.id);
            const userById = users.find(u => u.id === authUser.id);
            console.log('🔄 Found user by ID:', userById);
            
            if (userById) {
              const userProfile: UserProfile = {
                id: userById.id.toString(),
                username: userById.username,
                email: userById.email,
                avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                name: `${userById.firstname} ${userById.lastname}`.trim() || userById.username,
              };
              
              console.log('✅ Found user by ID:', userProfile);
              setUser(userProfile);
              return;
            }
          }
          
          // Strategy 1b: Find user by email
          if (authUser?.email) {
            console.log('🔄 Looking for user with email:', authUser.email);
            const userByEmail = users.find(u => u.email === authUser.email);
            console.log('🔄 Found user by email:', userByEmail);
            
            if (userByEmail) {
              const userProfile: UserProfile = {
                id: userByEmail.id.toString(),
                username: userByEmail.username,
                email: userByEmail.email,
                avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                name: `${userByEmail.firstname} ${userByEmail.lastname}`.trim() || userByEmail.username,
              };
              
              console.log('✅ Found user by email:', userProfile);
              setUser(userProfile);
              return;
            }
          }
          
          // Strategy 1c: Use the first user if no match found (for testing)
          if (users.length > 0) {
            const firstUser = users[0];
            console.log('🔄 Using first user as fallback:', firstUser);
            
            const userProfile: UserProfile = {
              id: firstUser.id.toString(),
              username: firstUser.username,
              email: firstUser.email,
              avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
              name: `${firstUser.firstname} ${firstUser.lastname}`.trim() || firstUser.username,
            };
            
            console.log('✅ Using first user:', userProfile);
            setUser(userProfile);
            return;
          }
        } else {
          const errorText = await response.text();
          console.log('⚠️ Failed to fetch all users, status:', response.status);
          console.log('⚠️ Error response:', errorText);
        }
      } catch (error) {
        console.log('⚠️ Error fetching all users:', error);
      }

      // Strategy 2: Try direct user fetch by ID
      if (authUser?.id) {
        try {
          const userId = authUser.id;
          console.log('🔄 Trying direct fetch for user ID:', userId);
          const url = `http://10.171.140.120:8080/users/${userId}`;
          console.log('🔄 Fetching URL:', url);
          
          const response = await fetch(url);
          console.log('🔄 Direct fetch response status:', response.status);
          
          if (response.ok) {
            const apiUser: ApiUser = await response.json();
            console.log('✅ Direct fetch API Response:', apiUser);
            
            const userProfile: UserProfile = {
              id: apiUser.id.toString(),
              username: apiUser.username,
              email: apiUser.email,
              avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
              name: `${apiUser.firstname} ${apiUser.lastname}`.trim() || apiUser.username,
            };
            
            console.log('✅ Direct fetch user profile:', userProfile);
            setUser(userProfile);
            return;
          } else {
            const errorText = await response.text();
            console.log('⚠️ Direct fetch failed, status:', response.status);
            console.log('⚠️ Direct fetch error:', errorText);
          }
        } catch (error) {
          console.log('⚠️ Error in direct fetch:', error);
        }
      }

      // If we get here, we couldn't get any user data
      console.log('❌ Could not fetch any user data');
      setError('Unable to load user profile');
      setUser(null);

    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      router.replace('/auth');
    }
  };

  const loadWatchLaterItems = async () => {
    try {
      setWatchLaterLoading(true);
      const items = await watchLaterApiService.getWatchLaterItems();
      setWatchLaterItems(items.slice(0, 3)); // Show only first 3 items
    } catch (err) {
      console.error('Error loading watch later items:', err);
      // Don't set error state for watch later, just log it
    } finally {
      setWatchLaterLoading(false);
    }
  };

  const handleRetry = () => {
    console.log('🔄 Retrying to load user profile...');
    loadUserProfile();
  };

  const handleWatchLaterItemPress = (item: WatchLaterItem) => {
    if (item.type === 'movie') {
      router.push(`/watch/${item.contentId}`);
    } else if (item.type === 'series') {
      router.push(`/watch-series/${item.contentId}`);
    }
  };

  const renderWatchLaterItem = ({ item }: { item: WatchLaterItem }) => (
    <TouchableOpacity 
      style={styles.watchLaterItem}
      onPress={() => handleWatchLaterItemPress(item)}
    >
      <Image
        source={
          item.poster && item.poster.trim() !== ''
            ? { uri: item.poster }
            : require('../assets/images/default-poster.png')
        }
        style={styles.watchLaterPoster}
      />
      <View style={styles.watchLaterContent}>
        <Text style={[styles.watchLaterTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        {item.year && (
          <Text style={[styles.watchLaterYear, { color: theme.colors.textSecondary }]}>
            {item.year}
          </Text>
        )}
        <View style={styles.watchLaterTypeContainer}>
          <Ionicons 
            name={item.type === 'movie' ? 'film' : 'tv'} 
            size={12} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.watchLaterTypeText, { color: theme.colors.primary }]}>
            {item.type === 'movie' ? 'Movie' : 'Series'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const menuItems = [];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading profile...</Text>
        {error && (
          <Text style={[styles.errorHint, { color: theme.colors.textSecondary }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }

  if (error && !user) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Failed to load profile</Text>
        <Text style={[styles.errorDetail, { color: theme.colors.textSecondary }]}>{error}</Text>
        
        <View style={styles.errorActions}>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleRetry}
          >
            <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>Retry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.mockButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]}
            onPress={handleRetry}
          >
            <Text style={[styles.mockButtonText, { color: theme.colors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Debug: Log the user object being rendered
  console.log('🎨 Rendering user profile:', user);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.editButton}>
            <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Show error banner if there was an error but we're showing data */}
        {error && user && (
          <View style={[styles.errorBanner, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="warning" size={16} color={theme.colors.error} />
            <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>
              Using offline data - {error}
            </Text>
            <TouchableOpacity onPress={handleRetry}>
              <Ionicons name="refresh" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Avatar and User Info */}
        <View style={styles.avatarSection}>
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <View style={styles.avatarBadge}>
              <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
            </View>
          </View>
          
          {/* Display name */}
          <Text style={[styles.name, { color: theme.colors.text }]}>{user?.name}</Text>
          
          {/* Username with fallback */}
          <Text style={[styles.userUsername, { color: theme.colors.textSecondary }]}>
            @{user?.username || 'username'}
          </Text>
          
          {/* Email */}
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{user?.email}</Text>
        </View>

        {/* Watch Later Preview */}
        <View style={styles.watchLaterSection}>
          <View style={styles.watchLaterHeader}>
            <Text style={[styles.watchLaterSectionTitle, { color: theme.colors.text }]}>
              Watch Later
            </Text>
            <TouchableOpacity onPress={() => router.push('/WatchLaterScreen')}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {watchLaterLoading ? (
            <View style={styles.watchLaterLoading}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.watchLaterLoadingText, { color: theme.colors.textSecondary }]}>
                Loading...
              </Text>
            </View>
          ) : watchLaterItems.length === 0 ? (
            <View style={styles.watchLaterEmpty}>
              <Ionicons name="bookmark-outline" size={32} color={theme.colors.textMuted} />
              <Text style={[styles.watchLaterEmptyText, { color: theme.colors.textMuted }]}>
                No saved content yet
              </Text>
            </View>
          ) : (
            <FlatList
              data={watchLaterItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderWatchLaterItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.watchLaterList}
            />
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.error, borderTopColor: theme.colors.border }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color={theme.colors.surface} />
          <Text style={[styles.logoutText, { color: theme.colors.surface }]}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            CineVault v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 16,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 1,
    zIndex: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    marginBottom: 2,
  },
  email: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 12,
    borderTopWidth: 1,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mockButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  mockButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
  watchLaterSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  watchLaterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  watchLaterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  watchLaterLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  watchLaterLoadingText: {
    fontSize: 14,
  },
  watchLaterEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  watchLaterEmptyText: {
    fontSize: 14,
  },
  watchLaterList: {
    gap: 12,
  },
  watchLaterItem: {
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  watchLaterPoster: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  watchLaterContent: {
    padding: 8,
  },
  watchLaterTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  watchLaterYear: {
    fontSize: 10,
    marginBottom: 4,
  },
  watchLaterTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  watchLaterTypeText: {
    fontSize: 10,
    fontWeight: '500',
  },
});