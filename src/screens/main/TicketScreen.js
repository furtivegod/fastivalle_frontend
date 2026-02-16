import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Modal,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { Text, TicketCard } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

function OrderDetailRow({ label, value, theme }) {
  const isNode = typeof value !== 'string';
  return (
    <View style={styles.orderDetailRow}>
      <Text style={[styles.orderDetailLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      {isNode ? (
        <View style={styles.orderDetailValueWrap}>{value}</View>
      ) : (
        <Text style={[styles.orderDetailValue, { color: theme.colors.text }]}>{value}</Text>
      )}
    </View>
  );
}

const exampleTickets = [
  {
    id: '1',
    orderNumber: '123AXQ-r4556',
    eventTitle: 'Fastivalle – christian music festival',
    date: 'Aug 15-20',
    time: '10:00-20:00',
    category: 'General',
    categoryTag: 'STANDARD',
  },
];

const TicketScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const orderFromParams = params.order;
  const eventFromParams = params.event;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (orderDetailsVisible) {
      overlayOpacity.setValue(0);
      modalSlide.setValue(400);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(modalSlide, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(modalSlide, {
          toValue: 400,
          duration: 350,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [orderDetailsVisible]);

  const ticketsFromParams =
    params.tickets?.length > 0
      ? params.tickets
      : orderFromParams || params.orderNumber || params.orderId
        ? [
            {
              id: orderFromParams?.id ?? params.orderId ?? '1',
              orderNumber: orderFromParams?.orderNumber ?? params.orderNumber ?? '123AXQ-r4556',
              eventTitle: eventFromParams?.title ?? orderFromParams?.event?.title ?? params.eventTitle ?? 'Fastivalle – christian music festival',
              date: params.date ?? 'Aug 15-20',
              time: params.time ?? '10:00-20:00',
              category: params.category ?? orderFromParams?.category ?? 'General',
              categoryTag: params.ticketType ?? orderFromParams?.ticketType ?? 'STANDARD',
            },
          ]
        : null;
  const tickets = ticketsFromParams ?? exampleTickets;
  const ticket = tickets[currentIndex] || tickets[0];
  const orderNumber = ticket?.orderNumber ?? orderFromParams?.orderNumber ?? params.orderNumber ?? '123AXQ-r4556';
  const eventTitle = ticket?.eventTitle ?? eventFromParams?.title ?? orderFromParams?.event?.title ?? 'Fastivalle – christian music festival';
  const date = ticket?.date ?? params.date ?? 'Aug 15-20';
  const time = ticket?.time ?? params.time ?? '10:00-20:00';
  const category = ticket?.category ?? params.category ?? 'General';
  const categoryTag = ticket?.categoryTag ?? params.ticketType ?? orderFromParams?.ticketType ?? 'STANDARD';

  const qrValue = `${ticket?.id ?? orderFromParams?.id ?? '1'}|${orderNumber}`;

  const goBack = () => navigation.goBack();
  const handleAddToWallet = () => {
    setMenuVisible(false);
    // TODO: Add to Apple/Google Wallet
  };
  const handleShareTicket = () => {
    setMenuVisible(false);
    navigation.navigate('ShareTicket', {
      tickets,
      orderNumber,
      eventTitle,
      date,
      time,
      category,
      ticketType: categoryTag,
      order: orderFromParams,
      event: eventFromParams,
    });
  };
  const handleOrderDetailsPress = () => {
    setMenuVisible(false);
    setOrderDetailsVisible(true);
  };
  const closeOrderDetails = () => setOrderDetailsVisible(false);
  const handleCancelOrder = () => {
    closeOrderDetails();
    navigation.navigate('CancelOrder', {
      orderNumber,
      eventTitle,
      date,
      category,
      ticketType: categoryTag,
      quantity: 2,
      order: orderFromParams,
      event: eventFromParams,
    });
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/splash_bg.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeTop} edges={['top']} />

        {/* Header: Back | Tickets | Menu */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.headerBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
            <Text style={styles.headerTitle}>Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerMoreBtn}
            hitSlop={12}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={22} />
          </TouchableOpacity>
        </View>

        {/* Tooltip menu */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.menuOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <View style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-download-outline" size={20} color={theme.colors.text} />
                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Download Ticket</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <Ionicons name="save-outline" size={20} color={theme.colors.text} />
                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Save To Your Device</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleShareTicket}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={20} color={theme.colors.text} />
                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Share Ticket</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleOrderDetailsPress}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={20} color={theme.colors.text} />
                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Order Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <Ionicons name="mail-outline" size={20} color={theme.colors.text} />
                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Contact Us</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* Order Details animated bottom sheet (same pattern as LoginScreen) */}
        <Modal
          visible={orderDetailsVisible}
          transparent
          animationType="none"
          onRequestClose={closeOrderDetails}
        >
          <View style={styles.orderDetailsModalContainer}>
            <Animated.View
              style={[
                styles.orderDetailsOverlay,
                { backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: overlayOpacity },
              ]}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={closeOrderDetails} />
            </Animated.View>
            <Animated.View
              style={[
                styles.orderDetailsSheet,
                { backgroundColor: theme.colors.surface, transform: [{ translateY: modalSlide }] },
              ]}
            >
              <View style={styles.orderDetailsHandle} />
              <Text style={[styles.orderDetailsTitle, { color: theme.colors.text }]}>
                Order Details
              </Text>
              <View style={styles.orderDetailsRows}>
                <OrderDetailRow
                  label="Number of tickets"
                  value="2"
                  theme={theme}
                />
                <OrderDetailRow
                  label="Category"
                  value={
                    <View style={styles.orderDetailCategoryRow}>
                      <Text style={[styles.orderDetailValue, { color: theme.colors.text }]}>General</Text>
                      <View style={[styles.orderDetailVipPill, { backgroundColor: '#9E9E9E' }]}>
                        <Text style={styles.orderDetailVipText}>VIP</Text>
                      </View>
                    </View>
                  }
                  theme={theme}
                />
                <OrderDetailRow
                  label="Date & Time of purchase"
                  value="10.06.2025, 9:41AM"
                  theme={theme}
                />
                <OrderDetailRow
                  label="Order number"
                  value={orderNumber}
                  theme={theme}
                />
                <OrderDetailRow
                  label="Total price"
                  value="20$"
                  theme={theme}
                />
              </View>
              <TouchableOpacity
                style={styles.cancelOrderWrap}
                onPress={handleCancelOrder}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelOrderText}>Cancel Order</Text>
                <View style={styles.cancelOrderUnderline} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TicketCard
            eventTitle={eventTitle}
            date={date}
            time={time}
            category={category}
            categoryTag={categoryTag}
            qrValue={qrValue}
            orderNumber={orderNumber}
            ticketIndex={currentIndex + 1}
            ticketCount={tickets.length}
          />

          {/* Pagination dots */}
          {tickets.length > 1 && (
            <View style={styles.pagination}>
              {tickets.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === currentIndex ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Add To Wallet - same as PurchaseSuccessScreen */}
          <TouchableOpacity
            style={[styles.addToWalletButton, { backgroundColor: theme.colors.text }]}
            onPress={handleAddToWallet}
            activeOpacity={0.8}
          >
            <Text style={styles.addToWalletText}>Add To Wallet</Text>
            <Ionicons name="wallet-outline" size={20} color="#FFF" style={styles.addToWalletIcon} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMoreBtn: {
    padding: 4,
    borderRadius: 100,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
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
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 16,
  },
  menuCard: {
    minWidth: 180,
    borderRadius: 12,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  orderDetailsModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  orderDetailsOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  orderDetailsSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  orderDetailsHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  orderDetailsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  orderDetailsRows: {
    gap: 16,
    marginBottom: 24,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderDetailLabel: {
    fontSize: 15,
    flex: 1,
  },
  orderDetailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  orderDetailValueWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  orderDetailCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderDetailVipPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  orderDetailVipText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelOrderWrap: {
    alignSelf: 'flex-start',
  },
  cancelOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  cancelOrderUnderline: {
    height: 2,
    backgroundColor: '#FF3B30',
    marginTop: 2,
    width: '120%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#FFF',
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  addToWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    marginTop: 16,
  },
  addToWalletText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addToWalletIcon: {
    marginLeft: 8,
  },
  bottomPad: {
    height: 24,
  },
});

export default TicketScreen;
