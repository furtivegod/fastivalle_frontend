import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ConnectScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    {
      id: 1,
      name: 'Alex Johnson',
      username: '@alexj',
      bio: 'Music lover | Festival enthusiast',
      mutualFriends: 5,
      avatar: null,
    },
    {
      id: 2,
      name: 'Sarah Miller',
      username: '@sarahm',
      bio: 'Rock & Roll forever',
      mutualFriends: 3,
      avatar: null,
    },
    {
      id: 3,
      name: 'Mike Chen',
      username: '@mikec',
      bio: 'DJ and producer',
      mutualFriends: 8,
      avatar: null,
    },
    {
      id: 4,
      name: 'Emma Wilson',
      username: '@emmaw',
      bio: 'Live music photographer',
      mutualFriends: 2,
      avatar: null,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search people..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          People You May Know
        </Text>

        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={[styles.userCard, { backgroundColor: theme.colors.surface }]}
          >
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.avatarText, { color: theme.colors.background }]}>
                {user.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {user.name}
              </Text>
              <Text style={[styles.userUsername, { color: theme.colors.textSecondary }]}>
                {user.username}
              </Text>
              <Text style={[styles.userBio, { color: theme.colors.textSecondary }]}>
                {user.bio}
              </Text>
              <Text style={[styles.mutualFriends, { color: theme.colors.primary }]}>
                {user.mutualFriends} mutual friends
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.connectButton, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={[styles.connectButtonText, { color: theme.colors.background }]}>
                Connect
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    marginBottom: 4,
  },
  userBio: {
    fontSize: 12,
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 12,
    fontWeight: '600',
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ConnectScreen;
