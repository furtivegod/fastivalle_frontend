import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
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
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
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
            <Ionicons name="close" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.successTitle}>your tickets have been purchased successfully</Text>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.bannerWrap}>
            <ImageBackground
              source={require('../../../assets/images/welcome_bg.png')}
              style={styles.bannerImage}
              imageStyle={styles.bannerImageStyle}
            >
              <View style={[StyleSheet.absoluteFill, styles.bannerOverlay]} />
              <View style={styles.bannerTextWrap}>
                <Text style={styles.bannerTitle}>{event.title}</Text>
                <Text style={styles.bannerDate}>{event.date}</Text>
                <Text style={styles.bannerMeta}>CONCERT</Text>
                <Text style={styles.bannerMeta}>MAIN STAGE</Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.categoryRow}>
              <View>
                <Text style={[styles.categoryLabel, { color: theme.colors.textSecondary }]}>
                  CATEGORY
                </Text>
                <Text style={[styles.categoryValue, { color: theme.colors.text }]}>{category}</Text>
              </View>
              <View style={[styles.ticketTypePill, { backgroundColor: theme.colors.borderLight }]}>
                <Text style={[styles.ticketTypeText, { color: theme.colors.text }]}>{ticketType}</Text>
              </View>
            </View>

            <View style={styles.qtyQrRow}>
              <Text style={[styles.qtyText, { color: theme.colors.text }]}>{quantity}x</Text>
              <View style={[styles.qrPlaceholder, { backgroundColor: theme.colors.borderLight }]}>
                <Ionicons name="qr-code-outline" size={40} color={theme.colors.textSecondary} />
              </View>
            </View>

            <Text style={[styles.orderLabel, { color: theme.colors.textSecondary }]}>
              Order Number: {orderNumber}
            </Text>

            <TouchableOpacity style={styles.viewTicketRow} activeOpacity={0.8}>
              <Text style={[styles.viewTicketText, { color: theme.colors.textLink }]}>
                View Ticket
              </Text>
              <Ionicons name="ticket-outline" size={18} color={theme.colors.textLink} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.curatePrompt}>don't forget to curate your event lineup</Text>
        <TouchableOpacity
          style={[styles.curateButton, { backgroundColor: theme.colors.surface }]}
          onPress={handleCurateLineup}
          activeOpacity={0.8}
        >
          <Text style={[styles.curateButtonText, { color: theme.colors.text }]}>
            Curate Lineup
          </Text>
        </TouchableOpacity>

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
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    color: '#FFF',
    fontSize: 24,
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
    width: '100%',
    aspectRatio: BANNER_ASPECT,
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bannerTextWrap: {
    justifyContent: 'flex-end',
    flex: 1,
    padding: 16,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerDate: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 2,
  },
  bannerMeta: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
  },
  cardBody: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  categoryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  ticketTypePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  ticketTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  qtyQrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '700',
  },
  qrPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderLabel: {
    fontSize: 13,
    marginBottom: 16,
  },
  viewTicketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  viewTicketText: {
    fontSize: 16,
    fontWeight: '600',
  },
  curatePrompt: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 16,
  },
  curateButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
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
  },
  bottomPad: {
    height: 24,
  },
});

export default PurchaseSuccessScreen;
