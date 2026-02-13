import React, { useState, useMemo } from 'react';
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
import { Text, TextInput } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 20;
const GRID_GAP = 6;
const ARTIST_CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GRID_GAP) / 2;

const ARTIST_LIST = [
  { id: '1', name: 'Mike Howard', imageColor: '#5C5C5C' },
  { id: '2', name: 'Annette Smith', imageColor: '#8B7355' },
  { id: '3', name: 'Adam Brown', imageColor: '#8B6914' },
  { id: '4', name: 'Mike Howard', imageColor: '#5C5C5C' },
  { id: '5', name: 'Annette Smith', imageColor: '#8B7355' },
  { id: '6', name: 'Adam Brown', imageColor: '#8B6914' },
  { id: '7', name: 'Sarah Miller', imageColor: '#6B5B7A' },
  { id: '8', name: 'David King', imageColor: '#2D4739' },
];

const ArtistListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return ARTIST_LIST;
    const q = searchQuery.toLowerCase().trim();
    return ARTIST_LIST.filter((a) => a.name.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/gradient1.png')}
        style={styles.gradientBg}
        resizeMode="stretch"
      />

      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Header: Back + Artist List */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBack}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#FFF" />
          <Text style={styles.headerBackText}>Artist List</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Artist Lineup</Text>

        {/* Search by title (artist name) */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        {/* 2-column grid (same layout as Partners on Event screen) */}
        <View style={styles.artistRow}>
          {filteredArtists.map((artist) => (
            <TouchableOpacity
              key={artist.id}
              style={styles.artistCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ArtistDetail', { artist })}
            >
              <Image
                source={require('../../../assets/images/person.png')}
                style={styles.artistCardImage}
                resizeMode="cover"
              />
              <Text style={styles.artistCardName} numberOfLines={1}>
                {artist.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  safeTop: {
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING,
    paddingVertical: 12,
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
  scroll: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: PADDING,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 100,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  artistRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  artistCard: {
    width: ARTIST_CARD_WIDTH,
    height: ARTIST_CARD_WIDTH + 25,
    borderRadius: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  artistCardImage: {
    width: ARTIST_CARD_WIDTH,
    height: ARTIST_CARD_WIDTH,
    borderRadius: 8,
    marginBottom: 8,
  },
  artistCardName: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPad: {
    height: 24,
  },
});

export default ArtistListScreen;
