import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { WatchLaterProvider } from '@/contexts/WatchLaterContext';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from './index';
import SearchScreen from './search';
import SeriesScreen from './series';

const Tab = createBottomTabNavigator();

function SwipeableTabNavigator() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const panRef = useRef(null);
  const insets = useSafeAreaInsets();

  const handleGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      const threshold = 100; // Minimum swipe distance

      if (Math.abs(translationX) > threshold) {
        const state = navigation.getState();
        const currentRoute = state.routes[state.index];
        const routeNames = ['index', 'search', 'series'];
        const currentIndex = routeNames.indexOf(currentRoute?.name || 'index');

        if (translationX > 0 && currentIndex > 0) {
          // Swipe right - go to previous tab
          navigation.navigate(routeNames[currentIndex - 1]);
        } else if (translationX < 0 && currentIndex < routeNames.length - 1) {
          // Swipe left - go to next tab
          navigation.navigate(routeNames[currentIndex + 1]);
        }
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={handleGestureEvent}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-20, 20]}
      >
        <View style={{ flex: 1 }}>
          <Tab.Navigator
            initialRouteName="index"
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.border,
                borderTopWidth: 1,
                paddingBottom: Math.max(insets.bottom, 8),
                paddingTop: 8,
                height: 70 + Math.max(insets.bottom, 8),
                paddingHorizontal: 16,
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.textMuted,
              tabBarLabelStyle: {
                fontSize: 12,
                marginTop: 4,
              },
              tabBarIconStyle: {
                marginTop: 4,
              },
            }}
          >
            <Tab.Screen
              name="index"
              component={HomeScreen}
              options={{
                title: 'Home',
                tabBarIcon: ({ color }) => (
                  <Ionicons name="home" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="search"
              component={SearchScreen}
              options={{
                title: 'Search',
                tabBarIcon: ({ color }) => (
                  <Ionicons name="search" size={24} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="series"
              component={SeriesScreen}
              options={{
                title: 'Series',
                tabBarIcon: ({ color }) => (
                  <Ionicons name="tv" size={24} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

export default function TabLayout() {
  return (
    <WatchLaterProvider>
      <SwipeableTabNavigator />
    </WatchLaterProvider>
  );
}