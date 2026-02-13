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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 20;

const DEFAULT_BIO =
  'Andrew Williamson is a worship leader and songwriter focused on Scripture-centered worship and honest, prayerful moments. He serves his local church, writes songs for congregational singing, and carries a heart for spiritual renewal - helping people slow down, refocus, and draw near to God.';

const SOCIAL_ICONS = [
  { key: 'instagram', icon: 'logo-instagram' },
  { key: 'facebook', icon: 'logo-facebook' },
  { key: 'youtube', icon: 'logo-youtube' },
  { key: 'spotify', icon: 'logo-spotify' },
];

const UPCOMING_EVENTS = [
  {
    id: '1',
    date: 'AUG 15, 10:00AM',
    attendees: 54,
    title: 'kingdom community meetup',
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

const NEXT_APPEARANCE = [
  { id: '1', dateTime: 'AUG 15, 12:00AM', title: 'kingdom community meetup' },
  { id: '2', dateTime: 'AUG 15, 6:00PM', title: 'evening of hope' },
  { id: '3', dateTime: 'AUG 16, 8:00PM', title: 'fasting focus weekend' },
];

const ArtistDetailScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const [likedNext, setLikedNext] = useState({});
  const artist = route.params?.artist || {
    id: '1',
    name: 'Andrew Williamson',
    imageColor: '#5C5C5C',
  };

  const releaseTitle = 'Heaven in the Room';
  const releaseYear = '2025';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: same structure as EventScreen — image, gradient overlay, content */}
        <View style={styles.topSection}>
          <View style={styles.topSectionView1}>
            <ImageBackground
              source={require('../../../assets/images/person.png')}
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
            />
            <View style={styles.topSectionSpacer} />
          </View>
          <Image
            source={require('../../../assets/images/event_gradient.png')}
            style={styles.gradientOverlay}
            resizeMode="stretch"
          />
          <View style={[styles.topSectionContent, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerBack}
                hitSlop={12}
              >
                <Ionicons name="chevron-back" size={24} color="#FFF" />
                <Text style={styles.headerBackText}>Youth Revival</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn} hitSlop={12}>
                <Ionicons name="share-outline" size={22} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
              <View style={styles.albumCard}>
                <Image
                  source={require('../../../assets/images/artist_photo.png')}
                  style={styles.albumArt}
                  resizeMode="cover"
                />
                <Text style={styles.albumTitle}>{releaseTitle}</Text>
                <Text style={styles.albumYear}>{releaseYear}</Text>
              </View>
              <View style={styles.heroBottomRow}>
                <Text style={styles.artistNameHero}>{artist.name}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content on light background: Bio, Read More, Social — Upcoming Events unchanged */}
        <View style={styles.contentSection}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.bioText} numberOfLines={4}>{DEFAULT_BIO}</Text>
            <TouchableOpacity style={styles.readMoreWrap} activeOpacity={0.8}>
              <Text style={styles.readMoreText}>Read More</Text>
              <Ionicons name="chevron-down" size={18} color="#E87D2B" />
            </TouchableOpacity>
          </View>
          <View style={styles.socialRow}>
            {SOCIAL_ICONS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.socialBtn}
              >
                <Ionicons name={item.icon} size={22} color="#FFF" />
              </TouchableOpacity>
            ))}
          </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.eventsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Upcoming Events
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.colors.textLink }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {UPCOMING_EVENTS.map((ev) => (
            <TouchableOpacity
              key={ev.id}
              style={styles.eventCard}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('Event', {
                  event: {
                    id: ev.id,
                    date: ev.date,
                    attendees: ev.attendees,
                    title: ev.title,
                    subtitle: ev.subtitle,
                    stage: ev.stage,
                  },
                })
              }
            >
              <ImageBackground
                source={require('../../../assets/images/cover.png')}
                style={styles.eventCardBackground}
                imageStyle={styles.eventCardImageStyle}
              >
                <View style={styles.eventCardOverlay} />
                <View style={styles.eventCardContent}>
                  <View style={styles.eventCardTop}>
                    <Text style={styles.eventDate}>{ev.date}</Text>
                    <View style={styles.eventAttendees}>
                      <Ionicons name="people" size={14} color="#FFF" />
                      <Text style={styles.eventAttendeesText}>{ev.attendees}</Text>
                    </View>
                  </View>
                  <Text style={styles.eventCardTitle}>{ev.title}</Text>
                  <View style={styles.normalSpacer}/>
                  <Text style={styles.eventCardMeta}>{ev.subtitle}</Text>
                  <Text style={styles.eventCardMeta}>{ev.stage}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Appearance</Text>
          {NEXT_APPEARANCE.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.nextAppearanceCard}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('Event', {
                  event: {
                    id: item.id,
                    date: item.dateTime,
                    title: item.title,
                  },
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
                  <Text style={styles.nextAppearanceDateTime}>{item.dateTime}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#666" style={styles.forwardIcon}/>
                </View>
                <View style={styles.nextAppearanceRow}>
                  <Text style={styles.nextAppearanceTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    hitSlop={12}
                    style={styles.likedBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      setLikedNext((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                    }}
                  >
                    <Ionicons
                      name={likedNext[item.id] ? 'heart' : 'heart-outline'}
                      size={22}
                      color={likedNext[item.id] ? '#E87D2B' : '#666'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        </View>
        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

const HERO_ASPECT = 0.85;
const GRADIENT_HEIGHT_RATIO = 0.55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFEB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topSection: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.5,
    overflow: 'hidden',
  },
  topSectionView1: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  heroImage: {
    flex: 1,
    width: '100%',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  topSectionSpacer: {
    height: SCREEN_WIDTH * 0.2,
    width: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_WIDTH,
  },
  topSectionContent: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: PADDING,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackText: {
    color: '#FFF',
    fontSize: 17,
    marginLeft: 4,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  artistNameHero: {
    color: '#1a1a1a',
    fontSize: 42,
    fontWeight: '700',
    maxWidth: SCREEN_WIDTH * 0.5,
  },
  albumCard: {
    width: '100%',
    borderRadius: 12,
    alignItems: 'flex-end',
  },
  albumArt: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  albumYear: {
    fontSize: 14,
    marginTop: 2,
  },
  contentSection: {
    paddingHorizontal: PADDING,
    marginTop: -8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
  },
  section: {
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  readMoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  readMoreText: {
    color: '#E87D2B',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 28,
    gap: 10,
  },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  eventCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 4 },
    }),
  },
  eventCardBackground: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventCardImageStyle: {
    borderRadius: 16,
    resizeMode: 'cover',
  },
  eventCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232, 125, 43, 0.75)',
    borderRadius: 16,
  },
  eventCardContent: {
    padding: 20,
  },
  eventCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventAttendeesText: {
    color: '#FFF',
    fontSize: 14,
  },
  eventCardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  eventCardMeta: {
    textAlign: 'right',
    color: '#FFF',
    fontSize: 12,
    marginBottom: 2,
  },
  normalSpacer: {
    height: 12
  },
  forwardIcon: {
    marginRight: 12
  },
  nextAppearanceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
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
    color: '#666',
    marginRight: 8,
  },
  nextAppearanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  likedBtn: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#F2EFEB',
  },
  bottomPad: {
    height: 24,
  },
});

export default ArtistDetailScreen;
