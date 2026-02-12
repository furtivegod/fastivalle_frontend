import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// BlurView is native-only; use fallback for web
let BlurView = null;
if (Platform.OS !== 'web') {
  try {
    BlurView = require('@react-native-community/blur').BlurView;
  } catch (e) {
    // Blur not available
  }
}

/**
 * Shared background for Login and Signup screens:
 * - Full-screen Lottie animation
 * - Blur overlay (native) or semi-transparent gradient (web)
 * - Gradient overlay for consistent look
 */
const AuthScreenBackground = ({ lottieSource = require('../../assets/lottie/log_in.json') }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Layer 1: Lottie animation - full screen */}
      <View style={styles.lottieContainer}>
        <LottieView
          source={lottieSource}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Layer 2: Blur overlay (native) or semi-transparent overlay (web) */}
      {BlurView ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={12}
          reducedTransparencyFallbackColor="rgba(245, 245, 240, 0.85)"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.blurFallback]} />
      )}

      {/* Layer 3: Gradient overlay for depth and readability */}
      {/* <View style={styles.gradientOverlay} pointerEvents="none">
        <View style={[styles.gradientLayer, styles.gradientLayer1]} />
        <View style={[styles.gradientLayer, styles.gradientLayer2]} />
        <View style={[styles.gradientLayer, styles.gradientLayer3]} />
        <View style={[styles.gradientLayer, styles.gradientLayer4]} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  lottieContainer: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_HEIGHT * 1.2,
    left: -SCREEN_WIDTH * 0.1,
    top: -SCREEN_HEIGHT * 0.1,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  blurFallback: {
    backgroundColor: 'rgba(245, 245, 240, 0.75)',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    overflow: 'hidden',
  },
  gradientLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  gradientLayer1: {
    bottom: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 107, 53, 0.35)',
  },
  gradientLayer2: {
    bottom: '25%',
    height: '25%',
    backgroundColor: 'rgba(255, 183, 77, 0.3)',
  },
  gradientLayer3: {
    bottom: '50%',
    height: '25%',
    backgroundColor: 'rgba(165, 214, 167, 0.25)',
  },
  gradientLayer4: {
    bottom: '75%',
    height: '25%',
    backgroundColor: 'rgba(232, 245, 233, 0.2)',
  },
});

export default AuthScreenBackground;
