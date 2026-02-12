import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 20;

const MyTicketsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const featuredFestival = {
    id: '1',
    date: 'AUG 15-17',
    attendees: 54,
    title: 'kingdom community...',
    type: 'FESTIVAL',
    address: '1234 SUNSET BLVD, LOS ANGELES',
    gradient: ['#E87D2B', '#D4A84B'],
  };

  const popularEvents = [
    { id: '1', date: 'AUG 15, 12:00AM', title: 'kingdom community mee...', liked: true, imageColor: '#E87D2B' },
    { id: '2', date: 'AUG 15, 6:00PM', title: 'evening of hope', liked: true, imageColor: '#D4A84B' },
    { id: '3', date: 'AUG 16, 8:00PM', title: 'fasting focus weekend', liked: false, imageColor: '#2D4739' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Header: Back | My Tickets | Refresh */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBack}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.headerBackText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Tickets</Text>
        <TouchableOpacity
          style={styles.headerRight}
          hitSlop={12}
          onPress={() => navigation.navigate('OrderDetails')}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* No tickets placeholder card */}
        <View style={[styles.noTicketsCard, { backgroundColor: theme.colors.surface }]}>
          <Ionicons
            name="ticket-outline"
            size={64}
            color={theme.colors.textSecondary}
            style={styles.noTicketsIcon}
          />
          <Text style={[styles.noTicketsTitle, { color: theme.colors.text }]}>
            You don't have any tickets yet
          </Text>
          <Text style={[styles.noTicketsSub, { color: theme.colors.textSecondary }]}>
            Discover upcoming events and grab your first ticket.
          </Text>
        </View>

        {/* Festivals section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Festivals</Text>
        <TouchableOpacity
          style={[styles.festivalCard, { backgroundColor: '#E87D2B' }]}
          activeOpacity={0.9}
        >
          <View style={styles.festivalCardTop}>
            <Text style={styles.festivalDate}>{featuredFestival.date}</Text>
            <View style={styles.festivalAttendees}>
              <Ionicons name="people" size={14} color="#FFF" />
              <Text style={styles.festivalAttendeesText}>{featuredFestival.attendees}</Text>
            </View>
          </View>
          <Text style={styles.festivalTitle}>{featuredFestival.title}</Text>
          <Text style={styles.festivalMeta}>{featuredFestival.type}</Text>
          <Text style={styles.festivalMeta}>{featuredFestival.address}</Text>
          <View style={styles.festivalActions}>
            <TouchableOpacity style={styles.festivalHeart} hitSlop={12}>
              <Ionicons name="heart-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.festivalGetTicket, { backgroundColor: theme.colors.text }]}
              onPress={() =>
                navigation.navigate('GetTicket', {
                  event: {
                    id: featuredFestival.id,
                    date: featuredFestival.date,
                    title: featuredFestival.title,
                  },
                })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.festivalGetTicketText}>Get Ticket</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Popular Events section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Popular Events</Text>
        {popularEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.popularCard, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.8}
          >
            <Image source={require('../../../assets/images/person.png')} style={styles.popularThumb} resizeMode="cover" />
            <View style={styles.popularContent}>
              <Text style={[styles.popularDate, { color: theme.colors.textSecondary }]}>
                {event.date}
              </Text>
              <Text style={[styles.popularTitle, { color: theme.colors.text }]} numberOfLines={1}>
                {event.title}
              </Text>
            </View>
            <View style={styles.popularActions}>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              <TouchableOpacity style={styles.popularHeart} hitSlop={12}>
                <Ionicons
                  name={event.liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={event.liked ? theme.colors.heartActive : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeTop: {
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8E8',
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  headerBackText: {
    fontSize: 17,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  headerRight: {
    minWidth: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 24,
    paddingBottom: 32,
  },
  noTicketsCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 28,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  noTicketsIcon: {
    marginBottom: 16,
  },
  noTicketsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  noTicketsSub: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  festivalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  festivalCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  festivalDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  festivalAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  festivalAttendeesText: {
    color: '#FFF',
    fontSize: 14,
  },
  festivalTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  festivalMeta: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    marginBottom: 2,
  },
  festivalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  festivalHeart: {
    padding: 4,
  },
  festivalGetTicket: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  festivalGetTicketText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  popularThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 14,
  },
  popularContent: {
    flex: 1,
    minWidth: 0,
  },
  popularDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  popularActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popularHeart: {
    padding: 4,
  },
  bottomPad: {
    height: 24,
  },
});

export default MyTicketsScreen;
