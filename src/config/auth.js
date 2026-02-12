/**
 * API and Auth configuration
 *
 * API: Set API_BASE_URL to your backend (e.g. http://localhost:5000 for dev).
 * - iOS Simulator: http://localhost:5000
 * - Android Emulator: http://10.0.2.2:5000 (set below via Platform)
 * - Physical device: use your machine's IP, e.g. http://192.168.1.100:5000
 */

import { Platform } from 'react-native';

const defaultBaseUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'https://fastivalle-backend.vercel.app';
  // const defaultBaseUrl =
  // Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  defaultBaseUrl;

/**
 * Auth configuration for Google and Apple Sign-In
 *
 * SETUP INSTRUCTIONS:
 *
 * GOOGLE SIGN-IN:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create/select a project
 * 3. Enable "Google Sign-In" API
 * 4. Create OAuth 2.0 credentials:
 *    - Web client (for both iOS and Android): Copy the Client ID as webClientId
 *    - iOS client: Create OAuth client for iOS, add your bundle ID, copy Client ID as iosClientId
 *    - Android client: Create OAuth client for Android, add your package name (com.fastivalle) and SHA-1 fingerprint
 * 5. For iOS: Add the reversed client ID (e.g. com.googleusercontent.apps.XXXXX) to Info.plist URL scheme
 *
 * APPLE SIGN-IN:
 * 1. In Apple Developer portal, enable "Sign in with Apple" for your App ID
 * 2. In Xcode, add "Sign in with Apple" capability to your target
 * 3. Test on a real device (required for Apple Sign-In)
 */

const WEB_CLIENT_ID =
  process.env.GOOGLE_WEB_CLIENT_ID ||
  '426653897778-58k7osl5aaui7pjpu11ke1lvul6iue86.apps.googleusercontent.com';

// On iOS use a real client ID; placeholder causes "missing URL scheme" crash.
const IOS_CLIENT_ID =
  process.env.GOOGLE_IOS_CLIENT_ID ||
  (Platform.OS === 'ios' ? WEB_CLIENT_ID : '426653897778-58k7osl5aaui7pjpu11ke1lvul6iue86.apps.googleusercontent.com');

export const GOOGLE_AUTH_CONFIG = {
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  getReversedClientId: () => {
    const id = Platform.OS === 'ios' ? IOS_CLIENT_ID : WEB_CLIENT_ID;
    // Full prefix before .apps.googleusercontent.com (e.g. 426653897778-58k7... or 1:426653897778:web:...)
    const match = id.match(/^(.+)\.apps\.googleusercontent\.com$/);
    if (match) return `com.googleusercontent.apps.${match[1].replace(/:/g, '-')}`;
    return 'com.googleusercontent.apps.426653897778-58k7osl5aaui7pjpu11ke1lvul6iue86';
  },
};
