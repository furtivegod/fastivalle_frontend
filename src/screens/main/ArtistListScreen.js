import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getArtists } from '../../services/artistService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 20;
const GRID_GAP = 6;
const ARTIST_CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GRID_GAP) / 2;

const ArtistListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artists, setArtists] = useState([]);

  const loadArtists = useCallback(async () => {
    try {
      setError(null);
      const data = await getArtists(searchQuery);
      setArtists(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load artists');
      setArtists([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(loadArtists, searchQuery ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadArtists, searchQuery]);

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

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Loading artists...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorWrap}>
            <Ionicons name="alert-circle-outline" size={40} color="rgba(255,255,255,0.8)" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); loadArtists(); }}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
        <View style={styles.artistRow}>
          {artists.map((artist) => (
            <TouchableOpacity
              key={artist.id}
              style={styles.artistCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ArtistDetail', { artist })}
            >
              <Image
                source={artist.profileImage ? { uri: artist.profileImage } : require('../../../assets/images/person.png')}
                style={styles.artistCardImage}
                resizeMode="cover"
              />
              <Text style={styles.artistCardName} numberOfLines={1}>
                {artist.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        )}

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
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  errorWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  retryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ArtistListScreen;
