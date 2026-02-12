import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ORDER_TABS = ['Tickets', 'Merch'];
const FILTERS = ['All', 'Valid', 'Past', 'Canceled'];

const sampleOrders = [
  {
    id: '1',
    iconColor: '#8BC34A',
    title: 'Fastivalle – christian music festival',
    status: 'Valid',
    statusColor: '#34C759',
    dateTime: 'Aug 10, 10:00AM',
    numTickets: '1',
    category: 'General',
    categoryTag: 'FAN',
    categoryTagColor: '#2196F3',
    purchaseDate: '10.06.2025, 9:41AM',
    orderNumber: '123AXQ-r4556',
    total: '20 USD',
  },
  {
    id: '2',
    iconColor: '#E87D2B',
    title: 'Kingdom meetup spirit',
    status: 'Used',
    statusColor: '#999999',
    dateTime: 'Aug 10, 10:00AM',
    numTickets: '20',
    category: 'Group',
    categoryTag: 'STANDARD',
    categoryTagColor: '#9E9E9E',
    purchaseDate: '10.06.2025, 9:41AM',
    orderNumber: '123AXQ-r4556',
    total: '20 USD',
  },
];

const OrderDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Tickets');
  const [activeFilter, setActiveFilter] = useState('All');

  const orders = activeTab === 'Tickets' ? sampleOrders : [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Header: Back | Order Details */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBack}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Order Details</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs: Tickets | Merch */}
      <View style={[styles.tabRow, { backgroundColor: theme.colors.background }]}>
        {ORDER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.mainTab,
              activeTab === tab && { backgroundColor: theme.colors.text },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.mainTabText,
                { color: activeTab === tab ? '#FFF' : theme.colors.textSecondary },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters: All | Valid | Past | Canceled */}
      <View style={[styles.filterRow, { backgroundColor: theme.colors.background }]}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && { backgroundColor: theme.colors.text },
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: activeFilter === filter ? '#FFF' : theme.colors.textSecondary },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Tickets' && (
          <>
            <Text style={[styles.monthHeading, { color: theme.colors.text }]}>August</Text>
            {orders.map((order) => (
              <View
                key={order.id}
                style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={styles.orderCardHeader}>
                  <View style={[styles.orderIcon, { backgroundColor: order.iconColor }]} />
                  <Text style={[styles.orderTitle, { color: theme.colors.text }]} numberOfLines={1}>
                    {order.title}
                  </Text>
                </View>
                <View style={styles.orderDetails}>
                  <DetailRow
                    label="Status"
                    value={
                      <View style={styles.statusRow}>
                        <View
                          style={[styles.statusDot, { backgroundColor: order.statusColor }]}
                        />
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                          {order.status}
                        </Text>
                      </View>
                    }
                    theme={theme}
                  />
                  <DetailRow label="Date & Time" value={order.dateTime} theme={theme} />
                  <DetailRow label="Number of tickets" value={order.numTickets} theme={theme} />
                  <DetailRow
                    label="Category"
                    value={
                      <View style={styles.categoryRow}>
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                          {order.category}
                        </Text>
                        <View
                          style={[
                            styles.categoryPill,
                            { backgroundColor: order.categoryTagColor },
                          ]}
                        >
                          <Text style={styles.categoryPillText}>{order.categoryTag}</Text>
                        </View>
                      </View>
                    }
                    theme={theme}
                  />
                  <DetailRow label="Date & Time of purchase" value={order.purchaseDate} theme={theme} />
                  <DetailRow label="Order number" value={order.orderNumber} theme={theme} />
                  <DetailRow label="Total price" value={order.total} theme={theme} />
                </View>
                <TouchableOpacity style={styles.viewTicketRow} activeOpacity={0.8}>
                  <Text style={[styles.viewTicketText, { color: theme.colors.textLink }]}>
                    View Ticket
                  </Text>
                  <Ionicons name="ticket-outline" size={18} color={theme.colors.textLink} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        {activeTab === 'Merch' && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No merch orders yet
            </Text>
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

function DetailRow({ label, value, theme }) {
  const isReactElement = typeof value !== 'string';
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>{label}:</Text>
      {isReactElement ? (
        <View style={styles.detailValueWrap}>{value}</View>
      ) : (
        <Text style={[styles.detailValue, { color: theme.colors.text }]}>{value}</Text>
      )}
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
    borderBottomColor: '#E8E8E8',
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
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  monthHeading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  orderCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
  },
  orderTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValueWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  viewTicketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 12,
    gap: 6,
  },
  viewTicketText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
  },
  bottomPad: {
    height: 24,
  },
});

export default OrderDetailsScreen;
