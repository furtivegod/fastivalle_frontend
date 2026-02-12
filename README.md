# fastivalle

## Running the app (iOS / Android)

**Start the Metro bundler first**, then run the app:

```bash
# Terminal 1 – start Metro
npm start

# Terminal 2 – run iOS or Android
npm run ios
# or
npm run android
```

If you see **"No bundle URL present"** on iOS, Metro was not running. Start `npm start`, then run the app again.

## Android build on Windows – "Could not move temporary workspace" fix

If the Android build fails with **Could not move temporary workspace ... to immutable location**:

1. **Stop Gradle daemons** (in project root):
   ```bat
   cd android
   gradlew.bat --stop
   cd ..
   ```

2. **Close** Android Studio / any IDE and **temporarily exclude** the project folder from antivirus real-time scan (optional but helps).

3. **Delete the Gradle cache** in the project:
   - Delete the folder: `android\.gradle`
   - Or run: `npm run android:clean`

4. **Build again:**
   ```bat
   npm run android
   ```

If the error persists, also delete the global Gradle cache: `%USERPROFILE%\.gradle\caches` (or run `gradlew.bat --stop` from `android` and delete `android\.gradle` again after a reboot).

## iOS – `pod install` CDN timeout (SocketRocket / jsdelivr)

If `pod install` fails with **CDN: trunk URL couldn't be downloaded ... Timeout was reached**:

- The Podfile is already set to use the GitHub specs repo to avoid the CDN. Run again:
  ```bash
  cd ios && pod install
  ```
- If it still times out, use only the GitHub repo and retry:
  ```bash
  pod repo remove trunk   # optional: use only GitHub specs
  pod install
  ```