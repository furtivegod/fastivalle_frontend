import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  Animated,
  Easing,
  TextInput,
  Platform,
} from 'react-native';
import { Text, TicketCard } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const MAX_PERSONS = 20;
const exampleFriends = [
  { id: '1', name: 'Ashley Lubin' },
  { id: '2', name: 'Darlene Robertson' },
  { id: '3', name: 'Kristin Watson' },
  { id: '4', name: 'Jacob Martinez' },
  { id: '5', name: 'Jacob Jones' },
  { id: '6', name: 'Sarah Chen' },
  { id: '7', name: 'Michael Brown' },
  { id: '8', name: 'Emily Davis' },
];

const ShareTicketScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const orderFromParams = params.order;
  const eventFromParams = params.event;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');
  const [addedFriends, setAddedFriends] = useState([]);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (friendsModalVisible) {
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
  }, [friendsModalVisible]);

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
  const orderNumber = ticket?.orderNumber ?? params.orderNumber ?? '123AXQ-r4556';
  const eventTitle = ticket?.eventTitle ?? params.eventTitle ?? 'Fastivalle – christian music festival';
  const date = ticket?.date ?? params.date ?? 'Aug 15-20';
  const time = ticket?.time ?? params.time ?? '10:00-20:00';
  const category = ticket?.category ?? params.category ?? 'General';
  const categoryTag = ticket?.categoryTag ?? params.ticketType ?? 'STANDARD';
  const qrValue = `${ticket?.id ?? orderFromParams?.id ?? '1'}|${orderNumber}`;

  const goBack = () => navigation.goBack();
  const handleShare = () => {
    // TODO: Native share (ticket image or link)
  };
  const handleAddFriend = () => {
    setFriendsModalVisible(true);
  };
  const closeFriendsModal = () => setFriendsModalVisible(false);
  const filteredFriends = exampleFriends.filter((f) =>
    f.name.toLowerCase().includes((friendSearch || '').toLowerCase())
  );
  const handleAddFriendItem = (friend) => {
    if (addedFriends.length >= MAX_PERSONS) return;
    if (addedFriends.some((f) => f.id === friend.id)) return;
    setAddedFriends((prev) => [...prev, friend]);
  };
  const handleRemoveAddedFriend = (friend) => {
    setAddedFriends((prev) => prev.filter((f) => f.id !== friend.id));
  };
  const handleNext = () => {
    // TODO: Proceed with invite (e.g. send tickets to addedFriends)
    closeFriendsModal();
  };
  const isFriendAdded = (id) => addedFriends.some((f) => f.id === id);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />

      {/* Header: Back | Ticket page | Share */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={goBack} style={styles.headerBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Ticket page</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.headerShareBtn} hitSlop={12}>
          <Ionicons name="share-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

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

        {/* Invite Your Group - added people on main page */}
        <Text style={[styles.inviteHeading, { color: theme.colors.text }]}>
          Invite Your Group
        </Text>
        <Text style={[styles.inviteSubtitle, { color: theme.colors.textSecondary }]}>
          Enter their phone number - and their ticket will be sent to them automatically.
        </Text>
        <View style={styles.personCountWrap}>
          <Text style={[styles.personCountLabel, { color: theme.colors.text }]}>
            Person {addedFriends.length}/{MAX_PERSONS}
          </Text>
          <TouchableOpacity
            style={[styles.addFriendBtn, styles.addFriendBtnMain]}
            onPress={handleAddFriend}
            activeOpacity={0.7}
          >
            <Text style={[styles.addFriendText, { color: theme.colors.textLink }]}>
              Add Friend
            </Text>
            <Ionicons name="person-outline" size={20} color={theme.colors.textLink} />
          </TouchableOpacity>
        </View>
        {addedFriends.length > 0 && (
          <View style={styles.addedList}>
            {addedFriends.map((friend) => (
              <View key={friend.id} style={styles.addedPill}>
                <View style={[styles.addedPillAvatar, { backgroundColor: theme.colors.borderLight }]}>
                  <Text style={[styles.addedPillAvatarText, { color: theme.colors.textSecondary }]}>
                    {friend.name.charAt(0)}
                  </Text>
                </View>
                <Text style={[styles.addedPillName, { color: theme.colors.text }]} numberOfLines={1}>
                  {friend.name}
                </Text>
                <TouchableOpacity
                  style={[styles.removeBtn, { backgroundColor: theme.colors.textSecondary }]}
                  onPress={() => handleRemoveAddedFriend(friend)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: theme.colors.text }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Friends modal - animated like Signup/Login */}
      <Modal
        visible={friendsModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeFriendsModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalOverlay,
              { backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: overlayOpacity },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeFriendsModal} />
          </Animated.View>
          <Animated.View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface, transform: [{ translateY: modalSlide }] },
            ]}
          >
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Friends</Text>
            <View style={styles.searchWrap}>
              <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                placeholder="Search..."
                placeholderTextColor={theme.colors.textSecondary}
                value={friendSearch}
                onChangeText={setFriendSearch}
              />
            </View>
            <ScrollView
              style={styles.friendList}
              contentContainerStyle={styles.friendListContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredFriends.map((friend) => {
                const added = isFriendAdded(friend.id);
                return (
                  <View key={friend.id} style={styles.friendRow}>
                    <View style={[styles.friendAvatar, { backgroundColor: theme.colors.borderLight }]}>
                      <Text style={[styles.friendAvatarText, { color: theme.colors.textSecondary }]}>
                        {friend.name.charAt(0)}
                      </Text>
                    </View>
                    <Text style={[styles.friendName, { color: theme.colors.text }]} numberOfLines={1}>
                      {friend.name}
                    </Text>
                    {added ? (
                      <Text style={styles.addedLabel}>Added</Text>
                    ) : (
                      <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: theme.colors.text }]}
                        onPress={() => handleAddFriendItem(friend)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.addBtnText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
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
  safeTop: {
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 4,
  },
  headerShareBtn: {
    borderRadius: 100,
    backgroundColor: '#FFF',
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#1A1A1A',
  },
  dotInactive: {
    backgroundColor: '#E0E0E0',
  },
  inviteHeading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  inviteSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  personCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  addFriendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addFriendBtnMain: {
    marginTop: 16,
  },
  addFriendText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPad: {
    height: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  personCountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  personCountLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  addedList: {
    marginBottom: 16,
    gap: 10,
  },
  addedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  addedPillAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addedPillAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  addedPillName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    backgroundColor: '#FFF',
  },
  addedLabel: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  friendList: {
    flexGrow: 0,
    maxHeight: 240,
  },
  friendListContent: {
    paddingBottom: 8,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  friendAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  friendName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default ShareTicketScreen;
