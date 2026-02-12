import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  Modal,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PADDING = 20;
const SCHEDULE_MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;
const CARD_PADDING = 14;
const THUMB_SIZE = 72;

// Events grouped by month; first in MARCH is featured (gradient card)
const EVENTS_BY_MONTH = {
  MARCH: [
    {
      id: '1',
      date: 'MAR 5, 12:00AM',
      title: 'fastivalle',
      actionText: 'Curate My LineUp',
      imageColor: '#E8A84B',
      featured: true,
      liked: true,
    },
    {
      id: '2',
      date: 'MAR 13, 12AM',
      title: 'kingdom community mee...',
      actionText: 'View Schedule',
      imageColor: '#2D4739',
      liked: false,
    },
    {
      id: '3',
      date: 'MAR 15, 6PM',
      title: 'evening worship',
      actionText: 'View Schedule',
      imageColor: '#D4A84B',
      liked: false,
    },
  ],
  AUGUST: [
    {
      id: '4',
      date: 'AUG 13, 12AM',
      title: 'youth revival',
      actionText: 'View Schedule',
      imageColor: '#E87D2B',
      liked: false,
    },
  ],
};

const initialLiked = () => {
  const out = {};
  Object.values(EVENTS_BY_MONTH).forEach((events) => {
    events.forEach((e) => { out[e.id] = !!e.liked; });
  });
  return out;
};

const GET_TICKETS_EVENT = {
  id: 'get-tickets',
  date: 'AUG 15, 10:00AM',
  attendees: 54,
  title: 'kingdom community meetup',
  subtitle: 'WORSHIP',
  stage: 'MAIN STAGE',
};

const SCHEDULE_STAGES = ['Main Stage', 'Garden', 'Orange Stage', 'Stage 4'];

const SCHEDULE_SLOTS = [
  { time: '10:00', items: [{ stage: 'R&B MAINSTAGE', artist: 'tauren wells', added: true }] },
  { time: '11:00', items: [{ stage: 'CCM GARDEN', artist: 'heart & soul', added: false }] },
  { time: '12:00', items: [{ stage: 'FOLK ORANGE', artist: 'rocky & the queen', added: false }] },
];

const ScheduleScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All Events');
  const [likedCards, setLikedCards] = useState(initialLiked);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedScheduleEvent, setSelectedScheduleEvent] = useState(null);
  const [scheduleModalMode, setScheduleModalMode] = useState('schedule');
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  const scheduleOverlayOpacity = useRef(new Animated.Value(0)).current;
  const scheduleModalSlide = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (scheduleModalVisible) {
      scheduleOverlayOpacity.setValue(0);
      scheduleModalSlide.setValue(400);
      Animated.parallel([
        Animated.timing(scheduleOverlayOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scheduleModalSlide, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scheduleOverlayOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scheduleModalSlide, {
          toValue: 400,
          duration: 350,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [scheduleModalVisible]);

  const openScheduleModal = (event, mode) => {
    setSelectedScheduleEvent(event);
    setScheduleModalMode(mode || 'schedule');
    setScheduleModalVisible(true);
  };

  const closeScheduleModal = () => {
    setScheduleModalVisible(false);
    setSelectedScheduleEvent(null);
    setScheduleModalMode('schedule');
  };

  const months = Object.keys(EVENTS_BY_MONTH);
  const isFeatured = (event) => !!event.featured;
  const isLiked = (id) => likedCards[id];
  const toggleLiked = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const likedEventsByMonth = Object.entries(EVENTS_BY_MONTH).reduce((acc, [month, events]) => {
    const liked = events.filter((e) => likedCards[e.id]);
    if (liked.length > 0) acc[month] = liked;
    return acc;
  }, {});
  const likedMonthKeys = Object.keys(likedEventsByMonth);
  const hasLikedEvents = likedMonthKeys.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
        Schedule
      </Text>

      {/* Tabs: single pill with All Events | My Events segments */}
      <View style={styles.tabRow}>
        <View style={styles.tabPillWrap}>
          <TouchableOpacity
            style={[
              styles.tabSegment,
              styles.tabSegmentLeft,
              activeTab === 'All Events' && styles.tabSegmentActive,
            ]}
            onPress={() => setActiveTab('All Events')}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.tabSegmentText,
                activeTab === 'All Events' ? styles.tabSegmentTextActive : styles.tabSegmentTextInactive,
              ]}
            >
              All Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabSegment,
              styles.tabSegmentRight,
              activeTab === 'My Events' && styles.tabSegmentActive,
            ]}
            onPress={() => setActiveTab('My Events')}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.tabSegmentText,
                activeTab === 'My Events' ? styles.tabSegmentTextActive : styles.tabSegmentTextInactive,
              ]}
            >
              My Events
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'My Events' && !hasLikedEvents ? (
          <>
            <View style={[styles.emptyStateCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.emptyStateIconWrap}>
                <Image
                  source={require('../../../assets/images/calendar.png')}
                  style={styles.emptyStateIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>Your schedule is empty</Text>
              <Text style={[styles.emptyStateDesc, { color: theme.colors.textSecondary }]}>
                Save your favorite sessions here to stay organized.
              </Text>
            </View>

            <View style={styles.getTicketsSection}>
              <Text style={[styles.getTicketsTitle, { color: theme.colors.text }]}>Get Tickets For More Moments</Text>
              <TouchableOpacity
                style={styles.getTicketsCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Event', { event: GET_TICKETS_EVENT })}
              >
                <ImageBackground
                  source={require('../../../assets/images/cover.png')}
                  style={StyleSheet.absoluteFill}
                  imageStyle={styles.getTicketsCardImageStyle}
                >
                  <View style={styles.getTicketsCardOverlay} />
                </ImageBackground>
                <View style={styles.getTicketsCardTop}>
                  <Text style={styles.getTicketsDate}>{GET_TICKETS_EVENT.date}</Text>
                  <View style={styles.getTicketsAttendees}>
                    <Ionicons name="people" size={14} color="#FFF" />
                    <Text style={styles.getTicketsAttendeesText}>{GET_TICKETS_EVENT.attendees}</Text>
                  </View>
                </View>
                <Text style={styles.getTicketsCardTitle}>{GET_TICKETS_EVENT.title}</Text>
                <Text style={styles.getTicketsCardSub}>{GET_TICKETS_EVENT.subtitle}</Text>
                <Text style={styles.getTicketsCardStage}>{GET_TICKETS_EVENT.stage}</Text>
                <View style={styles.getTicketsCardActions}>
                  <TouchableOpacity style={styles.getTicketsHeart} hitSlop={12}>
                    <Ionicons name="heart-outline" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.getTicketBtn, { backgroundColor: theme.colors.text }]}
                    onPress={() => navigation.navigate('GetTicket', { event: GET_TICKETS_EVENT })}
                  >
                    <Text style={styles.getTicketBtnText}>Get Ticket</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
        (activeTab === 'All Events' ? months : likedMonthKeys).map((month) => (
          <View key={month} style={styles.monthSection}>
            <Text
              style={[styles.monthHeading, { color: theme.colors.textSecondary }]}
            >
              {month}
            </Text>
            {(activeTab === 'All Events' ? EVENTS_BY_MONTH[month] || [] : likedEventsByMonth[month] || []).map((event) => {
              const featured = isFeatured(event);
              const liked = isLiked(event.id);
              const useImageBg = featured;
              const dateColor = useImageBg ? '#FFFFFF' : theme.colors.textSecondary;
              const titleColor = useImageBg ? '#FFFFFF' : theme.colors.text;
              const actionColor = useImageBg ? '#FFFFFF' : theme.colors.accent;
              const chevronColor = useImageBg ? '#FFFFFF' : theme.colors.textSecondary;
              const heartColor = liked ? '#E87D2B' : theme.colors.textSecondary;

              const cardContent = (
                <>
                  <Image
                    source={require('../../../assets/images/cover.png')}
                    style={styles.thumb}
                    resizeMode="cover"
                  />
                  <View style={styles.eventBody}>
                    <Text
                      style={[styles.eventDate, { color: dateColor }]}
                      numberOfLines={1}
                    >
                      {event.date}
                    </Text>
                    <Text
                      style={[styles.eventTitle, { color: titleColor }]}
                      numberOfLines={1}
                    >
                      {event.title}
                    </Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e?.stopPropagation?.();
                        if (event.actionText === 'Curate My LineUp') {
                          openScheduleModal(event, 'lineup');
                        } else {
                          openScheduleModal(event, 'schedule');
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[styles.eventAction, { color: actionColor }]}
                        numberOfLines={1}
                      >
                        {event.actionText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.eventRight}>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={chevronColor}
                      style={styles.chevronIcon}
                    />
                    <TouchableOpacity
                      hitSlop={10}
                      onPress={(e) => toggleLiked(event.id, e)}
                      style={styles.heartWrap}
                    >
                      <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={18}
                        color={heartColor}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              );

              return (
                <TouchableOpacity
                  key={event.id}
                  activeOpacity={0.85}
                  style={[
                    styles.eventCard,
                    styles.eventCardFeatured,
                    !useImageBg && {
                      padding: CARD_PADDING,
                      backgroundColor: '#FFFFFF',
                      ...styles.cardShadow,
                    },
                  ]}
                >
                  {useImageBg ? (
                    <>
                      <ImageBackground
                        source={require('../../../assets/images/cover2.png')}
                        style={styles.eventCardBgImage}
                        imageStyle={styles.eventCardBgImageStyle}
                      >
                        <View style={styles.eventCardBgOverlay} pointerEvents="none" />
                        {cardContent}
                      </ImageBackground>
                    </>
                  ) : (
                    cardContent
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))
        )}
      </ScrollView>

      {/* Event Schedule Modal */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeScheduleModal}
      >
        <View style={styles.scheduleModalContainer}>
          <Animated.View
            style={[
              styles.scheduleModalOverlay,
              { opacity: scheduleOverlayOpacity },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeScheduleModal} />
          </Animated.View>
          <Animated.View
            style={[
              styles.scheduleModalContent,
              { backgroundColor: '#FFFFFF', transform: [{ translateY: scheduleModalSlide }] },
            ]}
          >
            <View style={styles.scheduleModalHandle} />

            {/* Section 1: Title area — View Schedule: thumb + title + date; Curate My LineUp: large title "Add Event to Your LineUp" */}
            {scheduleModalMode === 'lineup' ? (
              <Text style={styles.scheduleModalLargeTitle}>Add Event to Your LineUp</Text>
            ) : (
              <View style={styles.scheduleModalSection1}>
                <View style={[styles.scheduleThumb, { backgroundColor: '#E8A84B' }]}>
                  <Image
                    source={require('../../../assets/images/cover2.png')}
                    style={styles.scheduleThumbImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.scheduleModalTitleWrap}>
                  <Text style={[styles.scheduleModalTitle, { color: theme.colors.text }]}>
                    {selectedScheduleEvent ? `${selectedScheduleEvent.title} schedule` : 'Event schedule'}
                  </Text>
                  <Text style={[styles.scheduleModalDateTime, { color: theme.colors.textSecondary }]}>
                    {selectedScheduleEvent?.date ?? 'MAR 03, 10AM'}
                  </Text>
                </View>
              </View>
            )}

            {/* Section 2: Horizontal scroll pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.schedulePillsContent}
              style={styles.schedulePillsScroll}
            >
              <TouchableOpacity style={[styles.schedulePill, styles.schedulePillMenu]}>
                <Ionicons name="menu" size={20} color={theme.colors.text} />
              </TouchableOpacity>
              {SCHEDULE_STAGES.map((stage, index) => (
                <TouchableOpacity
                  key={stage}
                  style={[
                    styles.schedulePill,
                    selectedStageIndex === index ? styles.schedulePillSelected : styles.schedulePillDefault,
                  ]}
                  onPress={() => setSelectedStageIndex(index)}
                >
                  <Text
                    style={[
                      styles.schedulePillText,
                      { color: selectedStageIndex === index ? theme.colors.text : theme.colors.textSecondary },
                    ]}
                  >
                    {stage}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Section 3: Vertical scroll - time markers + event cards (match image) */}
            <ScrollView
              style={styles.scheduleListScroll}
              contentContainerStyle={styles.scheduleListContent}
              showsVerticalScrollIndicator={true}
            >
              {SCHEDULE_SLOTS.map((slot) => (
                <View key={slot.time} style={styles.scheduleSlotRow}>
                  <Text style={styles.scheduleTimeMarker}>{slot.time}</Text>
                  <View style={styles.scheduleSlotCards}>
                    {slot.items.map((item, idx) => (
                      <TouchableOpacity
                        key={`${slot.time}-${idx}`}
                        style={styles.scheduleItemCard}
                        activeOpacity={0.8}
                      >
                        <View style={styles.scheduleItemCardBody}>
                          <Text style={styles.scheduleItemStage}>{item.stage}</Text>
                          <Text style={styles.scheduleItemArtist}>{item.artist}</Text>
                        </View>
                        <TouchableOpacity style={styles.scheduleItemAddBtn} hitSlop={8}>
                          <Ionicons name={item.added ? 'checkmark' : 'add'} size={20} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Save button: only when Curate My LineUp (lineup mode) */}
            {scheduleModalMode === 'lineup' && (
              <TouchableOpacity
                style={styles.scheduleModalSaveBtn}
                activeOpacity={0.8}
                onPress={() => closeScheduleModal()}
              >
                <Text style={styles.scheduleModalSaveBtnText}>Save</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeTop: {
    marginBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: PADDING,
    marginBottom: 16,
  },
  tabRow: {
    paddingHorizontal: PADDING,
    marginBottom: 20,
  },
  tabPillWrap: {
    flexDirection: 'row',
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#E0DDD8',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  tabSegment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSegmentLeft: {
    backgroundColor: '#E0DDD8',
  },
  tabSegmentRight: {
    backgroundColor: '#E0DDD8',
  },
  tabSegmentActive: {
    borderRadius: 100,
    backgroundColor: '#1a1a1a',
  },
  tabSegmentText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabSegmentTextInactive: {
    color: '#1a1a1a',
  },
  tabSegmentTextActive: {
    color: '#FFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: PADDING,
    paddingBottom: 32,
  },
  emptyStateCard: {
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  emptyStateIconWrap: {
    marginBottom: 20,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyStateButton: {
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    minWidth: 160,
    alignItems: 'center',
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  getTicketsSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  getTicketsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 12,
  },
  getTicketsCard: {
    borderRadius: 16,
    padding: 16,
    width: SCREEN_WIDTH - PADDING * 2,
    height: SCREEN_WIDTH - PADDING * 2,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
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
    gap: 12
  },
  getTicketsHeart: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: '#1a1a1a'
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
  monthSection: {
    marginBottom: 24,
  },
  monthHeading: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  eventCardFeatured: {},
  eventCardBgImage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CARD_PADDING,
  },
  eventCardBgImageStyle: {
    borderRadius: 14,
    resizeMode: 'cover',
  },
  eventCardBgOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
  featuredGradientBase: {
    backgroundColor: '#E87D2B',
  },
  featuredGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(255, 200, 80, 0.35)',
  },
  eventCardStandard: {},
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 10,
    marginRight: 14,
  },
  eventBody: {
    flex: 1,
    gap: 4,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  eventAction: {
    fontSize: 13,
    fontWeight: '500',
  },
  eventRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 12,
    height: THUMB_SIZE,
    paddingLeft: 8,
  },
  chevronIcon: {
    marginRight: 6
  },
  heartWrap: {
    padding: 6,
    marginTop: 4,
    borderRadius: 100,
    backgroundColor: '#F2EFEB',
  },
  // Event Schedule Modal
  scheduleModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scheduleModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scheduleModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: PADDING,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    height: SCHEDULE_MODAL_HEIGHT,
    flexDirection: 'column',
  },
  scheduleModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  scheduleModalLargeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  scheduleModalSection1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scheduleThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  scheduleThumbImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  scheduleModalTitleWrap: {
    flex: 1,
  },
  scheduleModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  scheduleModalDateTime: {
    fontSize: 14,
  },
  schedulePillsScroll: {
    marginHorizontal: -PADDING,
  },
  schedulePillsContent: {
    paddingHorizontal: PADDING,
    paddingBottom: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  schedulePill: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  schedulePillMenu: {
    backgroundColor: '#E8E6E3',
  },
  schedulePillSelected: {
    backgroundColor: '#E8DDD4',
  },
  schedulePillDefault: {
    backgroundColor: '#E8E6E3',
  },
  schedulePillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleListScroll: {
    flex: 1,
    minHeight: 200,
  },
  scheduleListContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  scheduleModalSaveBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  scheduleModalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scheduleSlotRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  scheduleTimeMarker: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    width: 52,
    marginRight: 14,
  },
  scheduleSlotCards: {
    flex: 1,
    gap: 10,
  },
  scheduleItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 64,
    backgroundColor: '#F2EFEB',
  },
  scheduleItemCardBody: {
    flex: 1,
    minWidth: 0,
  },
  scheduleItemStage: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#6B6B6B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  scheduleItemArtist: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scheduleItemAddBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScheduleScreen;
