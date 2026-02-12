# Lottie Animations

Lottie animations for Fastivalle (login/signup from `lott.zip`, splash from `lott (1).zip`).

| File | Suggested use |
|------|----------------|
| `spl_scr_wh.lottie` | **Splash screen** (white variant) |
| `spl_scr_or.lottie` | **Splash screen** (orange variant) |
| `log_in.lottie` | Login screen background |
| `ban_sup.lottie` | Sign up screen background |

## Splash screen

```javascript
import LottieView from 'lottie-react-native';

<LottieView
  source={require('../assets/lottie/spl_scr_or.lottie')}
  autoPlay
  loop={false}
  style={{ width: 200, height: 200 }}
/>
```

## Auth screens (Login / Sign up)

Used via `AuthScreenBackground` with blur overlay; see `src/components/AuthScreenBackground.js`.

Requires `lottie-react-native` (see package.json).
