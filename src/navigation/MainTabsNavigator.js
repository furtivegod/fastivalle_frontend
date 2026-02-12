import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import ScheduleScreen from '../screens/main/ScheduleScreen';
import ConnectScreen from '../screens/main/ConnectScreen';
import FormationScreen from '../screens/main/FormationScreen';
import MerchScreen from '../screens/main/MerchScreen';
const Tab = createBottomTabNavigator();

const MainTabsNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Connect') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Formation') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Merch') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen 
        name="Schedule" 
        component={ScheduleScreen}
        options={{ title: 'Schedule', headerShown: false }}
      />
      <Tab.Screen 
        name="Connect" 
        component={ConnectScreen}
        options={{ title: 'Connect' }}
      />
      <Tab.Screen 
        name="Formation" 
        component={FormationScreen}
        options={{ title: 'Formation' }}
      />
      <Tab.Screen 
        name="Merch" 
        component={MerchScreen}
        options={{ title: 'Merch' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;
