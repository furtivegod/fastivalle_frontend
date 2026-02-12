import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { verifyOTP, resendOTP } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const OTPVerificationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { checkAuthStatus } = useAuth();

  // Get params from navigation
  const { phone, type, name, password } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === OTP_LENGTH) {
      handleVerify();
    }
  }, [otp]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      await verifyOTP(phone, otpString, type, name, password);
      await checkAuthStatus();
      
      if (type === 'signup') {
        navigation.replace('ProfileSetup');
      }
      // For login, the auth state change will automatically navigate to MainTabs
    } catch (err) {
      Alert.alert('Error', err.message || 'Verification failed');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await resendOTP(phone, type);
      setResendTimer(RESEND_COOLDOWN);
      setCanResend(false);
      Alert.alert('Success', 'OTP sent successfully');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (phoneNumber) => {
    // Mask phone number for display
    if (!phoneNumber) return '';
    const last4 = phoneNumber.slice(-4);
    return `****${last4}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Verify Your Phone
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.phoneText}>{formatPhone(phone)}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: digit ? theme.colors.primary : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { backgroundColor: '#000000' },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={loading || otp.join('').length !== OTP_LENGTH}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
            Didn't receive the code?{' '}
          </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={[styles.resendLink, { color: '#FF6B35' }]}>
                Resend
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.resendTimer, { color: theme.colors.textSecondary }]}>
              Resend in {resendTimer}s
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  phoneText: {
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  verifyButton: {
    height: 56,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  resendTimer: {
    fontSize: 14,
  },
});

export default OTPVerificationScreen;
