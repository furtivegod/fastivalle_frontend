import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { Text } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const BANNER_ASPECT = 16 / 10;

const PurchaseSuccessScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    event = { title: 'christian music festival', date: 'AUG 15, 10:00AM' },
    category = 'Group',
    ticketType = 'STANDARD',
    quantity = 20,
    orderNumber = '123AXQ-r4556',
  } = route.params || {};

  const handleClose = () => {
    navigation.goBack();
  };
  const handleCurateLineup = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/splash_bg.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeTop} edges={['top']} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={12}
            >
              <Ionicons name="close" size={22} />
            </TouchableOpacity>
          </View>

          <Text style={styles.successTitle}>your tickets have been purchased successfully</Text>

          <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.bannerWrap}>
              <ImageBackground
                source={require('../../../assets/images/cover.png')}
                style={styles.bannerImage}
                imageStyle={styles.bannerImageStyle}
                resizeMode='cover'
              >
                <View style={[StyleSheet.absoluteFill, styles.bannerOverlay]} />
                <View style={styles.bannerTextWrap}>
                  <Text style={styles.bannerDate}>{event.date}</Text>
                  <Text style={styles.bannerTitle}>{event.title}</Text>
                  <Text style={styles.bannerMeta}>CONCERT</Text>
                  <Text style={styles.bannerMeta}>MAIN STAGE</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.categoryRow}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryLabel}>CATEGORY</Text>
                  <View style={styles.categoryValueRow}>
                    <Text style={[styles.categoryValue, { color: theme.colors.text }]}>{category}</Text>
                    <View style={[styles.ticketTypePill, { backgroundColor: '#9E9E9E' }]}>
                      <Text style={styles.ticketTypeText}>{ticketType}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.qtyQrBlock}>
                  <Text style={[styles.qtyText, { color: theme.colors.text }]}>{quantity}x</Text>
                  <View style={styles.qrPlaceholder}>
                    <Ionicons name="qr-code-outline" size={40} color="#666" />
                  </View>
                </View>
              </View>

              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Order Number:</Text>
                <Text style={[styles.orderValue, { color: theme.colors.text }]}>{orderNumber}</Text>
              </View>

              <TouchableOpacity
                style={[styles.addToWalletButton, { backgroundColor: theme.colors.text }]}
                activeOpacity={0.8}
              >
                <Text style={styles.addToWalletText}>Add To Wallet</Text>
                <Ionicons name="wallet-outline" size={20} color="#FFF" style={styles.addToWalletIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.curatePrompt}>don't forget to curate your event lineup</Text>
          <TouchableOpacity
            style={styles.curateButton}
            onPress={handleCurateLineup}
            activeOpacity={0.8}
          >
            <Text style={styles.curateButtonText}>Curate Lineup</Text>
          </TouchableOpacity>

          <View style={styles.bottomPad} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeTop: {
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerSpacer: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    width: CARD_WIDTH,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  bannerWrap: {
    width: '100%',
  },
  bannerImage: {
    width: CARD_WIDTH,
    aspectRatio: BANNER_ASPECT,
    justifyContent: 'center',
    padding: 16,
  },
  bannerImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerTextWrap: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 12,
  },
  bannerDate: {
    color: '#FFF',
    fontSize: 15,
    marginBottom: 6,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerMeta: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.95,
  },
  cardBody: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryLeft: {
    flex: 1,
    minWidth: 0,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  categoryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  ticketTypePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  ticketTypeText: {
    fontSize: 12,
  },
  qtyQrBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyText: {
    fontSize: 17,
    fontWeight: '700',
  },
  qrPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    gap: 6,
  },
  orderLabel: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  orderValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  addToWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  addToWalletText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addToWalletIcon: {
    marginLeft: 8,
  },
  curatePrompt: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.15,
    marginTop: 28,
    marginBottom: 16,
  },
  curateButton: {
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  curateButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  bottomPad: {
    height: 24,
  },
});

export default PurchaseSuccessScreen;
