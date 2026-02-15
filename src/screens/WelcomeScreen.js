import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../components';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import {
  signInWithGoogle as googleSignIn,
  signInWithApple as appleSignIn,
  isAppleSignInSupported,
} from '../services/authService';

const screenWidth = Dimensions.get('window').width;
/**
 * Welcome screen: centered text, Get Started button, Google/Apple sign-in, Log In link.
 */
const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { signInWithGoogle, signInWithApple: setAppleUser } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <ImageBackground
      source={require('../../assets/images/welcome_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome</Text>
          <Text style={styles.subHeaderTitle}>A space to create, and grow - where your faith, voice, and purpose come together</Text>
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>CREATE YOUR RHYTHM.  FIND{'\n'}YOUR PEOPLE. GROW YOUR FAITH</Text>
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Google Sign-In */}
          {/* <TouchableOpacity
            style={styles.socialButton}
            onPress={async () => {
              try {
                setLoading(true);
                const authUser = await signInWithGoogle();
                if (authUser) navigation.navigate('MainTabs');
              } catch (error) {
                Alert.alert('Error', error.message || 'Google sign-in failed');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1A1A1A" size="small" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#1A1A1A" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity> */}

          {/* Apple Sign-In - iOS only */}
          {/* {isAppleSignInSupported() && (
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={async () => {
                try {
                  setLoading(true);
                  const appleResponse = await appleSignIn();
                  if (appleResponse) {
                    const authUser = setAppleUser(appleResponse);
                    if (authUser) {
                      // Auth state update will trigger AppNavigator to show MainTabs
                    }
                  }
                } catch (error) {
                  Alert.alert('Error', error.message || 'Apple sign-in failed');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
                  <Text style={[styles.socialButtonText, { color: '#FFFFFF' }]}>
                    Continue with Apple
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )} */}

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 32,
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: 80,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  descriptionContainer: {
    alignItems: 'flex-end',
    marginBottom: 45,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'left',
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 'bold',
    fontFamily: 'PPAgrandirText-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subHeaderTitle: {
    fontSize: 14,
    maxWidth: '90%',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 100,
    minWidth: 240,
    alignItems: 'center',
    marginBottom: 24,
    width: "100%",
  },
  primaryButtonText: {
    fontSize: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    minWidth: 240,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  loginPrompt: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 14,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
