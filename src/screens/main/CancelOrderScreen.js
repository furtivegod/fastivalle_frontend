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
const DEFAULT_COVER = require('../../../assets/images/cover.png');

const CancelOrderScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const eventTitle = params.eventTitle ?? params.event?.title ?? 'evening of hope';
  const eventDate = params.date ?? params.event?.date ?? 'Aug 15-20';
  const orderNumber = params.orderNumber ?? '123AXQ-r4556';
  const category = params.category ?? 'General';
  const categoryTag = params.ticketType ?? params.categoryTag ?? 'STANDARD';
  const quantity = params.quantity ?? params.numTickets ?? 20;
  const bannerSource = params.coverImage
    ? { uri: typeof params.coverImage === 'string' ? params.coverImage : params.coverImage?.url }
    : DEFAULT_COVER;

  const refundAmount = params.refundAmount ?? '48.00 USD';
  const serviceFee = params.serviceFee ?? '7.00 USD';
  const paidTotal = params.paidTotal ?? '55.00 USD';
  const paymentMethod = params.paymentMethod ?? 'Apple Pay';
  const cardLast4 = params.cardLast4 ?? '5354';
  const cardBrand = params.cardBrand ?? 'VISA';

  const goBack = () => navigation.goBack();
  const handleProceedToCancellation = () => {
    navigation.navigate('ConfirmCancel', {
      orderNumber,
      ...params,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Header: Back | Cancel Order */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={goBack} style={styles.headerBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Cancel Order</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event/Ticket card */}
        <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.bannerWrap}>
            <ImageBackground
              source={bannerSource}
              style={styles.bannerImage}
              imageStyle={styles.bannerImageStyle}
              resizeMode="cover"
            >
              <View style={[StyleSheet.absoluteFill, styles.bannerOverlay]} />
              <View style={styles.bannerTextWrap}>
                <Text style={styles.bannerTitle}>{eventTitle}</Text>
                <Text style={styles.bannerMeta}>CONCERT</Text>
                <Text style={styles.bannerMeta}>MAIN STAGE</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>DATE</Text>
              <Text style={[styles.dateValue, { color: theme.colors.text }]}>{eventDate}</Text>
            </View>
            <View style={styles.categoryRow}>
              <View>
                <Text style={styles.categoryLabel}>CATEGORY</Text>
                <View style={styles.categoryValueRow}>
                  <Text style={[styles.categoryValue, { color: theme.colors.text }]}>{category}</Text>
                  <View style={[styles.categoryPill, { backgroundColor: '#9E9E9E' }]}>
                    <Text style={styles.categoryPillText}>{categoryTag}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.orderQrRow}>
                <Text style={[styles.orderLabel, { color: theme.colors.textSecondary }]}>
                  Order Number: {orderNumber}
                </Text>
                <View style={styles.qtyQrRow}>
                  <Text style={[styles.qtyText, { color: theme.colors.text }]}>{quantity}x</Text>
                  <View style={styles.qrIconWrap}>
                    <Ionicons name="qr-code-outline" size={24} color={theme.colors.text} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Refund Amount section */}
        <Text style={[styles.refundHeading, { color: theme.colors.text }]}>Refund Amount</Text>
        <View style={styles.refundCard}>
          <RefundRow
            label="Refund status"
            value="Partial refund"
            theme={theme}
            rightIcon="information-circle-outline"
          />
          <RefundRow label="Refund amount" value={refundAmount} theme={theme} />
          <RefundRow label="Service fee (non-refundable)" value={serviceFee} theme={theme} />
          <RefundRow label="Paid total" value={paidTotal} theme={theme} />
          <RefundRow label="Method" value={paymentMethod} theme={theme} />
          <RefundRow label="Card" value={`${cardBrand} **** **** **** ${cardLast4}`} theme={theme} />
          <RefundRow
            label="Estimated refund time"
            value="3-5 business days"
            theme={theme}
            last
          />
        </View>

        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceedToCancellation}
          activeOpacity={0.8}
        >
          <Text style={styles.proceedButtonText}>Proceed to Cancellation</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

function RefundRow({ label, value, theme, rightIcon, last }) {
  return (
    <View style={[styles.refundRow, !last && styles.refundRowBorder, { borderBottomColor: theme.colors.borderLight }]}>
      <Text style={[styles.refundLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      <View style={styles.refundRowRight}>
        <Text style={[styles.refundValue, { color: theme.colors.text }]}>{value}</Text>
        {rightIcon && (
          <TouchableOpacity hitSlop={8} style={styles.refundRowIcon}>
            <Ionicons name={rightIcon} size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeTop: {
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    width: CARD_WIDTH,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  bannerWrap: {
    width: '100%',
  },
  bannerImage: {
    width: CARD_WIDTH,
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
    paddingVertical: 8,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 26,
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
  dateRow: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  categoryPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  categoryPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderQrRow: {
    alignItems: 'flex-end',
  },
  orderLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  qtyQrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyText: {
    fontSize: 17,
    fontWeight: '700',
  },
  qrIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refundHeading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  refundCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  refundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  refundRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  refundLabel: {
    fontSize: 14,
    flex: 1,
  },
  refundRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refundRowIcon: {
    marginLeft: 4,
  },
  refundValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  proceedButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  bottomPad: {
    height: 24,
  },
});

export default CancelOrderScreen;
