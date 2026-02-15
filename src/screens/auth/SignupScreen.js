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
  signInWithApple as appleSignInNative,
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

const SignupScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { register, signInWithGoogle, signInWithApple, setAuthFromResponse } = useAuth();
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtherMethods, setShowOtherMethods] = useState(false);
  const [showEmailSignup, setShowEmailSignup] = useState(false); // Toggle between phone/email on main screen
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showEmailConfirmPassword, setShowEmailConfirmPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const phoneInputRef = React.useRef(null);
  const scrollViewRef = React.useRef(null);
  
  // Animation values for modal
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(400)).current; // Start off-screen (400px down)

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
      
      // Open animation - overlay fades in smoothly, modal slides up with spring-like ease
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

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasLetterNumberSpecial: false,
  });

  // Validate password on change
  useEffect(() => {
    const hasLength = password.length >= 8 && password.length <= 20;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    setPasswordValidation({
      length: hasLength,
      hasLetterNumberSpecial: hasLetter && hasNumber && hasSpecial,
    });
  }, [password]);

  const handlePhoneSignup = async () => {
    if (!phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!passwordValidation.length || !passwordValidation.hasLetterNumberSpecial) {
      Alert.alert('Error', 'Password does not meet requirements');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const phoneToUse = formattedPhone || phone;
      await sendOTP(phoneToUse, 'signup');
      // Navigate to OTP verification
      navigation.navigate('OTPVerification', {
        phone: phoneToUse,
        type: 'signup',
        password,
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      Alert.alert('Error', error.message || 'Google sign-up failed');
      console.log('Google Sign Up Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
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
      Alert.alert('Error', error.message || 'Apple sign-up failed');
      console.log('Apple Sign Up Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUpPress = () => {
    setShowOtherMethods(false); // Close modal
    setShowEmailSignup(true); // Show email form on main screen
  };

  const handleBackToPhone = () => {
    setShowEmailSignup(false);
  };

  const handleEmailSignupSubmit = async () => {
    if (!email || !emailPassword || !emailConfirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (emailPassword.length < 8 || emailPassword.length > 20) {
      Alert.alert('Error', 'Password must be 8–20 characters');
      return;
    }
    const hasLetter = /[a-zA-Z]/.test(emailPassword);
    const hasNumber = /[0-9]/.test(emailPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(emailPassword);
    if (!hasLetter || !hasNumber || !hasSpecial) {
      Alert.alert('Error', 'Password must include letter, number and special character');
      return;
    }
    if (emailPassword !== emailConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ email: email.trim(), password: emailPassword, name: name.trim() || undefined });
      setShowEmailSignup(false);
      // Navigate to profile setup
      navigation.replace('ProfileSetup');
    } catch (err) {
      Alert.alert('Error', err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <View style={styles.validationItem}>
      <View style={[styles.validationIcon, isValid && styles.validationIconValid]}>
        {isValid && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
      </View>
      <Text style={[styles.validationText, isValid && styles.validationTextValid]}>
        {text}
      </Text>
    </View>
  );

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
          {/* Logo */}
          <Pressable onPress={dismissKeyboard}>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
            </View>
          </Pressable>

        {/* Join the Movement heading */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Join the Movement
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {showEmailSignup ? (
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

              {/* Name Input (Optional) */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Name <Text style={styles.optionalLabel}>(optional)</Text>
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
                  placeholder="Enter your name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>

              {/* Create Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Create Password
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
                    value={emailPassword}
                    onChangeText={setEmailPassword}
                    secureTextEntry={!showEmailPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowEmailPassword(!showEmailPassword)}
                  >
                    <Ionicons
                      name={showEmailPassword ? 'eye' : 'eye-outline'}
                      size={22}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Confirm Password
                </Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      {
                        backgroundColor: '#FFFFFF',
                        color: theme.colors.text,
                        borderColor: emailConfirmPassword.length > 0 && emailPassword !== emailConfirmPassword
                          ? '#E53935'
                          : theme.colors.border,
                        borderWidth: emailConfirmPassword.length > 0 && emailPassword !== emailConfirmPassword ? 1 : 1,
                      },
                    ]}
                    placeholder="Enter password again"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={emailConfirmPassword}
                    onChangeText={setEmailConfirmPassword}
                    secureTextEntry={!showEmailConfirmPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowEmailConfirmPassword(!showEmailConfirmPassword)}
                  >
                    <Ionicons
                      name={showEmailConfirmPassword ? 'eye' : 'eye-outline'}
                      size={22}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Confirm Password Validation Messages */}
                {emailConfirmPassword.length > 0 && emailPassword !== emailConfirmPassword && (
                  <Text style={styles.errorText}>Passwords don't match</Text>
                )}
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  { backgroundColor: '#000000' },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleEmailSignupSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.signupButtonText, { color: '#FFFFFF' }]}>
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { borderColor: theme.colors.border }]} />
                <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                  or
                </Text>
                <View style={[styles.dividerLine, { borderColor: theme.colors.border }]} />
              </View>
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

              {/* Create Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Create Password
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
                    onFocus={() => scrollToInput(120)}
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
                {password.length > 0 && (
                  <View style={styles.validationContainer}>
                    <ValidationItem
                      isValid={passwordValidation.length}
                      text="8-20 characters."
                    />
                    <ValidationItem
                      isValid={passwordValidation.hasLetterNumberSpecial}
                      text="At least one letter, number and special character"
                    />
                  </View>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Confirm Password
                </Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      {
                        backgroundColor: '#FFFFFF',
                        color: theme.colors.text,
                        borderColor: confirmPassword.length > 0 && password !== confirmPassword
                          ? '#E53935'
                          : theme.colors.border,
                        borderWidth: confirmPassword.length > 0 && password !== confirmPassword ? 1 : 1,
                      },
                    ]}
                    placeholder="Enter password again"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!loading}
                    onFocus={() => scrollToInput(220)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-outline'}
                      size={22}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {password.length > 0 && (!passwordValidation.length || !passwordValidation.hasLetterNumberSpecial) && (
                  <Text style={styles.errorText}>Please enter a valid password</Text>
                )}
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <Text style={styles.errorText}>Passwords don't match</Text>
                )}
              </View>


              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  { backgroundColor: '#000000' },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handlePhoneSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.signupButtonText, { color: '#FFFFFF' }]}>
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>

              {/* Sign Up With Other Methods Button */}
              <TouchableOpacity
                style={[
                  styles.otherMethodsButton,
                  { backgroundColor: '#FFFFFF', borderColor: theme.colors.border },
                ]}
                onPress={() => setShowOtherMethods(true)}
                disabled={loading}
              >
                <Text style={[styles.otherMethodsButtonText, { color: theme.colors.text }]}>
                  Sign Up With Other Methods
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { borderColor: theme.colors.border }]} />
                <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                  or
                </Text>
                <View style={[styles.dividerLine, { borderColor: theme.colors.border }]} />
              </View>
            </>
          )}
        </View>

        {/* Log In Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: '#FF6B35' }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue With Modal */}
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
                onPress={handleEmailSignUpPress}
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
                onPress={handleGoogleSignUp}
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
                  onPress={handleAppleSignUp}
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
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
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
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'PPAgrandirText-Bold',
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
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  passwordInputWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  validationContainer: {
    marginTop: 12,
    paddingLeft: 4,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  validationIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  validationIconValid: {
    backgroundColor: '#4CAF50',
  },
  validationText: {
    fontSize: 13,
    color: '#666666',
  },
  validationTextValid: {
    color: '#4CAF50',
  },
  errorText: {
    fontSize: 13,
    color: '#E53935',
    marginTop: 8,
    paddingLeft: 4,
  },
  signupButton: {
    height: 44,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
    fontSize: 16,
  },
  otpInfoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  otherMethodsButton: {
    height: 44,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  otherMethodsButtonText: {
    fontSize: 16,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  backToPhoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backToPhoneText: {
    fontSize: 16,
  },
  optionalLabel: {
    fontWeight: '400',
    color: '#888888',
  },
  modalBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  modalSubmitButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
