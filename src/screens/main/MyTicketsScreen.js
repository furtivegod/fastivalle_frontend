import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { Text } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 20;
const PADDING = 20;
const UPCOMING_CARD_SIZE = SCREEN_WIDTH - PADDING * 2;

const MyTicketsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [festivalLiked, setFestivalLiked] = useState(false);
  const [popularLiked, setPopularLiked] = useState({});

  const featuredFestival = {
    id: '1',
    date: 'AUG 15-17',
    attendees: 54,
    title: 'kingdom community...',
    subtitle: 'FESTIVAL',
    stage: '1234 SUNSET BLVD, LOS ANGELES',
  };

  const popularEvents = [
    { id: '1', date: 'AUG 15, 12:00AM', title: 'kingdom community mee...', liked: true },
    { id: '2', date: 'AUG 15, 6:00PM', title: 'evening of hope', liked: true },
    { id: '3', date: 'AUG 16, 8:00PM', title: 'fasting focus weekend', liked: false },
  ];

  const togglePopularLiked = (eventId) => {
    setPopularLiked((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

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

        {/* Festivals section — same card as Upcoming Events on Home */}
        <Text style={[styles.sectionTitle, styles.getTicketsTitle, { color: theme.colors.text }]}>Festivals</Text>
        <TouchableOpacity
          style={styles.getTicketsCard}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('Event', {
              event: {
                ...featuredFestival,
                date: featuredFestival.date,
                attendees: featuredFestival.attendees,
              },
            })
          }
        >
          <ImageBackground
            source={require('../../../assets/images/cover.png')}
            style={[StyleSheet.absoluteFill, styles.getTicketsCardBg]}
            imageStyle={styles.getTicketsCardImageStyle}
          >
            <View style={styles.getTicketsCardOverlay} />
            <View style={styles.getTicketsCardTop}>
              <Text style={styles.getTicketsDate}>{featuredFestival.date}</Text>
              <View style={styles.getTicketsAttendees}>
                <Ionicons name="people" size={14} color="#FFF" />
                <Text style={styles.getTicketsAttendeesText}>{featuredFestival.attendees}</Text>
              </View>
            </View>
            <View style={styles.getTicketsCardSpacer} />
            <Text style={styles.getTicketsCardTitle}>{featuredFestival.title}</Text>
            <Text style={styles.getTicketsCardSub}>{featuredFestival.subtitle}</Text>
            <Text style={styles.getTicketsCardStage}>{featuredFestival.stage}</Text>
            <View style={styles.getTicketsCardActions}>
              <TouchableOpacity
                style={styles.getTicketsHeart}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => setFestivalLiked((prev) => !prev)}
              >
                <Ionicons name={festivalLiked ? 'heart' : 'heart-outline'} size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.getTicketBtn, { backgroundColor: theme.colors.text }]}
                onPress={() =>
                  festivalLiked
                    ? navigation.navigate('Schedule', { openMySchedule: true })
                    : navigation.navigate('GetTicket', {
                        event: {
                          id: featuredFestival.id,
                          date: featuredFestival.date,
                          title: featuredFestival.title,
                          attendees: featuredFestival.attendees,
                          subtitle: featuredFestival.subtitle,
                          stage: featuredFestival.stage,
                        },
                      })
                }
              >
                <Text style={styles.getTicketBtnText}>
                  {festivalLiked ? 'Curate Line Up' : 'Get Ticket'}
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Popular Events — same as Festival Popular Events on Home */}
        <Text style={[styles.sectionTitle, styles.section6Title, { color: theme.colors.text }]}>Popular Events</Text>
        {popularEvents.map((event) => {
          const liked = popularLiked[event.id] ?? event.liked;
          return (
            <TouchableOpacity
              key={event.id}
              style={[styles.nextAppearanceCard, { backgroundColor: theme.colors.surface }]}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('Event', {
                  event: { id: event.id, date: event.date, title: event.title },
                })
              }
            >
              <Image
                source={require('../../../assets/images/cover.png')}
                style={styles.nextAppearanceImage}
                resizeMode="cover"
              />
              <View style={styles.nextAppearanceRight}>
                <View style={styles.nextAppearanceRow}>
                  <Text style={[styles.nextAppearanceDateTime, { color: theme.colors.textSecondary }]}>
                    {event.date}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} style={styles.forwardIcon} />
                </View>
                <View style={styles.nextAppearanceRow}>
                  <Text
                    style={[styles.nextAppearanceTitle, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {event.title}
                  </Text>
                  <TouchableOpacity
                    hitSlop={12}
                    style={styles.likedBtn}
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      togglePopularLiked(event.id);
                    }}
                  >
                    <Ionicons
                      name={liked ? 'heart' : 'heart-outline'}
                      size={22}
                      color={liked ? theme.colors.heartActive : theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

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
  getTicketsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 12,
  },
  getTicketsCard: {
    borderRadius: 16,
    padding: 16,
    width: UPCOMING_CARD_SIZE,
    height: UPCOMING_CARD_SIZE,
    marginBottom: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  getTicketsCardBg: {
    padding: 16,
    justifyContent: 'space-between',
  },
  getTicketsCardSpacer: {
    flex: 1,
  },
  getTicketsCardImageStyle: {
    borderRadius: 16,
    resizeMode: 'cover',
  },
  getTicketsCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232, 125, 43, 0.25)',
    borderRadius: 16,
  },
  getTicketsCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  getTicketsDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  getTicketsAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  getTicketsAttendeesText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  getTicketsCardTitle: {
    fontSize: 40,
    lineHeight: 40,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
  },
  getTicketsCardSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  getTicketsCardStage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  getTicketsCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: 12,
  },
  getTicketsHeart: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: '#1a1a1a',
  },
  getTicketBtn: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
  },
  getTicketBtnText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFF',
  },
  section6Title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  nextAppearanceCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'stretch',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  nextAppearanceImage: {
    maxWidth: 70,
    aspectRatio: 1,
    marginLeft: 14,
    marginVertical: 14,
    borderRadius: 12,
  },
  nextAppearanceRight: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'space-evenly',
    minWidth: 0,
  },
  nextAppearanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextAppearanceDateTime: {
    fontSize: 13,
    marginRight: 8,
  },
  nextAppearanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  likedBtn: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#F2EFEB',
  },
  forwardIcon: {
    marginRight: 12,
  },
  bottomPad: {
    height: 24,
  },
});

export default MyTicketsScreen;
