import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  Keyboard,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Text, TextInput } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import { useAuth } from '../../context/AuthContext';
import {
  signInWithGoogle as googleSignIn,
  signInWithApple as appleSignIn,
  isAppleSignInSupported,
  sendOTP,
} from '../../services/authService';
import AuthScreenBackground from '../../components/AuthScreenBackground';
import { API_BASE_URL } from '../../config/auth';
import { GoogleAuthProvider, getAuth, signInWithCredential, AppleAuthProvider } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

GoogleSignin.configure({
  webClientId: '426653897778-58k7osl5aaui7pjpu11ke1lvul6iue86.apps.googleusercontent.com',
});


const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { login, signInWithGoogle, signInWithApple, setAuthFromResponse } = useAuth();
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtherMethods, setShowOtherMethods] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const phoneInputRef = React.useRef(null);
  const scrollViewRef = React.useRef(null);
  
  // Animation values for modal
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn('If this function executes, User Credentials have been Revoked');
    });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  // Animate modal open/close
  useEffect(() => {
    if (showOtherMethods) {
      // Reset values before animating in
      overlayOpacity.setValue(0);
      modalSlide.setValue(400);
      
      // Open animation - overlay fades in smoothly, modal slides up
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
      // Close animation - overlay fades out, modal slides down
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
  }, [showOtherMethods]);

  // Scroll to input when focused
  const scrollToInput = (yOffset) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
    }, 100);
  };

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleEmailLoginPress = () => {
    setShowOtherMethods(false);
    setShowEmailLogin(true);
  };

  const handleBackToPhone = () => {
    setShowEmailLogin(false);
  };

  const handlePhoneLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill in phone number and password');
      return;
    }
    setLoading(true);
    try {
      const phoneToUse = formattedPhone || phone;
      await sendOTP(phoneToUse, 'login');
      // Navigate to OTP verification
      navigation.navigate('OTPVerification', {
        phone: phoneToUse,
        type: 'login',
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      setShowEmailLogin(false);
      // Auth state update will trigger AppNavigator to show MainTabs
      navigation.replace('ProfileSetup');
    } catch (err) {
      Alert.alert('Error', err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setShowOtherMethods(false);

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      idToken = signInResult.data?.idToken;
      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const user = await signInWithCredential(getAuth(), googleCredential);
      console.log('Google Sign Up User:', user);
      
      const firebaseIdToken = await user.user.getIdToken();
console.log('----', firebaseIdToken)
      // Send Firebase ID token to backend
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseIdToken }),
      });

      const data = await res.json();
      console.log('====', data);
      await setAuthFromResponse({ token: data.data.token, user: data.data.user });
      // Navigate to profile setup
      navigation.replace('ProfileSetup');
    } catch (error) {
      Alert.alert('Error', error.message || 'Google sign-in failed');
      console.log('Google Sign In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setShowOtherMethods(false);

      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      console.log('Apple Auth Request Response:', appleAuthRequestResponse);
      
      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = AppleAuthProvider.credential(identityToken, nonce);

      // Sign the user in with the credential
      const user = await signInWithCredential(getAuth(), appleCredential);
      console.log('Apple Sign Up User:', user);

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      // use credentialState response to ensure the user is authenticated
      // if (credentialState === appleAuth.State.AUTHORIZED) {
      //   // user is authenticated
      // }
      const firebaseIdToken = await user.user.getIdToken();
console.log('----', firebaseIdToken)
      // Send Firebase ID token to backend
      const res = await fetch(`${API_BASE_URL}/api/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseIdToken }),
      });

      const data = await res.json();
      console.log('====', data);
      await setAuthFromResponse({ token: data.data.token, user: data.data.user });

      // Navigate to profile setup
      navigation.replace('ProfileSetup');
    } catch (error) {
      Alert.alert('Error', error.message || 'Apple sign-in failed');
      console.log('Apple Sign In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        {/* Lottie background with blur and gradient overlay */}
        <AuthScreenBackground lottieSource={require('../../../assets/lottie/log_in.json')} />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={true}
          onScrollBeginDrag={dismissKeyboard}
        >
          {/* Header with Log In title */}
          <Pressable onPress={dismissKeyboard}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} />
            </View>
          </Pressable>

        {/* Welcome Back */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome Back
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {showEmailLogin ? (
            <>
              {/* Back to Phone Button */}
              <TouchableOpacity
                style={styles.backToPhoneButton}
                onPress={handleBackToPhone}
              >
                <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                <Text style={[styles.backToPhoneText, { color: theme.colors.text }]}>
                  Back to Phone
                </Text>
              </TouchableOpacity>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Email
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
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Password
                </Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      {
                        backgroundColor: '#FFFFFF',
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                      },
                    ]}
                    placeholder="Enter password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-outline'}
                      size={22}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  // TODO: Navigate to forgot password screen
                }}
              >
                <Text style={[styles.forgotPasswordText, { color: '#FF6B35' }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Log In Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: '#000000' },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleEmailLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.loginButtonText, { color: '#FFFFFF' }]}>
                    Log In
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Phone Number Input */}
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
                    placeholder: '(234) 555 678 901',
                    placeholderTextColor: theme.colors.textSecondary,
                    keyboardType: 'phone-pad',
                  }}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Password
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
                  placeholder="Enter password"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                  onFocus={() => scrollToInput(120)}
                />
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  // TODO: Navigate to forgot password screen
                }}
              >
                <Text style={[styles.forgotPasswordText, { color: '#FF6B35' }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Log In Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: '#000000' },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handlePhoneLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.loginButtonText, { color: '#FFFFFF' }]}>
                    Log In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Log In With Other Methods Button */}
              <TouchableOpacity
                style={[
                  styles.otherMethodsButton,
                  { backgroundColor: '#FFFFFF', borderColor: theme.colors.border },
                ]}
                onPress={() => setShowOtherMethods(true)}
                disabled={loading}
              >
                <Text style={[styles.otherMethodsButtonText, { color: theme.colors.text }]}>
                  Log In With Other Methods
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { borderColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
            or
          </Text>
          <View style={[styles.dividerLine, { borderColor: theme.colors.border }]} />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signupLink, { color: '#FF6B35' }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Other Methods Modal */}
      <Modal
        visible={showOtherMethods}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowOtherMethods(false)}
      >
        <View style={styles.modalContainer}>
          {/* Animated Overlay - fades in */}
          <Animated.View
            style={[
              styles.modalOverlay,
              { backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: overlayOpacity },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setShowOtherMethods(false)}
            />
          </Animated.View>

          {/* Animated Modal Content - slides up */}
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalSlide }] },
            ]}
          >
            {/* Modal Handle */}
            <View style={styles.modalHandle} />
            
            {/* Modal Title */}
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Continue with
            </Text>

            {/* Continue Options */}
            <View style={styles.modalOptions}>
              {/* Continue with Email */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleEmailLoginPress}
                disabled={loading}
              >
                <Ionicons name="mail-outline" size={20} color={theme.colors.text} />
                <Text style={[styles.continueButtonText, { color: theme.colors.text }]}>
                  Continue with Email
                </Text>
              </TouchableOpacity>

              {/* Continue with Google */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text style={[styles.continueButtonText, { color: theme.colors.text }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Continue with Apple */}
              {isAppleSignInSupported() && (
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleAppleSignIn}
                  disabled={loading}
                >
                  <Ionicons name="logo-apple" size={20} color={theme.colors.text} />
                  <Text style={[styles.continueButtonText, { color: theme.colors.text }]}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFEB',
  },
  flex: {
    flex: 1,
    backgroundColor: '#F2EFEB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  topHeader: {
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'PPAgrandirText-Bold',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'PPAgrandirText-Bold'
  },
  phoneInputContainer: {
    borderRadius: 100,
    borderWidth: 1,
    width: '100%',
    height: 44,
  },
  phoneInputTextContainer: {
    borderRadius: 100,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
  },
  phoneInputText: {
    fontSize: 16,
    height: 44,
  },
  flagButton: {
    paddingHorizontal: 12,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    height: 44,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
  },
  otpInfoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  otherMethodsButton: {
    height: 44,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  otherMethodsButtonText: {
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backToPhoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backToPhoneText: {
    fontSize: 16,
  },
  passwordInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  // Modal Styles
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
    backgroundColor: '#FFF',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#F2EFEB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    fontFamily: 'PPAgrandirText-Bold',
  },
  modalOptions: {
    gap: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 28,
    backgroundColor: '#F2EFEB',
    gap: 10,
  },
  continueButtonText: {
    fontSize: 16,
  },
});

export default LoginScreen;
