import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { apiRequest, getStoredToken } from '../services/api';
import { API_BASE_URL } from '../config/auth';

const ProfileSetupScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, checkAuthStatus } = useAuth();

  // Determine if this is edit mode (user already has a name set)
  const isEditMode = Boolean(user?.name);

  const [fullName, setFullName] = useState(user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to select image');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset) return;

    // Upload image to backend
    setUploadingImage(true);
    try {
      const token = await getStoredToken();
      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'profile.jpg',
      });

      const response = await fetch(`${API_BASE_URL}/api/auth/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProfileImage(data.data.imageUrl);
      } else {
        Alert.alert('Error', data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleProceed = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: fullName.trim(),
          dateOfBirth: dateOfBirth?.toISOString(),
          bio: bio.trim() || undefined,
          isPrivate,
        }),
      });

      if (res.ok) {
        await checkAuthStatus(); // Refresh user data
        if (isEditMode && navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace('MainTabs');
        }
      } else {
        Alert.alert('Error', res.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  const isFormValid = fullName.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('MainTabs')}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isEditMode ? 'Edit Profile' : 'Create an Account'}
          </Text>
          {!isEditMode ? (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={[styles.skipText, { color: '#FF6B35' }]}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        {/* Upload Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoCircle}
            onPress={handleSelectImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator size="large" color="#FF6B35" />
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="add" size={40} color="#FF6B35" />
            )}
          </TouchableOpacity>
          <Text style={[styles.uploadText, { color: theme.colors.text }]}>
            Upload Photo
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: '#FFFFFF',
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Enter full name"
              placeholderTextColor={theme.colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Date of Birth
            </Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.dateInput,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                Keyboard.dismiss();
                setShowDatePicker(true);
              }}
            >
              <Text
                style={[
                  styles.dateText,
                  {
                    color: dateOfBirth ? theme.colors.text : theme.colors.textSecondary,
                  },
                ]}
              >
                {dateOfBirth ? formatDate(dateOfBirth) : 'Select Date of Birth'}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Bio <Text style={styles.optionalText}>(optional)</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.bioInput,
                {
                  backgroundColor: '#FFFFFF',
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Add a bio..."
              placeholderTextColor={theme.colors.textSecondary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          {/* Private Account Toggle */}
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
              Private account
            </Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#E0E0E0', true: '#FFB77A' }}
              thumbColor={isPrivate ? '#FF6B35' : '#F4F4F4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        {/* Spacer to push button to bottom */}
        <View style={styles.spacer} />

        {/* Proceed Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            {
              backgroundColor: isFormValid ? '#000000' : '#D0D0D0',
            },
          ]}
          onPress={handleProceed}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.proceedButtonText}>
              {isEditMode ? 'Save Changes' : 'Proceed'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          {Platform.OS === 'ios' && (
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={dateOfBirth || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            style={styles.datePicker}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipPlaceholder: {
    width: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionalText: {
    fontWeight: '400',
    color: '#888',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  proceedButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#888',
  },
  datePickerDone: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  datePicker: {
    height: 200,
  },
});

export default ProfileSetupScreen;
