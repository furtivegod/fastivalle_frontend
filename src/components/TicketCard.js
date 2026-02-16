import React from 'react';
import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import Text from './AppText';
import QRCode from './QRCode';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

const DEFAULT_DESCRIPTION =
  'Your ticket includes full event entry, a complimentary bottle of water, and a notebook';

const DEFAULT_LOGO = require('../../assets/images/logo2.png');

/**
 * Reusable ticket card component. Use in TicketScreen, OrderDetails, or any screen that displays a single ticket.
 *
 * @param {string} eventTitle - Event/festival name
 * @param {string} date - e.g. "Aug 15-20"
 * @param {string} time - e.g. "10:00-20:00"
 * @param {string} category - e.g. "General"
 * @param {string} categoryTag - e.g. "STANDARD" or "VIP"
 * @param {string} [description] - Optional; defaults to standard ticket description
 * @param {string} qrValue - Data to encode in QR (e.g. ticketId|orderNumber)
 * @param {string} orderNumber - Order number displayed below QR
 * @param {object} [eventLogo] - Optional image source (require(...)); defaults to logo2.png
 * @param {number} [ticketIndex] - 1-based index for "Ticket 1/3"
 * @param {number} [ticketCount] - Total count for "Ticket 1/3"
 * @param {string} [categoryPillColor] - Background color for category pill; default #E0E0E0
 * @param {object} [style] - Optional outer View style
 */
const TicketCard = ({
  eventTitle,
  date,
  time,
  category,
  categoryTag,
  description = DEFAULT_DESCRIPTION,
  qrValue,
  orderNumber,
  eventLogo,
  ticketIndex,
  ticketCount,
  categoryPillColor = '#E0E0E0',
  style,
}) => {
  const theme = useTheme();
  const logoSource = eventLogo ?? DEFAULT_LOGO;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Image source={logoSource} style={styles.eventIcon} resizeMode="cover" />
        <Text style={[styles.eventTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {eventTitle}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.dateTimeRow}>
        <View style={styles.dateTimeBlock}>
          <Text style={styles.label}>DATE</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{date}</Text>
        </View>
        <View style={styles.dateTimeBlock}>
          <Text style={styles.label}>TIME</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{time}</Text>
        </View>
      </View>

      <View style={styles.categoryRow}>
        <Text style={styles.label}>CATEGORY</Text>
        <View style={styles.categoryValueRow}>
          <Text style={[styles.value, { color: theme.colors.text }]}>{category}</Text>
          <View style={[styles.categoryPill, { backgroundColor: categoryPillColor }]}>
            <Text style={[styles.categoryPillText, { color: theme.colors.text }]}>{categoryTag}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {description}
      </Text>

      {qrValue != null && qrValue !== '' && (
        <View style={styles.qrWrap}>
          <QRCode
            value={qrValue}
            size={200}
            color="#000000"
            backgroundColor="#FFFFFF"
          />
        </View>
      )}

      {(ticketIndex != null && ticketCount != null) && (
        <View style={styles.ticketFooter}>
          <View style={styles.ticketPill}>
            <Text style={[styles.ticketPillText, { color: theme.colors.textSecondary }]}>
              Ticket {ticketIndex}/{ticketCount}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.dashedLine} />
      {orderNumber != null && (
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Order Number:</Text>
          <Text style={[styles.orderValue, { color: theme.colors.text }]}>{orderNumber}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    width: CARD_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
  },
  eventTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  dateTimeBlock: {},
  label: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 17,
    fontWeight: '700',
  },
  categoryRow: {
    marginBottom: 12,
  },
  categoryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  categoryPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  qrWrap: {
    alignItems: 'center',
    marginVertical: 16,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  ticketPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: '#F0F0F0',
  },
  ticketPillText: {
    fontSize: 12,
  },
  dashedLine: {
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
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
});

export default TicketCard;
