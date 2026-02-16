import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';

const ConfirmCancelScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const phoneInputRef = useRef(null);
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');

  const goBack = () => navigation.goBack();
  const handleConfirmCancellation = () => {
    // TODO: Send confirmation code to phone, then navigate to verification or success
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Enter your phone number.
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Enter your phone number to receive a ticket refund confirmation code.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Phone Number
            </Text>
            <PhoneInput
              ref={phoneInputRef}
              defaultValue={phone}
              defaultCode="US"
              layout="first"
              onChangeText={setPhone}
              onChangeFormattedText={setFormattedPhone}
              containerStyle={[
                styles.phoneInputContainer,
                { backgroundColor: '#FFFFFF', borderColor: theme.colors.border },
              ]}
              textContainerStyle={styles.phoneInputTextContainer}
              textInputStyle={[
                styles.phoneInputText,
                { color: theme.colors.text },
              ]}
              codeTextStyle={{ color: theme.colors.text }}
              flagButtonStyle={styles.flagButton}
              textInputProps={{
                placeholder: '+1 (234) 555 678 901',
                placeholderTextColor: theme.colors.textSecondary,
                keyboardType: 'phone-pad',
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmCancellation}
            activeOpacity={0.8}
          >
            <View style={styles.confirmButtonIconWrap}>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </View>
            <Text style={styles.confirmButtonText}>Confirm Cancellation</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '700',
  },
  phoneInputContainer: {
    borderRadius: 28,
    borderWidth: 1,
    width: '100%',
    height: 44,
  },
  phoneInputTextContainer: {
    borderRadius: 28,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
  },
  phoneInputText: {
    fontSize: 16,
    height: 44,
  },
  flagButton: {
    paddingHorizontal: 16,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingLeft: 20,
    paddingRight: 24,
    borderRadius: 28,
    gap: 12,
  },
  confirmButtonIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default ConfirmCancelScreen;
