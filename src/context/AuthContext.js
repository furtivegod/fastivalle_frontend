import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_AUTH_CONFIG } from '../config/auth';
import {
  getMe,
  loginWithEmail,
  loginWithPhone,
  registerWithEmail,
  registerWithPhone,
  loginWithGoogleBackend,
  loginWithAppleBackend,
} from '../services/authService';
import { setStoredToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // const configureGoogleSignIn = () => {
  //   try {
  //     GoogleSignin.configure({
  //       webClientId: GOOGLE_AUTH_CONFIG.webClientId,
  //       iosClientId:
  //         Platform.OS === 'ios' ? GOOGLE_AUTH_CONFIG.iosClientId : undefined,
  //       offlineAccess: true,
  //     });
  //   } catch (error) {
  //     console.warn('Google Sign-In configuration error:', error);
  //   }
  // };

  useEffect(() => {
    // configureGoogleSignIn();
    checkAuthStatus();
  }, []);

  /** On app start: validate stored token and set user from backend */
  const checkAuthStatus = async () => {
    try {
      const me = await getMe();
      if (me) {
        setUser(normalizeUser(me));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Auth status check:', error?.message || error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setAuthInitialized(true);
    }
  };

  /** Normalize backend user to a simple shape for the app */
  const normalizeUser = (u) => ({
    id: u._id || u.id,
    email: u.email,
    phone: u.phone,
    name: u.name,
    profileImage: u.profileImage,
    authProvider: u.authProvider,
    dateOfBirth: u.dateOfBirth,
    bio: u.bio,
    isPrivate: u.isPrivate,
  });

  /**
   * Login with email or phone + password.
   * @param {{ email?: string, phone?: string, password: string }} credentials
   */
  const login = async (credentials) => {
    const { email, phone, password } = credentials;
    if (email) {
      const { user: u } = await loginWithEmail(email, password);
      console.log('-=-=-', u)
      setUser(normalizeUser(u));
      return normalizeUser(u);
    }
    if (phone) {
      const { user: u } = await loginWithPhone(phone, password);
      setUser(normalizeUser(u));
      return normalizeUser(u);
    }
    throw new Error('Provide email or phone');
  };

  /**
   * Register with email or phone + password + optional name.
   * @param {{ email?: string, phone?: string, password: string, name?: string }} credentials
   */
  const register = async (credentials) => {
    const { email, phone, password, name } = credentials;
    if (email) {
      const { user: u } = await registerWithEmail({ email, password, name });
      setUser(normalizeUser(u));
      return normalizeUser(u);
    }
    if (phone) {
      const { user: u } = await registerWithPhone({ phone, password, name });
      setUser(normalizeUser(u));
      return normalizeUser(u);
    }
    throw new Error('Provide email or phone');
  };

  /** Google Sign-In: native flow then backend; stores token and user from backend */
  const signInWithGoogle = async () => {
    const userInfo = await GoogleSignin.signIn();
    if (!userInfo?.user) return null;
    try {
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens?.idToken;
      if (!idToken) throw new Error('No Google idToken');
      const { user: u } = await loginWithGoogleBackend(idToken);
      setUser(normalizeUser(u));
      return normalizeUser(u);
    } catch (err) {
      if (err.message?.includes('idToken') || err.message?.includes('Google')) {
        throw err;
      }
      throw new Error(err.message || 'Google sign-in failed');
    }
  };

  /** Apple Sign-In: pass native response; backend call stores token and user */
  const signInWithApple = async (appleAuthResponse) => {
    const identityToken = appleAuthResponse?.identityToken;
    const appleId = appleAuthResponse?.user;
    const email = appleAuthResponse?.email;
    const name = appleAuthResponse?.fullName
      ? [appleAuthResponse.fullName.givenName, appleAuthResponse.fullName.familyName]
          .filter(Boolean)
          .join(' ')
      : null;
    if (!appleId) throw new Error('Apple sign-in failed');
    const { user: u } = await loginWithAppleBackend(
      identityToken,
      appleId,
      email,
      name,
      appleAuthResponse?.authorizationCode || undefined
    );
    setUser(normalizeUser(u));
    return normalizeUser(u);
  };

  /** Set auth state from backend response (e.g. after Google sign-up fetch). */
  const setAuthFromResponse = async ({ token, user: u }) => {
    if (token) await setStoredToken(token);
    setUser(u ? normalizeUser(u) : null);
  };

  const signOut = async () => {
    try {
      await setStoredToken(null);
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.log('Sign out error:', error);
    }
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isLoading,
    authInitialized,
    isAuthenticated,
    login,
    register,
    signInWithGoogle,
    signInWithApple,
    setAuthFromResponse,
    signOut,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
