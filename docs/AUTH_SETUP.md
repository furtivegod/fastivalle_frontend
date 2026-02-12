# Google & Apple Sign-In Setup Guide

This guide explains how to configure Google and Apple Sign-In for the Fastivalle app.

## Google Sign-In

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sign-In** API (or **Google+ API**)
4. Go to **APIs & Services → Credentials**

### 2. Create OAuth Credentials

**Web Client (required for both iOS and Android):**

1. Click **Create Credentials → OAuth client ID**
2. Application type: **Web application**
3. Name it e.g. "Fastivalle Web"
4. Copy the **Client ID** — this is your `webClientId`

**iOS Client:**

1. Create Credentials → OAuth client ID
2. Application type: **iOS**
3. Name: "Fastivalle iOS"
4. Bundle ID: `org.reactjs.native.example.fastivalle` (or your actual bundle ID)
5. Copy the **Client ID** — this is your `iosClientId`

**Android Client:**

1. Create Credentials → OAuth client ID
2. Application type: **Android**
3. Package name: `com.fastivalle`
4. Get your SHA-1 fingerprint:
   ```bash
   cd android && ./gradlew signingReport
   ```
   Use the SHA-1 from `debug` or your release keystore
5. Add the SHA-1 and package name, then create

### 3. Update Configuration

Edit `src/config/auth.js` and replace the placeholders:

```javascript
webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
```

Or use environment variables:
```
GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=yyy.apps.googleusercontent.com
```

### 4. iOS URL Scheme (Required for Google Sign-In on iOS)

1. Get your **reversed client ID** from the iOS OAuth client:
   - If your iOS Client ID is `123456789-abc.apps.googleusercontent.com`
   - The reversed client ID is `com.googleusercontent.apps.123456789-abc`

2. Update `ios/fastivalle/Info.plist`:
   - Find `CFBundleURLSchemes` → `com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID`
   - Replace `YOUR_REVERSED_CLIENT_ID` with your actual reversed client ID (e.g. `123456789-abc`)

---

## Apple Sign-In

Apple Sign-In is **iOS only** and requires an Apple Developer account.

### 1. Apple Developer Portal

1. Go to [Apple Developer](https://developer.apple.com/) → Certificates, Identifiers & Profiles
2. Select your **App ID** (or create one)
3. Enable **Sign in with Apple** capability
4. Save

### 2. Xcode Configuration

The project already includes `fastivalle.entitlements` with the Sign in with Apple entitlement. You need to:

1. Open `ios/fastivalle.xcworkspace` in Xcode
2. Select your target → **Signing & Capabilities**
3. Ensure **Sign in with Apple** is added (it may already be there via the entitlements file)
4. Use a valid Team and provisioning profile

### 3. Testing

- **Apple Sign-In requires a real device** — it does not work in the iOS Simulator
- Sign in with Apple must be tested on a physical iPhone or iPad

---

## Running the App

### iOS

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Android

```bash
npx react-native run-android
```

---

## Troubleshooting

### Google Sign-In

- **DEVELOPER_ERROR (Android)**: Ensure your SHA-1 fingerprint is correctly added in Google Cloud Console and matches your keystore
- **iOS URL scheme crash**: Verify the reversed client ID in Info.plist exactly matches your iOS OAuth client
- Run the config doctor: `npx @react-native-google-signin/config-doctor`

### Apple Sign-In

- **Not supported**: Ensure you're testing on a real device with iOS 13+
- **Capability error**: Add Sign in with Apple in Xcode → Signing & Capabilities
- **Simulator**: Apple Sign-In does not work in the simulator
