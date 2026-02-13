import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { Text } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { BlurView } from '@react-native-community/blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const PADDING = 20;
const UPCOMING_CARD_SIZE = SCREEN_WIDTH - PADDING * 2;
const MERCH_CARD_WIDTH = SCREEN_WIDTH * 0.45;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [upcomingLiked, setUpcomingLiked] = useState({});
  const [popularLiked, setPopularLiked] = useState({});

  const toggleUpcomingLiked = (eventId) => {
    setUpcomingLiked((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };
  const togglePopularLiked = (eventId) => {
    setPopularLiked((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const upcomingEvents = [
    {
      id: '1',
      date: 'AUG 15, 10:00AM',
      attendees: 54,
      title: 'kingdom community...',
      subtitle: 'WORSHIP',
      stage: 'MAIN STAGE',
    },
    {
      id: '2',
      date: 'AUG 16, 2:00PM',
      attendees: 32,
      title: 'praise & worship',
      subtitle: 'WORSHIP',
      stage: 'MAIN STAGE',
    },
  ];

  const merchItems = [
    {
      id: '1',
      tag: 'NEW IN',
      tagColor: theme.colors.primary,
      title: 'wave of worship fasti...',
      price: '29 USD',
      liked: true,
      image: require('../../../assets/images/merch1.png'),
    },
    {
      id: '2',
      tag: 'LIMITED',
      tagColor: theme.colors.accent,
      title: 'black cotton t-shirt for such...',
      price: '35 USD',
      liked: false,
      image: require('../../../assets/images/merch2.png'),
    },
  ];

  const popularEvents = [
    { id: '1', date: 'AUG 15, 12:00AM', title: 'kingdom community mee...', liked: true, imageColor: '#E87D2B' },
    { id: '2', date: 'AUG 15, 6:00PM', title: 'evening of hope', liked: true, imageColor: '#D4A84B' },
    { id: '3', date: 'AUG 16, 8:00PM', title: 'fasting focus weekend', liked: false, imageColor: '#2D4739' },
  ];

  const highlights = [
    {
      id: '1',
      name: 'Ashley Lubin',
      timeAgo: '5h ago',
      eventName: 'Fasting Focus Weekend',
      caption: 'So much peace, so much love – grateful to be part of this moment.',
      likes: 124,
      comments: 8,
      liked: true,
      mediaCount: 3,
    },
    {
      id: '2',
      name: 'Avery Collins',
      timeAgo: '10h ago',
      eventName: 'Kingdom Community Meetup',
      caption: 'So thankful to worship together. My soul feels lighter.',
      likes: 16,
      comments: 4,
      liked: false,
      mediaCount: 3,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Top header: name + notification + avatar when logged in; login button when not */}
      <View style={[styles.homeHeader, { backgroundColor: theme.colors.background }]}>
        {isLoggedIn ? (
          <>
            <Text style={[styles.homeHeaderName, { color: theme.colors.text }]} numberOfLines={1}>
              hi,{user?.name || 'User'}
            </Text>
            <View style={styles.homeHeaderRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={styles.headerIconBtn}
                hitSlop={12}
              >
                <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.headerAvatarWrap}
                activeOpacity={0.8}
              >
                {user?.profileImage ? (
                  <Image source={{ uri: user.profileImage }} style={styles.headerAvatar} />
                ) : (
                  <View style={[styles.headerAvatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.headerAvatarLetter}>
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.homeHeaderSpacer} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={[styles.headerLoginCircle, { backgroundColor: theme.colors.forest }]}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Section 2: Three pressable areas */}
      <View style={[styles.section2, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.quickButton, { backgroundColor: theme.colors.surface }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('MyTickets')}
        >
          <Ionicons name="ticket" size={22} />
          <Text style={[styles.quickButtonText, { color: theme.colors.text }]}>tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickButton, { backgroundColor: theme.colors.surface }]} activeOpacity={0.7}>
          <Ionicons name="gift" size={22} />
          <Text style={[styles.quickButtonText, { color: theme.colors.text }]}>giving</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickButton, { backgroundColor: theme.colors.surface }]} activeOpacity={0.7}>
          <Ionicons name="people" size={22} />
          <Text style={[styles.quickButtonText, { color: theme.colors.text }]}>vallenteer</Text>
        </TouchableOpacity>
      </View>

      {/* Section 3: Upcoming Events — same card as Schedule "Get Tickets For More Moments" */}
      <View style={[styles.section3, styles.getTicketsSection, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.getTicketsTitle, { color: theme.colors.text }]}>Upcoming Events</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScrollContent}
        >
          {upcomingEvents.map((event) => {
            const liked = upcomingLiked[event.id] ?? false;
            return (
              <TouchableOpacity
                key={event.id}
                style={styles.getTicketsCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Event', { event })}
              >
                <ImageBackground
                  source={require('../../../assets/images/cover.png')}
                  style={StyleSheet.absoluteFill}
                  imageStyle={styles.getTicketsCardImageStyle}
                >
                  <View style={styles.getTicketsCardOverlay} />
                </ImageBackground>
                <View style={styles.getTicketsCardTop}>
                  <Text style={styles.getTicketsDate}>{event.date}</Text>
                  <View style={styles.getTicketsAttendees}>
                    <Ionicons name="people" size={14} color="#FFF" />
                    <Text style={styles.getTicketsAttendeesText}>{event.attendees}</Text>
                  </View>
                </View>
                <Text style={styles.getTicketsCardTitle}>{event.title}</Text>
                <Text style={styles.getTicketsCardSub}>{event.subtitle}</Text>
                <Text style={styles.getTicketsCardStage}>{event.stage}</Text>
                <View style={styles.getTicketsCardActions}>
                  <TouchableOpacity
                    style={styles.getTicketsHeart}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    onPress={() => toggleUpcomingLiked(event.id)}
                  >
                    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.getTicketBtn, { backgroundColor: theme.colors.text }]}
                    onPress={() =>
                      liked
                        ? navigation.navigate('Schedule', { openMySchedule: true })
                        : navigation.navigate('GetTicket', { event })
                    }
                  >
                    <Text style={styles.getTicketBtnText}>
                      {liked ? 'Curate Line Up' : 'Get Ticket'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Section 4: Merch */}
      <View style={[styles.section4, { backgroundColor: theme.colors.background }]}>
        <View style={styles.section4Header}>
          <Text style={[styles.section4Title, { color: theme.colors.text }]}>Merch</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Merch')}>
            <Text style={[styles.seeMore, { color: theme.colors.textLink }]}>See More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.merchScrollContent}
        >
          {merchItems.map((item) => {
            const priceParts = (item.price || '0 USD').split(/\s+/);
            const priceNumber = priceParts[0] || '0';
            const priceUnit = priceParts.slice(1).join(' ') || 'USD';
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.merchCard}
                activeOpacity={0.9}
              >
                <View style={styles.merchCardImage}>
                  <Image
                    source={item.image}
                    style={styles.merchCardImageFill}
                    resizeMode="cover"
                  />
                  <View style={[styles.merchTag, { backgroundColor: item.tagColor }]}>
                    <Text style={styles.merchTagText}>{item.tag}</Text>
                  </View>
                  <TouchableOpacity style={styles.merchHeart} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                    <Ionicons
                      name={item.liked ? 'heart' : 'heart-outline'}
                      size={22}
                      color={item.liked ? theme.colors.heartActive : theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.merchCardFooter}>
                  <Text
                    style={[styles.merchTitle, { color: theme.colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  <View style={styles.merchPriceWrap}>
                    <Text style={[styles.merchPriceNumber, { color: theme.colors.text }]}>{priceNumber}</Text>
                    <Text style={[styles.merchPriceUnit, { color: theme.colors.text }]}>{priceUnit}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Section 5: Support the movement - Lottie + blurred overlay */}
      <View style={[styles.section5, styles.section5Banner, { backgroundColor: theme.colors.forest }]}>
        <View style={styles.section5LottieWrap} pointerEvents="none">
          <LottieView
            source={require('../../../assets/lottie/ban_sup.json')}
            autoPlay
            loop
            style={styles.section5Lottie}
          />
        </View>
        <View style={styles.section5OverlayWrap} pointerEvents="none">
          <BlurView blurType="light" blurAmount={8} style={StyleSheet.absoluteFillObject} />
          <View style={styles.section5Overlay} />
        </View>
        <View style={styles.section5Content}>
          <Text style={styles.section5Title}>support the movement</Text>
          <TouchableOpacity style={styles.supportButton} activeOpacity={0.8}>
            <Text style={[styles.supportButtonText, { color: theme.colors.text }]}>Support Us</Text>
          </TouchableOpacity>
          <Text style={styles.section5Footer}>LAST GIFT: 2 WEEKS AGO</Text>
        </View>
      </View>

      {/* Section 6: Festival Popular Events — same as Next Appearance in Artist Detail */}
      <View style={[styles.section6, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.section6Title, { color: theme.colors.text }]}>Festival Popular Events</Text>
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
        <TouchableOpacity
          style={styles.seeAllEventsWrap}
          onPress={() => navigation.navigate('Schedule')}
        >
          <Text style={[styles.seeAllEvents, { color: theme.colors.textLink }]}>See All Events</Text>
        </TouchableOpacity>
      </View>

      {/* Section 7: Highlights */}
      <View style={[styles.section7, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.section4Title, { marginBottom: 18 }]}>Highlights</Text>
        {highlights.map((post) => (
          <View key={post.id} style={[styles.highlightCard, { backgroundColor: theme.colors.surface }]}>
            {/* User row */}
            <View style={styles.highlightUserRow}>
              <Image
                source={require('../../../assets/images/person.png')}
                style={styles.highlightAvatar}
                resizeMode="cover"
              />
              <View style={styles.highlightUserInfo}>
                <View style={styles.highlightNameRow}>
                  <Text style={[styles.highlightName, { color: theme.colors.text }]}>{post.name}</Text>
                  <Text style={[styles.highlightTime, { color: theme.colors.textSecondary }]}>{post.timeAgo}</Text>
                </View>
                <Text style={[styles.highlightEvent, { color: theme.colors.textSecondary }]}>{post.eventName}</Text>
              </View>
              <TouchableOpacity style={[styles.followButton, { backgroundColor: theme.colors.text }]}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlightMore}>
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {/* Media area with play overlay */}
            <View style={[styles.highlightMediaWrap, { backgroundColor: '#3A3A5C' }]}>
              <View style={styles.highlightMediaPlaceholder} />
              <View style={styles.highlightPlayButton}>
                <Ionicons name="play" size={32} color={theme.colors.text} />
              </View>
              <View style={styles.highlightMediaBadge}>
                <Text style={styles.highlightMediaBadgeText}>1/{post.mediaCount}</Text>
              </View>
            </View>
            <View style={styles.highlightCarouselDots}>
              <View style={[styles.highlightDot, styles.highlightDotActive]} />
              <View style={styles.highlightDot} />
              <View style={styles.highlightDot} />
            </View>
            {/* Caption */}
            <Text style={[styles.highlightCaption, { color: theme.colors.text }]}>{post.caption}</Text>
            {/* Interaction row */}
            <View style={styles.highlightActions}>
              <TouchableOpacity style={styles.highlightActionItem}>
                <Ionicons
                  name={post.liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={post.liked ? theme.colors.heartActive : theme.colors.textSecondary}
                />
                <Text style={[styles.highlightActionCount, { color: theme.colors.textSecondary }]}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlightActionItem}>
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
                <Text style={[styles.highlightActionCount, { color: theme.colors.textSecondary }]}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlightActionItem}>
                <Ionicons name="share-outline" size={22} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFEB',
  },
  content: {
    paddingBottom: 40,
  },
  safeTop: {
    backgroundColor: 'transparent',
  },
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  homeHeaderName: {
    fontSize: 30,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  homeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    padding: 6,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  headerAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#FFF'
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  headerAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  homeHeaderSpacer: {
    flex: 1,
  },
  headerLoginCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  quickButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  quickButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textTransform: 'lowercase',
  },
  section3: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  eventsScrollContent: {
    paddingHorizontal: PADDING,
    paddingBottom: 12,
  },
  getTicketsSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  getTicketsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 12,
    paddingHorizontal: PADDING,
  },
  getTicketsCard: {
    borderRadius: 16,
    padding: 16,
    width: UPCOMING_CARD_SIZE,
    height: UPCOMING_CARD_SIZE,
    marginRight: 16,
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
    fontSize: 44,
    lineHeight: 40,
    fontWeight: 'bold',
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
  section4: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  section4Title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section4Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeMore: {
    fontSize: 14,
    fontWeight: '600',
  },
  merchScrollContent: {
    paddingHorizontal: 20,
  },
  merchCard: {
    width: MERCH_CARD_WIDTH,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  merchCardImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  merchCardImageFill: {
    width: '100%',
    height: '100%',
  },
  merchTag: {
    position: 'absolute',
    top: 16,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  merchTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  merchHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 100,
    backgroundColor: '#F5F2EE',
  },
  merchCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 8,
    backgroundColor: '#F2EFEB',
  },
  merchTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  merchPriceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  merchPriceNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  merchPriceUnit: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
    opacity: 0.9,
  },
  section5: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  section5Banner: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  section5LottieWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section5Lottie: {
    width: '100%',
    height: '100%',
  },
  section5OverlayWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  section5Overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  section5Content: {
    flex: 1,
    width: '100%',
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
  },
  section5Title: {
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textTransform: 'lowercase',
  },
  supportButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 100,
    marginBottom: 12,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section5Footer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  section6: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
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
  seeAllEventsWrap: {
    alignSelf: 'center',
    marginTop: 16,
    alignItems: 'center',
  },
  seeAllEvents: {
    fontSize: 14,
    fontWeight: '600',
  },
  seeAllEventsUnderline: {
    height: 2,
    width: 24,
    marginTop: 4,
    borderRadius: 1,
  },
  section7: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  highlightCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  highlightUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightAvatar: {
    width: 44,
    height: 44,
    borderRadius: 100,
    marginRight: 10,
    overflow: 'hidden',
  },
  highlightUserInfo: {
    flex: 1,
    minWidth: 0,
  },
  highlightNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  highlightName: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  highlightTime: {
    fontSize: 12,
  },
  highlightEvent: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    marginRight: 8,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  highlightMore: {
    padding: 4,
  },
  highlightMediaWrap: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightMediaPlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  highlightPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightMediaBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  highlightMediaBadgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  highlightCarouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DDD',
    marginHorizontal: 3,
  },
  highlightDotActive: {
    backgroundColor: '#333',
  },
  highlightCaption: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  highlightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 4,
  },
  highlightActionCount: {
    fontSize: 14,
    marginLeft: 6,
  },
});

export default HomeScreen;
