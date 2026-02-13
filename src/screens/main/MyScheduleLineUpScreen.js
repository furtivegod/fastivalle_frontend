import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Text } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 20;

const LINEUP_SLOTS = [
  { time: '10:00', items: [{ stage: 'R&B MAINSTAGE', artist: 'tauren wells', added: true }] },
  { time: '11:00', items: [
    { stage: 'R&B MAINSTAGE', artist: 'rocky & the queen', added: true },
    { stage: 'CCM GARDEN', artist: 'heart & soul', added: true },
  ]},
  { time: '15:00', items: [{ stage: 'FOLK ORANGE', artist: 'rocky & the queen', added: true }] },
  { time: '17:00', items: [{ stage: 'FOLK ORANGE', artist: 'rocky & the queen', added: true }] },
  { time: '21:00', items: [{ stage: 'FOLK ORANGE', artist: 'rocky & the queen', added: true }] },
];

const MyScheduleLineUpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const event = route.params?.event || { title: 'fastivalle', date: 'MAR 03, 10AM' };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Header: Back | My Schedule | Edit LineUp */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
          <Text style={styles.headerTitle}>My Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.editLineUpBtn}>
          <Text style={styles.editLineUpText}>Edit LineUp</Text>
        </TouchableOpacity>
      </View>

      {/* Festival banner */}
      <View style={styles.banner}>
        <TouchableOpacity style={styles.bannerArrow} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.bannerIcon}>
          <Image
            source={require('../../../assets/images/cover2.png')}
            style={styles.bannerIconImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerTitle}>{event.title} Line Up</Text>
          <Text style={styles.bannerDate}>{event.date}</Text>
        </View>
        <TouchableOpacity style={styles.bannerArrow} hitSlop={8}>
          <Ionicons name="chevron-forward" size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* Schedule list (same structure as modal section 3) */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {LINEUP_SLOTS.map((slot) => (
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
    paddingHorizontal: 0,
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
});

export default MyScheduleLineUpScreen;
