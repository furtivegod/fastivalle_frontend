# Fonts

Place Agrandir font files here so they are linked by React Native.

**Required files (add the .ttf or .otf you have):**
- Agrandir Regular (e.g. `PPAgrandir-Regular.ttf`)
- Agrandir Medium (e.g. `PPAgrandir-Medium.ttf`) – optional, for medium weight
- Agrandir Bold (e.g. `PPAgrandir-Bold.ttf`)

The app uses the family name **"Agrandir"**. If your font files use a different internal name, you may need to use that exact name in the app (e.g. "Agrandir Grand").

After adding the files, run:
```bash
npx react-native-asset
```
Then rebuild the app (`npx react-native run-ios` or `run-android`).
