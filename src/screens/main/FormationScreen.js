import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FormationScreen = () => {
  const theme = useTheme();

  const workshops = [
    {
      id: 1,
      title: 'Music Production Basics',
      instructor: 'DJ Mixmaster',
      time: '2:00 PM - 4:00 PM',
      location: 'Workshop Tent',
      level: 'Beginner',
      capacity: 30,
      enrolled: 15,
    },
    {
      id: 2,
      title: 'Songwriting Workshop',
      instructor: 'Singer Songwriter',
      time: '10:00 AM - 12:00 PM',
      location: 'Acoustic Stage',
      level: 'Intermediate',
      capacity: 20,
      enrolled: 18,
    },
    {
      id: 3,
      title: 'Live Performance Tips',
      instructor: 'Headliner Band',
      time: '3:00 PM - 5:00 PM',
      location: 'Main Stage',
      level: 'All Levels',
      capacity: 50,
      enrolled: 32,
    },
    {
      id: 4,
      title: 'DJ Mixing Techniques',
      instructor: 'DJ Nightlife',
      time: '6:00 PM - 8:00 PM',
      location: 'DJ Stage',
      level: 'Advanced',
      capacity: 25,
      enrolled: 25,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Workshops & Formation
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Learn from the best artists
        </Text>
      </View>

      {workshops.map((workshop) => {
        const isFull = workshop.enrolled >= workshop.capacity;
        const spotsLeft = workshop.capacity - workshop.enrolled;

        return (
          <TouchableOpacity
            key={workshop.id}
            style={[styles.workshopCard, { backgroundColor: theme.colors.surface }]}
          >
            <View style={styles.workshopHeader}>
              <View style={styles.workshopInfo}>
                <Text style={[styles.workshopTitle, { color: theme.colors.text }]}>
                  {workshop.title}
                </Text>
                <Text style={[styles.workshopInstructor, { color: theme.colors.textSecondary }]}>
                  by {workshop.instructor}
                </Text>
              </View>
              <View
                style={[
                  styles.levelBadge,
                  {
                    backgroundColor:
                      workshop.level === 'Beginner'
                        ? theme.colors.success
                        : workshop.level === 'Intermediate'
                        ? theme.colors.warning
                        : theme.colors.primary,
                  },
                ]}
              >
                <Text style={[styles.levelText, { color: theme.colors.background }]}>
                  {workshop.level}
                </Text>
              </View>
            </View>

            <View style={styles.workshopDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                  {workshop.time}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                  {workshop.location}
                </Text>
              </View>
            </View>

            <View style={styles.capacityContainer}>
              <View style={styles.capacityBar}>
                <View
                  style={[
                    styles.capacityFill,
                    {
                      width: `${(workshop.enrolled / workshop.capacity) * 100}%`,
                      backgroundColor: isFull
                        ? theme.colors.error
                        : theme.colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.capacityText, { color: theme.colors.textSecondary }]}>
                {isFull
                  ? 'Full'
                  : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.enrollButton,
                {
                  backgroundColor: isFull
                    ? theme.colors.textSecondary
                    : theme.colors.primary,
                },
              ]}
              disabled={isFull}
            >
              <Text
                style={[
                  styles.enrollButtonText,
                  { color: theme.colors.background },
                ]}
              >
                {isFull ? 'Full' : 'Enroll Now'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  workshopCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workshopInfo: {
    flex: 1,
    marginRight: 12,
  },
  workshopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workshopInstructor: {
    fontSize: 14,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workshopDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  capacityContainer: {
    marginBottom: 12,
  },
  capacityBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 4,
  },
  capacityText: {
    fontSize: 12,
  },
  enrollButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormationScreen;
