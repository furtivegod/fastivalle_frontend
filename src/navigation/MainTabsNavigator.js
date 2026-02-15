import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Text } from '../components';
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
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_MARGIN = 16;
const TAB_BAR_HEIGHT = 64;

const getIconName = (routeName, focused) => {
  const map = {
    Home: focused ? 'home' : 'home-outline',
    Schedule: focused ? 'calendar' : 'calendar-outline',
    Connect: focused ? 'people' : 'people-outline',
    Formation: focused ? 'school' : 'school-outline',
    Merch: focused ? 'shirt' : 'shirt-outline',
  };
  return map[routeName] || 'ellipse-outline';
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const theme = useTheme();

  return (
    <View style={styles.tabBarOuter}>
      <View style={[
        styles.tabBarPill,
        {
          backgroundColor: '#FFFFFF55',
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
            android: { elevation: 6 },
          }),
        },
      ]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = options.title ?? route.name;
          const iconName = getIconName(route.name, focused);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.8}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={[
                styles.tabItemInner,
                focused && { backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 999 },
              ]}>
                <Ionicons
                  name={iconName}
                  size={24}
                  color={focused ? '#1a1a1a' : '#6B6B6B'}
                />
                <Text style={[
                  styles.tabLabel,
                  { color: focused ? '#1a1a1a' : '#6B6B6B' },
                  focused && styles.tabLabelFocused,
                ]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarOuter: {
    paddingHorizontal: TAB_BAR_MARGIN,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH - TAB_BAR_MARGIN * 2,
    height: TAB_BAR_HEIGHT,
    borderRadius: 999,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
    fontFamily: 'PPAgrandirText-Bold',
  },
  tabLabelFocused: {
    fontWeight: '600',
    fontFamily: 'PPAgrandirText-Bold',
  },
});

const MainTabsNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Schedule', headerShown: false }} />
      <Tab.Screen name="Connect" component={ConnectScreen} options={{ title: 'Connect' }} />
      <Tab.Screen name="Formation" component={FormationScreen} options={{ title: 'Formation' }} />
      <Tab.Screen name="Merch" component={MerchScreen} options={{ title: 'Merch' }} />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;
