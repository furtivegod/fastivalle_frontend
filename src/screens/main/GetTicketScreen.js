import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  Modal,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { Text, TextInput } from '../../components';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_ASPECT = 16 / 10;
const TICKET_DESC = 'Ticket includes full event entry, a bottle of water, and a notebook';
const MAX_GROUP_TICKETS = 25;

const PADDING = 20;
const HERO_CARD_SIZE = SCREEN_WIDTH - PADDING * 2;

const GetTicketScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const event = route.params?.event || {
    id: '1',
    date: 'AUG 15, 10:00AM',
    title: 'christian music festival',
    subtitle: 'WORSHIP',
    stage: 'MAIN STAGE',
    attendees: 54,
  };

  const [activeTab, setActiveTab] = useState('General');
  const [quantities, setQuantities] = useState({ standard: 1, fan: 0 });
  const [supportExpanded, setSupportExpanded] = useState(false);
  const [supportAmount, setSupportAmount] = useState('50');
  const [groupSheetVisible, setGroupSheetVisible] = useState(false);
  const [selectedGroupTicketId, setSelectedGroupTicketId] = useState(null);
  const [groupTicketCount, setGroupTicketCount] = useState('1');
  const [groupQuantities, setGroupQuantities] = useState({ standard: 0, fan: 0, vip: 0 });

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(400)).current;

  const tickets = useMemo(
    () => [
      { id: 'standard', name: 'standard ticket', price: 20, qtyKey: 'standard', soldOut: false },
      { id: 'fan', name: 'fan ticket', price: 25, qtyKey: 'fan', soldOut: false },
      { id: 'vip', name: 'vip ticket', price: 45, soldOut: true },
    ],
    []
  );

  const groupTickets = useMemo(
    () => [
      { id: 'standard', name: 'standard ticket', price: 20, dotColor: '#9E9E9E' },
      { id: 'fan', name: 'fan ticket', price: 25, dotColor: '#2196F3' },
      { id: 'vip', name: 'vip ticket', price: 30, dotColor: '#F44336' },
    ],
    []
  );

  const totalUsd = useMemo(() => {
    return tickets
      .filter((t) => !t.soldOut && t.qtyKey && quantities[t.qtyKey] > 0)
      .reduce((sum, t) => sum + t.price * quantities[t.qtyKey], 0);
  }, [tickets, quantities]);

  const totalTicketCount = useMemo(() => {
    if (activeTab === 'General') {
      return Object.keys(quantities).reduce((sum, key) => sum + (quantities[key] || 0), 0);
    }
    return Object.keys(groupQuantities).reduce((sum, key) => sum + (groupQuantities[key] || 0), 0);
  }, [activeTab, quantities, groupQuantities]);

  const handleApplePay = () => {
    const orderId = Math.random().toString(36).slice(2, 8).toUpperCase();
    const orderNum = `${orderId}-r${Math.floor(1000 + Math.random() * 9000)}`;
    navigation.navigate('PurchaseSuccess', {
      event,
      category: activeTab,
      ticketType: activeTab === 'Group' ? 'STANDARD' : 'GENERAL',
      quantity: totalTicketCount || 1,
      orderNumber: orderNum,
    });
  };

  const adjustQty = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] ?? 0) + delta),
    }));
  };

  const toggleSupport = () => {
    if (!supportExpanded) setSupportAmount('50');
    setSupportExpanded((prev) => !prev);
  };
  const closeSupport = () => setSupportExpanded(false);
  const setPresetAmount = (n) => setSupportAmount(String(n));
  const onAmountChange = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 6);
    setSupportAmount(digits === '' ? '' : digits);
  };

  const openGroupSheet = (ticket) => {
    setSelectedGroupTicketId(ticket.id);
    const existing = groupQuantities[ticket.id] || 0;
    setGroupTicketCount(existing > 0 ? String(existing) : '1');
    setGroupSheetVisible(true);
  };
  const closeGroupSheet = () => {
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
    ]).start(() => {
      setGroupSheetVisible(false);
      setSelectedGroupTicketId(null);
      setGroupTicketCount('1');
    });
  };

  useEffect(() => {
    if (groupSheetVisible) {
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
    }
  }, [groupSheetVisible]);
  const onGroupCountChange = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    setGroupTicketCount(digits === '' ? '' : digits);
  };
  const selectedGroupTicket = selectedGroupTicketId
    ? groupTickets.find((t) => t.id === selectedGroupTicketId)
    : null;
  const groupCountNum = parseInt(groupTicketCount, 10);
  const isGroupCountValid =
    !isNaN(groupCountNum) && groupCountNum >= 1 && groupCountNum <= MAX_GROUP_TICKETS;
  const onGroupDone = () => {
    if (isGroupCountValid && selectedGroupTicketId) {
      setGroupQuantities((prev) => ({ ...prev, [selectedGroupTicketId]: groupCountNum }));
      closeGroupSheet();
    }
  };

  const headerHeight = 48;
  const scrollPaddingTop = insets.top + headerHeight;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Fixed top bar: back button */}
      <View style={[styles.headerFixed, { paddingTop: insets.top, backgroundColor: theme.colors.backgroundAlt }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
            <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: scrollPaddingTop }]}
        showsVerticalScrollIndicator={false}
      >
        {/* First section: same card style as Upcoming Events on Home */}
        <View style={styles.heroCardWrap}>
          <View style={styles.heroCard}>
            <ImageBackground
              source={require('../../../assets/images/cover.png')}
              style={styles.heroCardBg}
              imageStyle={styles.heroCardImageStyle}
            >
              <View style={styles.heroCardOverlay} />
              <View style={styles.heroCardTop}>
                <Text style={styles.heroCardDate}>{event.date}</Text>
              </View>
              <View style={styles.heroCardSpacer} />
              <Text style={styles.heroCardTitle}>{event.title}</Text>
            </ImageBackground>
          </View>
        </View>

        {/* Tabs: General | Group — same pill format as All Events / My Events in Schedule */}
        <View style={styles.tabRow}>
          <View style={styles.tabPillWrap}>
            <TouchableOpacity
              style={[
                styles.tabSegment,
                styles.tabSegmentLeft,
                activeTab === 'General' && styles.tabSegmentActive,
              ]}
              onPress={() => setActiveTab('General')}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.tabSegmentText,
                  activeTab === 'General' ? styles.tabSegmentTextActive : styles.tabSegmentTextInactive,
                ]}
              >
                General
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabSegment,
                styles.tabSegmentRight,
                activeTab === 'Group' && styles.tabSegmentActive,
              ]}
              onPress={() => setActiveTab('Group')}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.tabSegmentText,
                  activeTab === 'Group' ? styles.tabSegmentTextActive : styles.tabSegmentTextInactive,
                ]}
              >
                Group
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ticket cards: General (steppers) or Group (Select buttons) */}
        <View style={styles.cardsWrap}>
          {activeTab === 'General' ? (
            tickets.map((t) => (
              <View
                key={t.id}
                style={[styles.ticketCard, { backgroundColor: theme.colors.surface }]}
              >
                <Text style={[styles.ticketName, { color: theme.colors.text }]}>{t.name}</Text>
                <View style={styles.ticketLine} />
                <Text style={[styles.ticketDesc, { color: theme.colors.textSecondary }]}>
                  {TICKET_DESC}
                </Text>
                <View style={styles.ticketBottom}>
                  <Text style={[styles.ticketPrice, { color: theme.colors.text }]}>
                    <Text style={styles.ticketPriceNum}>{t.price}</Text> USD
                  </Text>
                  {t.soldOut ? (
                    <View style={[styles.soldOutBadge, { backgroundColor: theme.colors.error }]}>
                      <Text style={styles.soldOutText}>SOLD OUT</Text>
                    </View>
                  ) : (
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={[
                          styles.stepperBtn,
                          quantities[t.qtyKey] === 0 && styles.stepperBtnDisabled,
                        ]}
                        onPress={() => adjustQty(t.qtyKey, -1)}
                        disabled={quantities[t.qtyKey] === 0}
                      >
                        <Ionicons
                          name="remove"
                          size={20}
                          color={
                            quantities[t.qtyKey] === 0
                              ? '#9E9E9E'
                              : '#1a1a1a'
                          }
                        />
                      </TouchableOpacity>
                      <Text style={styles.stepperQty}>
                        {quantities[t.qtyKey] ?? 0}
                      </Text>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustQty(t.qtyKey, 1)}
                      >
                        <Ionicons name="add" size={20} color="#1a1a1a" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            groupTickets.map((t) => (
              <View
                key={t.id}
                style={[styles.ticketCard, styles.groupTicketCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={styles.groupTicketHeader}>
                  <View style={styles.groupTicketHeaderLeft}>
                    <View style={styles.groupTicketDot} />
                    <Text style={[styles.groupTicketName, { color: theme.colors.text }]}>
                      {t.name}
                    </Text>
                  </View>
                  <View style={styles.groupTicketHeaderRight}>
                    <Text style={[styles.groupTicketPriceNum, { color: theme.colors.text }]}>
                      {t.price}
                    </Text>
                    <Text style={[styles.groupTicketPriceSuffix, { color: theme.colors.textSecondary }]}>
                      {' '}
                      USD /person
                    </Text>
                  </View>
                </View>
                <View style={styles.groupTicketSeparator} />
                <Text style={[styles.groupTicketDesc, { color: theme.colors.textSecondary }]}>
                  {TICKET_DESC}
                </Text>
                <TouchableOpacity
                  style={[styles.groupSelectButton, { backgroundColor: theme.colors.text }]}
                  activeOpacity={0.8}
                  onPress={() => openGroupSheet(t)}
                >
                  {groupQuantities[t.id] > 0 ? (
                    <View style={styles.selectButtonContent}>
                      <Text style={styles.groupSelectButtonText}>
                        {groupQuantities[t.id]} tickets for {groupQuantities[t.id] * t.price} USD
                      </Text>
                      <Ionicons name="pencil" size={16} color="#FFF" style={styles.selectButtonIcon} />
                    </View>
                  ) : (
                    <Text style={styles.groupSelectButtonText}>Select</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Support */}
        <View style={styles.supportCard}>
          <View style={styles.supportHeaderRow}>
            <Text style={[styles.supportTitle, { color: theme.colors.text }]}>Support</Text>
            <View style={styles.supportActionWrap}>
              {!supportExpanded ? (
                <TouchableOpacity
                  style={styles.supportActionBtn}
                  onPress={() => setSupportExpanded(true)}
                  activeOpacity={0.8}
                  hitSlop={12}
                >
                  <Text style={[styles.supportActionText, { color: theme.colors.textLink }]}>
                    Give Now
                  </Text>
                  <Ionicons name="add" size={20} color={theme.colors.textLink} style={styles.supportActionIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.supportActionBtn}
                  onPress={() => setSupportExpanded(false)}
                  activeOpacity={0.8}
                  hitSlop={12}
                >
                  <Text style={[styles.supportActionText, { color: theme.colors.textLink }]}>
                    Cancel
                  </Text>
                  <Ionicons name="close" size={22} color={theme.colors.textLink} style={styles.supportActionIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text style={styles.supportSub}>
            Support the mission and help sustain future events.
          </Text>
        </View>

        {/* Expanded Give Now section (inline, not modal) */}
        {supportExpanded && (
          <View style={[styles.supportExpandedWrap, { backgroundColor: theme.colors.surface }]}>
            {/* Amount input field */}
            <View
              style={
                styles.supportAmountArea
              }
            >
              <TextInput
                style={[
                  styles.supportAmountInput,
                  { color: theme.colors.text },
                ]}
                value={supportAmount}
                onChangeText={onAmountChange}
                placeholder="50"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="number-pad"
                maxLength={6}
              />
              <Text
                style={[
                  styles.supportAmountCurrency,
                  { color: theme.colors.text },
                ]}
              >
                USD
              </Text>
            </View>

            <View style={styles.supportPresets}>
              {[10, 15, 20].map((n) => {
                const selected = parseInt(supportAmount, 10) === n;
                return (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.supportPresetBtn,
                      selected && [styles.supportPresetBtnActive, { backgroundColor: theme.colors.text }],
                    ]}
                    onPress={() => setPresetAmount(n)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.supportPresetText,
                        selected ? styles.supportPresetTextActive : { color: '#1a1a1a' },
                      ]}
                    >
                      {n} USD
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Fixed at bottom: Total / Pay - white background */}
      <View style={[styles.fixedBottom, { backgroundColor: '#FFFFFF' }]}>
        <SafeAreaView edges={['bottom']} style={styles.fixedBottomSafe}>
          <View style={[styles.totalBlock, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.totalRow}>
              <View style={styles.totalLabelWrap}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={theme.colors.text}
                />
                <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                  Total price:
                </Text>
              </View>
              <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
                {totalUsd} USD
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.applePayBtn, { backgroundColor: theme.colors.text }]}
              activeOpacity={0.8}
              onPress={handleApplePay}
            >
              <Ionicons name="logo-apple" size={22} color="#FFF" />
              <Text style={styles.applePayText}>Pay With Apple Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.payOtherWrap} activeOpacity={0.8}>
              <Text
                style={[styles.payOtherText, { color: theme.colors.textLink }]}
              >
                Pay Another Way
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Group ticket quantity bottom sheet - same effect as Signup/Login modal */}
      <Modal
        visible={groupSheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeGroupSheet}
      >
        <View style={styles.groupSheetContainer}>
          <Animated.View
            style={[
              styles.groupSheetOverlay,
              { backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: overlayOpacity },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeGroupSheet} />
          </Animated.View>
          <Animated.View
            style={[
              styles.groupSheetCard,
              { backgroundColor: theme.colors.surface, transform: [{ translateY: modalSlide }] },
            ]}
          >
            <View style={styles.groupSheetHandle} />
            {selectedGroupTicket && (
              <>
                <Text style={[styles.groupSheetTitle, { color: theme.colors.text }]}>
                  {selectedGroupTicket.name.charAt(0).toUpperCase() + selectedGroupTicket.name.slice(1)}
                </Text>
                <Text style={[styles.groupSheetQuestion, { color: theme.colors.text }]}>
                  How many people are coming?
                </Text>
                <TextInput
                  style={[
                    styles.groupSheetInput,
                    {
                      color: theme.colors.text,
                      backgroundColor: theme.colors.surface,
                      borderColor:
                      !isNaN(groupCountNum) && groupCountNum > MAX_GROUP_TICKETS
                        ? theme.colors.error
                        : theme.colors.border,
                    },
                  ]}
                  value={groupTicketCount}
                  onChangeText={onGroupCountChange}
                  placeholder="0"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={4}
                />
                {!isNaN(groupCountNum) && groupCountNum > MAX_GROUP_TICKETS && (
                  <View style={styles.groupSheetErrorRow}>
                    <Ionicons name="information-circle" size={20} color={theme.colors.error} />
                    <Text style={[styles.groupSheetErrorText, { color: theme.colors.error }]}>
                      You can buy maximum {MAX_GROUP_TICKETS} general tickets
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.groupSheetDoneBtn,
                    {
                      backgroundColor: isGroupCountValid ? theme.colors.text : theme.colors.borderLight,
                    },
                  ]}
                  onPress={onGroupDone}
                  disabled={!isGroupCountValid}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.groupSheetDoneText,
                      { color: isGroupCountValid ? '#FFF' : theme.colors.textMuted },
                    ]}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerFixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    marginLeft: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  heroCardWrap: {
    paddingHorizontal: PADDING,
    marginBottom: 20,
    alignItems: 'center',
  },
  heroCard: {
    width: HERO_CARD_SIZE,
    height: HERO_CARD_SIZE * 0.6,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  heroCardBg: {
    flex: 1,
    padding: 16,
  },
  heroCardSpacer: {
    flex: 1,
  },
  heroCardImageStyle: {
    borderRadius: 16,
    resizeMode: 'cover',
  },
  heroCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232, 125, 43, 0.25)',
    borderRadius: 16,
  },
  heroCardTop: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCardDate: {
    marginVertical: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  heroCardAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCardAttendeesText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  heroCardTitle: {
    fontSize: 40,
    lineHeight: 40,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  heroCardSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  heroCardStage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  tabRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabPillWrap: {
    flexDirection: 'row',
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#E0DDD8',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  tabSegment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSegmentLeft: {
    backgroundColor: '#E0DDD8',
  },
  tabSegmentRight: {
    backgroundColor: '#E0DDD8',
  },
  tabSegmentActive: {
    borderRadius: 100,
    backgroundColor: '#1a1a1a',
  },
  tabSegmentText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabSegmentTextInactive: {
    color: '#1a1a1a',
  },
  tabSegmentTextActive: {
    color: '#FFF',
  },
  cardsWrap: {
    paddingHorizontal: 16,
  },
  ticketCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
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
  ticketName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  ticketLine: {
    width: SCREEN_WIDTH,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 6,
    marginHorizontal: -16,
    alignSelf: 'stretch',
  },
  ticketDesc: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  ticketBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketPrice: {
    fontSize: 15,
  },
  ticketPriceNum: {
    fontWeight: '700',
    fontSize: 32,
  },
  soldOutBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  soldOutText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2EFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.7,
  },
  stepperQty: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginHorizontal: 14,
  },
  groupTicketCard: {
    paddingBottom: 16,
    borderRadius: 14,
  },
  groupTicketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  groupTicketHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  groupTicketDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#808080',
    marginRight: 10,
  },
  groupTicketName: {
    fontSize: 17,
    fontWeight: '700',
  },
  groupTicketHeaderRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  groupTicketPriceNum: {
    fontSize: 17,
    fontWeight: '700',
  },
  groupTicketPriceSuffix: {
    fontSize: 13,
    fontWeight: '400',
    marginLeft: 2,
  },
  groupTicketSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
    marginHorizontal: -16,
    alignSelf: 'stretch',
  },
  groupTicketDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  groupSelectButton: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupSelectButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButtonIcon: {
    marginLeft: 8,
  },
  ticketPriceSuffix: {
    fontSize: 15,
    fontWeight: '400',
  },
  selectButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  supportCard: {
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  supportHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  supportTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  supportActionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportActionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  supportActionIcon: {
    marginLeft: 4,
  },
  supportSub: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 8,
  },
  bottomPad: {
    height: 24,
  },
  // Support expanded (inline section)
  supportExpandedWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderRadius: 16,
  },
  supportAmountArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
    minHeight: 64,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  supportAmountInput: {
    minWidth: 48,
    fontSize: 40,
    fontWeight: '700',
    padding: 0,
  },
  supportAmountCurrency: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  supportPresets: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  supportPresetBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0DDD8',
  },
  supportPresetBtnActive: {
    borderRadius: 100,
  },
  supportPresetText: {
    fontSize: 15,
    fontWeight: '700',
  },
  supportPresetTextActive: {
    color: '#FFF',
  },
  // Fixed bottom total
  fixedBottom: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  fixedBottomSafe: {
    backgroundColor: '#FFFFFF',
  },
  totalBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    marginLeft: 6,
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '700',
  },
  applePayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 100,
    marginBottom: 8,
  },
  applePayText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  payOtherWrap: {
    paddingVertical: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  payOtherText: {
    fontSize: 15,
  },
  // Group ticket quantity bottom sheet (same effect as Signup/Login modal)
  groupSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  groupSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  groupSheetCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  groupSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  groupSheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  groupSheetQuestion: {
    fontSize: 16,
    marginBottom: 12,
  },
  groupSheetInput: {
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
  },
  groupSheetErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  groupSheetErrorText: {
    fontSize: 14,
    flex: 1,
  },
  groupSheetDoneBtn: {
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: 'center',
  },
  groupSheetDoneText: {
    fontSize: 17,
    fontWeight: '600',
  },
});

export default GetTicketScreen;
