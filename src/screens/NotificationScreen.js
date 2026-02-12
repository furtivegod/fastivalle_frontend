import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NotificationScreen = () => {
  const theme = useTheme();

  const notifications = [
    {
      id: 1,
      type: 'event',
      title: 'New Event Added',
      message: 'Rock Band performance starts in 30 minutes at Main Stage',
      time: '5 minutes ago',
      read: false,
      icon: 'calendar',
    },
    {
      id: 2,
      type: 'connection',
      title: 'New Connection Request',
      message: 'Alex Johnson wants to connect with you',
      time: '1 hour ago',
      read: false,
      icon: 'person-add',
    },
    {
      id: 3,
      type: 'workshop',
      title: 'Workshop Reminder',
      message: 'Music Production Basics workshop starts in 2 hours',
      time: '2 hours ago',
      read: true,
      icon: 'school',
    },
    {
      id: 4,
      type: 'merch',
      title: 'New Merch Available',
      message: 'Check out our new festival hoodie collection',
      time: '3 hours ago',
      read: true,
      icon: 'shirt',
    },
    {
      id: 5,
      type: 'event',
      title: 'Event Update',
      message: 'DJ Mixmaster set time changed to 9:00 PM',
      time: '5 hours ago',
      read: true,
      icon: 'time',
    },
    {
      id: 6,
      type: 'system',
      title: 'Welcome to Fastivalle!',
      message: 'Thanks for joining. Explore the festival schedule and connect with other attendees.',
      time: '1 day ago',
      read: true,
      icon: 'notifications',
    },
  ];

  const getIconColor = (type) => {
    switch (type) {
      case 'event':
        return theme.colors.primary;
      case 'connection':
        return theme.colors.info;
      case 'workshop':
        return theme.colors.warning;
      case 'merch':
        return theme.colors.secondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Notifications
        </Text>
        <TouchableOpacity>
          <Text style={[styles.markAllRead, { color: theme.colors.primary }]}>
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No notifications
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                {
                  backgroundColor: notification.read
                    ? theme.colors.background
                    : theme.colors.surface,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${getIconColor(notification.type)}20` },
                ]}
              >
                <Ionicons
                  name={notification.icon}
                  size={24}
                  color={getIconColor(notification.type)}
                />
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
                    {notification.title}
                  </Text>
                  {!notification.read && (
                    <View
                      style={[
                        styles.unreadDot,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    />
                  )}
                </View>
                <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
                  {notification.message}
                </Text>
                <Text style={[styles.notificationTime, { color: theme.colors.textSecondary }]}>
                  {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default NotificationScreen;
