import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { apiRequest, setStoredToken } from './api';

/**
 * Centralized auth service: email/phone login & signup + Google/Apple Sign-In.
 * Handles platform-specific logic and backend API calls.
 */

// ---------- Email / Phone (backend) ----------

/**
 * Login with email and password.
 * @returns {{ user, token }} or throws with message
 */
export const loginWithEmail = async (email, password) => {
  const res = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  if (!res.ok) throw new Error(res.error || 'Login failed');
  const { user, token } = res.data?.data || res.data || {};
  if (!token || !user) throw new Error('Invalid response from server');
  await setStoredToken(token);
  return { user, token };
};

/**
 * Login with phone and password.
 * @returns {{ user, token }} or throws with message
 */
export const loginWithPhone = async (phone, password) => {
  const res = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone: phone.trim(), password }),
  });
  if (!res.ok) throw new Error(res.error || 'Login failed');
  const { user, token } = res.data?.data || res.data || {};
  if (!token || !user) throw new Error('Invalid response from server');
  await setStoredToken(token);
  return { user, token };
};

/**
 * Register with email, password, and optional name.
 * @returns {{ user, token }} or throws with message
 */
export const registerWithEmail = async ({ email, password, name }) => {
  const res = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      name: name?.trim() || undefined,
    }),
  });
  if (!res.ok) throw new Error(res.error || 'Registration failed');
  const { user, token } = res.data?.data || res.data || {};
  if (!token || !user) throw new Error('Invalid response from server');
  await setStoredToken(token);
  return { user, token };
};

/**
 * Register with phone, password, and optional name.
 * @returns {{ user, token }} or throws with message
 */
export const registerWithPhone = async ({ phone, password, name }) => {
  const res = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      phone: phone.trim(),
      password,
      name: name?.trim() || undefined,
    }),
  });
  if (!res.ok) throw new Error(res.error || 'Registration failed');
  const { user, token } = res.data?.data || res.data || {};
  if (!token || !user) throw new Error('Invalid response from server');
  await setStoredToken(token);
  return { user, token };
};

/**
 * Get current user from backend (validates token).
 * @returns { user } or null if invalid/expired
 */
export const getMe = async () => {
  const res = await apiRequest('/api/auth/me', { method: 'GET' });
  if (!res.ok) return null;
  const user = res.data?.data ?? res.data;
  return user || null;
};

// ---------- OTP Functions ----------

/**
 * Send OTP to phone number.
 * @param {string} phone - Phone number with country code
 * @param {'signup' | 'login'} type - OTP type
 * @returns {{ success, message, expiresIn, devOtp? }} or throws
 */
export const sendOTP = async (phone, type) => {
  const res = await apiRequest('/api/otp/send', {
    method: 'POST',
    body: JSON.stringify({ phone: phone.trim(), type }),
  });
  if (!res.ok) throw new Error(res.error || 'Failed to send OTP');
  return res.data;
};

/**
 * Verify OTP and authenticate user.
 * @param {string} phone - Phone number
 * @param {string} otp - 6-digit OTP
 * @param {'signup' | 'login'} type - OTP type
 * @param {string} [name] - Optional name for signup
 * @param {string} [password] - Optional password for signup
 * @returns {{ user, token }} or throws
 */
export const verifyOTP = async (phone, otp, type, name, password) => {
  const res = await apiRequest('/api/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone: phone.trim(), otp, type, name: name?.trim(), password: password || undefined }),
  });
  if (!res.ok) throw new Error(res.error || 'Failed to verify OTP');
  const { user, token } = res.data || {};
  if (!token || !user) throw new Error('Invalid response from server');
  await setStoredToken(token);
  return { user, token };
};

/**
 * Resend OTP to phone number.
 * @param {string} phone - Phone number
 * @param {'signup' | 'login'} type - OTP type
 */
export const resendOTP = async (phone, type) => {
  return sendOTP(phone, type);
};

/**
 * Sign in with Google: send idToken to backend and return user + token.
 * Call after GoogleSignin.signIn() and GoogleSignin.getTokens().
 */
export const loginWithGoogleBackend = async (idToken) => {
  const res = await apiRequest('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error(res.error || 'Google sign-in failed');
  const { user, token } = res.data?.data || res.data || {};
  if (!token || !user) throw new Error('Invalid response from server');
  await setStoredToken(token);
  return { user, token };
};

/**
 * Sign in with Apple: send identityToken to backend and return user + token.
 */
export const loginWithAppleBackend = async (identityToken, appleId, email, name, nonce) => {
  const res = await apiRequest('/api/auth/apple', {
    method: 'POST',
    body: JSON.stringify({
      identityToken,
      appleId,
      email,
      name,
      nonce,
    }),
  });
  if (!res.ok) throw new Error(res.error || 'Apple sign-in failed');
  const { user, token } = res.data?.data || res.data || {};
  if (!token || !user) throw new Error('Invalid response from server');
  await setStoredToken(token);
  return { user, token };
};

// ---------- Native Google / Apple (SDK only) ----------

export const signInWithGoogle = async () => {
  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices();
    }
    const userInfo = await GoogleSignin.signIn();
    return userInfo?.user || null;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return null; // User cancelled - not an error
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Sign-in already in progress');
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services not available');
    }
    throw error;
  }
};

export const signInWithApple = async () => {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple Sign-In is only available on iOS');
  }
  if (!appleAuth.isSupported) {
    throw new Error('Apple Sign-In is not supported on this device');
  }

  try {
    const requestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      requestResponse.user
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      return requestResponse;
    }
    if (credentialState === appleAuth.State.CANCELED) {
      return null; // User cancelled
    }
    throw new Error('Apple Sign-In authorization failed');
  } catch (error) {
    if (error.code === appleAuth.Error.CANCELED) {
      return null; // User cancelled - not an error
    }
    throw error;
  }
};

export const isAppleSignInSupported = () =>
  Platform.OS === 'ios' && appleAuth.isSupported;
