import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import MainTabsNavigator from './MainTabsNavigator';
import GetTicketScreen from '../screens/main/GetTicketScreen';
import PurchaseSuccessScreen from '../screens/main/PurchaseSuccessScreen';
import MyTicketsScreen from '../screens/main/MyTicketsScreen';
import OrderDetailsScreen from '../screens/main/OrderDetailsScreen';
import EventScreen from '../screens/main/EventScreen';
import ArtistListScreen from '../screens/main/ArtistListScreen';
import ArtistDetailScreen from '../screens/main/ArtistDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [splashDone, setSplashDone] = useState(false);
  const { isAuthenticated, authInitialized, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const showSplash = !splashDone || (authInitialized === false && isLoading);

  if (showSplash) {
    return <SplashScreen />;
  }

  // When authenticated, show main app with ProfileSetup accessible
  if (isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
        <Stack.Screen name="GetTicket" component={GetTicketScreen} />
        <Stack.Screen name="Event" component={EventScreen} />
        <Stack.Screen name="ArtistList" component={ArtistListScreen} />
        <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
        <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="PurchaseSuccess" component={PurchaseSuccessScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
