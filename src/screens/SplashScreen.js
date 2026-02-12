import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';

/**
 * Splash screen: animated cursive 'f' logo (Lottie) on green gradient background.
 * Uses the extracted JSON animation file.
 */
const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('../../assets/images/splash_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../assets/lottie/spl_scr_wh.json')}
          autoPlay
          loop={false}
          speed={1}
          style={styles.lottie}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 250,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
