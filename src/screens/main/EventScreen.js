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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { BlurView } from '@react-native-community/blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_ASPECT = 16 / 10;

const DESCRIPTION_TEXT =
  "If you can keep your head when all about you are losing theirs and blaming it on you; if you can trust yourself when all men doubt you, but make allowance for their doubting too; if you can wait and not be tired by waiting...";

const ACCESSIBILITY_ITEMS = [
  { key: 'wheelchair', label: 'Wheelchair Accessible', icon: 'accessibility-outline' },
  { key: 'captioning', label: 'Captioning', icon: 'closed-captioning-outline' },
  { key: 'hearing', label: 'Hearing Assistance', icon: 'ear-outline' },
  { key: 'animals', label: 'Animals Allowed', icon: 'paw-outline' },
];

const SOCIAL_ITEMS = [
  { key: 'instagram', icon: 'logo-instagram' },
  { key: 'facebook', icon: 'logo-facebook' },
  { key: 'youtube', icon: 'logo-youtube' },
  { key: 'spotify', icon: 'logo-spotify' },
];

const EVENT_LINEUP = [
  { date: 'Aug 15', times: [
    { time: '10:00', items: [
      { stage: 'R&B MAINSTAGE', artist: 'tauren wells' },
      { stage: 'FOLK ORANGE', artist: 'rocky & the queen' },
    ]},
    { time: '11:00', items: [
      { stage: 'MARKET GARDEN', artist: 'pop up' },
    ]},
  ]},
  { date: 'Aug 16', times: [
    { time: '10:00', items: [
      { stage: 'MAIN STAGE', artist: 'worship collective' },
    ]},
  ]},
];

const ARTISTS = [
  { id: '1', name: 'Mike Howard', imageColor: '#5C5C5C' },
  { id: '2', name: 'Annette Smith', imageColor: '#8B7355' },
  { id: '3', name: 'Andrew Jones', imageColor: '#4A6B8A' },
];
const ARTIST_CARD_WIDTH = 140;
const ARTIST_IMAGE_ASPECT = 1;

const EVENT_ADDRESS = '1234 Sunset Blvd, Los Angeles, CA 90028';

const PartnerLogos = require('../../../assets/logo');
const PARTNERS = [
  { id: '1', name: 'Partner 1', logo: PartnerLogos.logo1 },
  { id: '2', name: 'Partner 2', logo: PartnerLogos.logo2 },
  { id: '3', name: 'Partner 3', logo: PartnerLogos.logo3 },
  { id: '4', name: 'Partner 4', logo: PartnerLogos.logo4 },
  { id: '5', name: 'Partner 5', logo: PartnerLogos.logo5 },
  { id: '6', name: 'Partner 6', logo: PartnerLogos.logo6 },
];

const POSTS = [
  { id: '1', name: 'Sarah M.', timeAgo: '2h ago', text: 'So excited for this event! Can\'t wait to worship together.', avatarColor: '#E87D2B' },
  { id: '2', name: 'James K.', timeAgo: '5h ago', text: 'Last year was amazing. See you all there!', avatarColor: '#2D4739' },
  { id: '3', name: 'Emma L.', timeAgo: '1d ago', text: 'Bringing the whole family. So grateful for this community.', avatarColor: '#4A6B8A' },
];

const EventScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const event = route.params?.event || {
    id: '1',
    date: 'AUG 15, 10:00AM',
    attendees: 54,
    title: 'Holy Spirit Presence',
    subtitle: 'WORSHIP',
    stage: 'MAIN STAGE',
  };

  const [descriptionExpanded, setDescriptionExpanded] = useState(true);
  const [liked, setLiked] = useState(false);
  const [lineupExpanded, setLineupExpanded] = useState(true);

  const dateDisplay = event.date?.split(',')[0]?.replace('AUG', 'Aug') || 'Aug 15-18';
  const timeDisplay = event.date?.includes(',') ? event.date.split(',')[1]?.trim() || '10:00 AM' : '10:00 AM';
  const venueDisplay = event.stage || 'CAMPTOWN';
  const interestedCount = event.attendees || 64;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top section: 3 views — (1) cover + 40px spacer, (2) gradient overlay at bottom, (3) content */}
        <View style={styles.topSection}>
          {/* View 1: cover.png + empty 40px view */}
          <View style={styles.topSectionView1}>
            <ImageBackground
              source={require('../../../assets/images/cover.png')}
              style={styles.coverImage}
              imageStyle={styles.heroImageStyle}
            />
            <View style={styles.topSectionSpacer} />
          </View>
          {/* View 2: overlays view 1, at bottom of top section */}
          <Image
            source={require('../../../assets/images/event_gradient.png')}
            style={styles.gradientOverlay}
            resizeMode="stretch"
          />
          {/* View 3: overlays view 2, top section content */}
          <View style={styles.topSectionContent} pointerEvents="box-none">
            <View style={styles.area1}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn} hitSlop={12}>
                  <Ionicons name="chevron-back" size={24} color="#FFF" />
                  <Text style={styles.headerBackText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.headerRight}>
                  <TouchableOpacity style={styles.headerIconBtn} hitSlop={12}>
                    <Ionicons name="share-outline" size={20} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerIconBtn} hitSlop={12}>
                    <Ionicons name="add" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{event.title}</Text>
                <Text style={styles.heroSubTitle}>INTERESTED IN</Text>
                <View style={styles.interestedRow}>
                  <View style={styles.avatarRow}>
                    {[1, 2, 3, 4].map((i) => (
                      <View key={i} style={[styles.avatar, { marginLeft: i > 1 ? -8 : 0 }]}>
                        <Image
                          source={require('../../../assets/images/person.png')}
                          style={styles.avatarImage}
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                    <View style={styles.avatarBadge}>
                      <Text style={styles.avatarBadgeText}>+{interestedCount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.area2}>
              <View style={styles.heroDetailsWrap}>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailBlock}>
                    <Text style={styles.detailLabel}>DATE</Text>
                    <Text style={styles.detailValue}>{dateDisplay}</Text>
                  </View>
                  <View style={styles.detailBlock}>
                    <Text style={styles.detailLabel}>TIME</Text>
                    <Text style={styles.detailValue}>{timeDisplay}</Text>
                  </View>
                  <View style={styles.detailBlock}>
                    <Text style={styles.detailLabel}>VENUE</Text>
                    <Text style={styles.detailValue}>{venueDisplay}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.ctaRow}>
                <TouchableOpacity
                  style={[styles.heartBtn, { backgroundColor: theme.colors.text }]}
                  onPress={() => setLiked(!liked)}
                  hitSlop={12}
                >
                  <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={28}
                    color="#FFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.getTicketBtn, { backgroundColor: theme.colors.text }]}
                  onPress={() => navigation.navigate('GetTicket', { event })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getTicketBtnText}>Get Ticket</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
          <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
            {DESCRIPTION_TEXT}
          </Text>
          <TouchableOpacity
            style={styles.readLessRow}
            onPress={() => setDescriptionExpanded(!descriptionExpanded)}
          >
            <Text style={[styles.readLessText, { color: theme.colors.textLink }]}>
              {descriptionExpanded ? 'Read Less' : 'Read More'}
            </Text>
            <Ionicons
              name={descriptionExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.colors.textLink}
            />
          </TouchableOpacity>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <View style={styles.accessibilityRow}>
            {ACCESSIBILITY_ITEMS.map((item) => (
              <View
                key={item.key}
                style={[styles.accessibilityPill, { backgroundColor: theme.colors.borderLight }]}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={theme.colors.text}
                  style={styles.accessibilityIcon}
                />
                <Text style={[styles.accessibilityLabel, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social */}
        <View style={[styles.section, styles.socialSection]}>
          <View style={styles.socialRow}>
            {SOCIAL_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.socialBtn, { backgroundColor: theme.colors.text }]}
              >
                <Ionicons name={item.icon} size={24} color="#FFF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Event Line Up */}
        <View style={styles.lineupSection}>
          <ImageBackground
            source={require('../../../assets/images/gradient1.png')}
            style={styles.lineupGradient}
            imageStyle={styles.lineupGradientImageStyle}
          >
          <View style={styles.lineupContent}>
            <Text style={styles.lineupTitle}>Event Line Up</Text>
            {EVENT_LINEUP.map((day) => (
              <View key={day.date} style={styles.lineupDateBlock}>
                <Text style={styles.lineupDate}>{day.date}</Text>
                {day.times.map((slot) => (
                  <View key={`${day.date}-${slot.time}`} style={styles.lineupTimeBlock}>
                    <Text style={styles.lineupTime}>{slot.time}</Text>
                    {slot.items.map((item, idx) => (
                      <View
                        key={`${slot.time}-${idx}`}
                        style={[styles.lineupCard, { backgroundColor: theme.colors.surface }]}
                      >
                        <View style={styles.lineupCardLeft}>
                          <Text style={[styles.lineupCardStage, { color: theme.colors.textSecondary }]}>
                            {item.stage}
                          </Text>
                          <Text style={[styles.lineupCardArtist, { color: theme.colors.text }]}>
                            {item.artist}
                          </Text>
                        </View>
                        <TouchableOpacity style={[styles.lineupAddBtn, { backgroundColor: theme.colors.borderLight }]}>
                          <Ionicons name="add" size={22} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
            <TouchableOpacity
              style={styles.seeLessRow}
              onPress={() => setLineupExpanded(!lineupExpanded)}
            >
              <Text style={styles.seeLessText}>See Less</Text>
              <Ionicons name="chevron-up" size={18} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
          </ImageBackground>
        </View>

        {/* Support the movement - same as Home screen */}
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

        {/* Artists */}
        <View style={styles.artistsSection}>
          <View style={styles.artistsHeader}>
            <Text style={[styles.artistsTitle, { color: theme.colors.text }]}>Artists</Text>
            <TouchableOpacity
              style={styles.seeAllWrap}
              onPress={() => navigation.navigate('ArtistList')}
              activeOpacity={0.8}
            >
              <Text style={[styles.seeAllText, { color: theme.colors.textLink }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistsScrollContent}
          >
            {ARTISTS.map((artist) => (
              <TouchableOpacity
                key={artist.id}
                style={styles.artistCard}
                activeOpacity={0.9}
              >
                <Image
                  source={require('../../../assets/images/person.png')}
                  style={styles.artistImage}
                  resizeMode="cover"
                />
                <Text style={[styles.artistName, { color: theme.colors.text }]} numberOfLines={1}>
                  {artist.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Address */}
        <View style={styles.blockSection}>
          <Text style={[styles.blockSectionTitle, { color: theme.colors.text }]}>Address</Text>
          <View style={[styles.addressCard, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="location-outline" size={22} color={theme.colors.textLink} />
            <Text style={[styles.addressText, { color: theme.colors.text }]}>{EVENT_ADDRESS}</Text>
          </View>
        </View>

        {/* Partners */}
        <View style={styles.blockSection}>
          <View style={styles.partnerHeader}>
            <Text style={[styles.artistsTitle, { color: theme.colors.text }]}>Our Partners</Text>
            <TouchableOpacity
              style={styles.seeAllWrap}
              activeOpacity={0.8}
            >
              <Text style={[styles.seeAllText, { color: theme.colors.textLink }]}>See More</Text>
            </TouchableOpacity>
          </View>

          {/* <Text style={[styles.blockSectionTitle, { color: theme.colors.text }]}>Partners</Text> */}
          <View style={styles.partnersRow}>
            {PARTNERS.map((p) => (
              <View
                key={p.id}
                style={[styles.partnerCard, { backgroundColor: theme.colors.surface }]}
              >
                <Image
                  source={p.logo}
                  style={styles.partnerLogoImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Posts */}
        <View style={[styles.blockSection, styles.postsSection]}>
          <Text style={[styles.blockSectionTitle, { color: theme.colors.text }]}>Posts</Text>
          <View style={[styles.emptyStateCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.emptyStateIconWrap}>
              <Image
                source={require('../../../assets/images/GalleryFavourite.png')}
                style={styles.postGalleryImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>This is still empty</Text>
            <Text style={[styles.emptyStateDesc, { color: theme.colors.textSecondary }]}>
              It seems that no one has posted anything yet.
            </Text>
            <Text style={[styles.emptyStateDesc, { color: theme.colors.textSecondary }]}>
              Be the first to share interesting content
            </Text>
            <TouchableOpacity
              style={styles.addPostButton}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <Text style={styles.addPostButtonText}>Add Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFEB',
  },
  safeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackText: {
    color: '#FFF',
    fontSize: 17,
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topSection: {
    width: SCREEN_WIDTH,
    minHeight: SCREEN_WIDTH * 1.5,
    overflow: 'hidden',
  },
  topSectionView1: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  coverImage: {
    flex: 1,
    width: '100%',
  },
  topSectionSpacer: {
    height: SCREEN_WIDTH * 0.15,
    width: '100%',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_WIDTH * 0.85,
  },
  topSectionContent: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  area1: {
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  area2: {
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  heroContent: {
    paddingTop: SCREEN_WIDTH * 0.2,
  },
  heroDetailsWrap: {
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 54,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubTitle: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  interestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  avatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: '#FFF',
    marginLeft: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailBlock: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 10,
    gap: 16,
  },
  heartBtn: {
    padding: 10,
    borderRadius: 100,
  },
  getTicketBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
  },
  getTicketBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  readLessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readLessText: {
    fontSize: 15,
    fontWeight: '600',
  },
  accessibilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accessibilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  accessibilityIcon: {
    marginRight: 4,
  },
  accessibilityLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  socialSection: {
    paddingBottom: 24,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  socialBtn: {
    width: 38,
    height: 38,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPad: {
    height: 24,
  },
  // Event Line Up
  lineupSection: {
    marginTop: 32,
    minHeight: 400,
    position: 'relative',
  },
  lineupGradient: {
    // ...StyleSheet.absoluteFillObject,
  },
  lineupGradientImageStyle: {
    resizeMode: 'stretch',
  },
  lineupContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    position: 'relative',
  },
  lineupTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  lineupDateBlock: {
    marginBottom: 20,
  },
  lineupDate: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  lineupTimeBlock: {
    marginBottom: 16,
  },
  lineupTime: {
    color: '#FFF',
    fontSize: 15,
    marginBottom: 8,
  },
  lineupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 4 },
    }),
  },
  lineupCardLeft: {
    flex: 1,
    minWidth: 0,
  },
  lineupCardStage: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  lineupCardArtist: {
    fontSize: 17,
    fontWeight: '700',
  },
  lineupAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  seeLessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  seeLessText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '600',
  },
  // Support the movement (same as Home)
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
  // Artists
  artistsSection: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  artistsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  artistsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllWrap: {
    alignItems: 'flex-end',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  seeAllUnderline: {
    height: 2,
    marginTop: 2,
    width: '100%',
  },
  artistsScrollContent: {
    paddingHorizontal: 20,
  },
  artistCard: {
    width: ARTIST_CARD_WIDTH,
    marginRight: 12,
  },
  artistImage: {
    width: ARTIST_CARD_WIDTH,
    height: ARTIST_CARD_WIDTH,
    aspectRatio: ARTIST_IMAGE_ASPECT,
    borderRadius: 12,
    marginBottom: 10,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Address, Partners, Posts
  blockSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  blockSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  partnersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  partnerCard: {
    width: (SCREEN_WIDTH - 40 - 12) / 2,
    borderRadius: 12,
  },
  partnerLogo: {
    width: (SCREEN_WIDTH - 40 - 12) / 2,
    height: 88,
    borderRadius: 8,
    marginBottom: 8,
  },
  partnerLogoImage: {
    width: (SCREEN_WIDTH - 40 - 12) / 2,
    height: 64,
    borderRadius: 8,
  },
  partnerName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  postsSection: {
    paddingBottom: 32,
  },
  emptyStateCard: {
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  emptyStateIconWrap: {
    position: 'relative',
    marginBottom: 20,
  },
  emptyStateHeartIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
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
  addPostButton: {
    marginTop: 20,
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },
  addPostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  postGalleryImage: {
  },
  postCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postMeta: {
    flex: 1,
  },
  postName: {
    fontSize: 15,
    fontWeight: '700',
  },
  postTime: {
    fontSize: 13,
    marginTop: 2,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default EventScreen;
