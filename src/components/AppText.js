import React from 'react';
import { Text as RNText } from 'react-native';

const FONT_FAMILY = 'Agrandir';

/**
 * Text component that automatically applies the app font (Agrandir).
 * Use this instead of react-native's Text in all screens.
 */
const Text = (props) => (
  <RNText {...props} style={[{ fontFamily: FONT_FAMILY }, props.style]} />
);

export default Text;
