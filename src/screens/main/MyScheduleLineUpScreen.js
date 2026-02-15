import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMyLineups } from '../../services/lineupService';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_COVER_IMAGE = require('../../../assets/images/cover2.png');
const PADDING = 20;

const MyScheduleLineUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const paramEvent = route.params?.event;

  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState(null);
  const [lineups, setLineups] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentLineup = lineups[selectedIndex] || null;
  const event = currentLineup?.event || paramEvent || { title: 'fastivalle', date: 'MAR 03, 10AM' };
  const lineupSlots = currentLineup?.slots ?? [];

  const loadLineups = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setLineups([]);
      return;
    }
    try {
      setError(null);
      const data = await getMyLineups();
      setLineups(data || []);
      // Select lineup matching paramEvent if provided
      if (paramEvent?.id && Array.isArray(data)) {
        const idx = data.findIndex((l) => l.event?.id === paramEvent.id);
        setSelectedIndex(idx >= 0 ? idx : 0);
      } else {
        setSelectedIndex(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load lineup');
      setLineups([]);
    } finally {
      setLoading(false);
    }
  }, [user, paramEvent?.id]);

  useEffect(() => {
    loadLineups();
  }, [loadLineups]);

  const goPrev = () => {
    if (lineups.length > 0) {
      setSelectedIndex((i) => (i <= 0 ? lineups.length - 1 : i - 1));
    }
  };
  const goNext = () => {
    if (lineups.length > 0) {
      setSelectedIndex((i) => (i >= lineups.length - 1 ? 0 : i + 1));
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <SafeAreaView style={styles.safeTop} edges={['top']} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.emptyTitle}>Sign in to view your lineup</Text>
        <Text style={styles.emptyDesc}>Log in to curate and view your schedule.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <SafeAreaView style={styles.safeTop} edges={['top']} />
        <ActivityIndicator size="large" color="#E87D2B" />
        <Text style={styles.loadingText}>Loading your lineup...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <SafeAreaView style={styles.safeTop} edges={['top']} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Ionicons name="alert-circle-outline" size={48} color="#999" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); loadLineups(); }}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (lineups.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeTop} edges={['top']} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
            <Text style={styles.headerTitle}>My Schedule</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.centered, { flex: 1 }]}>
          <Ionicons name="calendar-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No lineup yet</Text>
          <Text style={styles.emptyDesc}>Curate your lineup from the Schedule screen.</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Schedule')}
          >
            <Text style={styles.browseBtnText}>Browse Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Header: Back | My Schedule | Edit LineUp */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          <Text style={styles.headerTitle}>My Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editLineUpBtn}
          onPress={() => navigation.navigate('Schedule')}
        >
          <Text style={styles.editLineUpText}>Edit LineUp</Text>
        </TouchableOpacity>
      </View>

      {/* Festival banner */}
      <View style={styles.banner}>
        <TouchableOpacity style={styles.bannerArrow} hitSlop={8} onPress={goPrev}>
          <Ionicons name="chevron-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.bannerIcon}>
          <Image
            source={event.coverImage ? { uri: event.coverImage } : DEFAULT_COVER_IMAGE}
            style={styles.bannerIconImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerTitle}>{event.title} Line Up</Text>
          <Text style={styles.bannerDate}>{event.date}</Text>
        </View>
        <TouchableOpacity style={styles.bannerArrow} hitSlop={8} onPress={goNext}>
          <Ionicons name="chevron-forward" size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* Schedule list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {lineupSlots.map((slot) => (
          <View key={slot.time} style={styles.slotRow}>
            <Text style={styles.timeMarker}>{slot.time}</Text>
            <View style={styles.slotCards}>
              {slot.items.map((item, idx) => (
                <View key={`${slot.time}-${idx}`} style={styles.itemCard}>
                  <View style={styles.itemCardBody}>
                    <Text style={styles.itemStage}>{item.stage}</Text>
                    <Text style={styles.itemArtist}>{item.artist}</Text>
                  </View>
                  <View style={styles.itemCheckBtn}>
                    <Ionicons name="checkmark" size={20} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  safeTop: {
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E6E3',
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 6,
  },
  editLineUpBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  editLineUpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E87D2B',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginTop: 16,
    borderRadius: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  bannerArrow: {
    padding: 4,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  bannerIconImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  bannerDate: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: PADDING,
    paddingTop: 20,
    paddingBottom: 40,
  },
  slotRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  timeMarker: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    width: 52,
    marginRight: 14,
  },
  slotCards: {
    flex: 1,
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 64,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  itemCardBody: {
    flex: 1,
    minWidth: 0,
  },
  itemStage: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#6B6B6B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  itemArtist: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  itemCheckBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2EFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: '#E87D2B',
  },
  retryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  browseBtn: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    backgroundColor: '#E87D2B',
  },
  browseBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyScheduleLineUpScreen;
