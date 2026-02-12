const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // Add .lottie to asset extensions so Metro can bundle Lottie files
    assetExts: [...defaultConfig.resolver.assetExts, 'lottie'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
