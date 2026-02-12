#!/usr/bin/env node
/**
 * Cleans Android Gradle caches to fix "Could not move temporary workspace" on Windows.
 * Run: npm run android:clean
 */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const androidDir = path.join(root, 'android');
const gradleDir = path.join(androidDir, '.gradle');
const isWin = process.platform === 'win32';
const gradlew = isWin ? 'gradlew.bat' : './gradlew';

function run(cmd, opts = {}) {
  try {
    execSync(cmd, { cwd: androidDir, stdio: 'inherit', ...opts });
  } catch (e) {
    // ignore exit code
  }
}

console.log('Stopping Gradle daemons...');
run(`${gradlew} --stop`);

if (fs.existsSync(gradleDir)) {
  console.log('Removing android/.gradle cache...');
  try {
    fs.rmSync(gradleDir, { recursive: true, force: true });
    console.log('Done. Run "npm run android" to build again.');
  } catch (err) {
    console.error('Could not delete .gradle (a process may be locking it).');
    console.error('Close Android Studio, run "gradlew.bat --stop" from android/, then delete the folder android\\.gradle manually.');
    process.exit(1);
  }
} else {
  console.log('No .gradle folder found.');
}

console.log('Running gradlew clean...');
run(`${gradlew} clean`);
