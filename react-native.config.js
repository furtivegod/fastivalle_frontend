module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    '@invertase/react-native-apple-authentication': {
      platforms: {
        android: null, // <-- ignore for Android
      },
    },
    "@react-native-google-signin/google-signin": {
      platforms: {
        android: null, // <-- ignore for Android
      },
    },
  },
};
