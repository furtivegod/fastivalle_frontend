/**
 * Ensures @react-native-async-storage/async-storage has PrivacyInfo.xcprivacy in ios/
 * so the RNCAsyncStorage-RNCAsyncStorage_resources Pod build phase (CpResource) succeeds.
 * Run automatically after npm install via postinstall.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const patchFile = path.join(projectRoot, 'scripts', 'patches', 'RNCAsyncStorage-PrivacyInfo.xcprivacy');
const targetDir = path.join(projectRoot, 'node_modules', '@react-native-async-storage', 'async-storage', 'ios');
const targetFile = path.join(targetDir, 'PrivacyInfo.xcprivacy');

if (!fs.existsSync(patchFile)) {
  console.warn('patch-async-storage-privacy: patch file not found, skipping');
  process.exit(0);
}

if (!fs.existsSync(path.join(projectRoot, 'node_modules', '@react-native-async-storage', 'async-storage'))) {
  process.exit(0);
}

try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.copyFileSync(patchFile, targetFile);
  console.log('patch-async-storage-privacy: PrivacyInfo.xcprivacy copied to AsyncStorage ios/');
} catch (err) {
  console.warn('patch-async-storage-privacy:', err.message);
}
