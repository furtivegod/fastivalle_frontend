import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

const FONT_FAMILY = 'Agrandir';
const LINE_HEIGHT_MULTIPLIER = 1.2; // 120%

/**
 * Base style: PP Agrandir + line-height 120% when fontSize is set.
 */
function getBaseStyle(style) {
  const flat = StyleSheet.flatten(style || {});
  const base = { fontFamily: FONT_FAMILY };
  const fontSize = flat.fontSize;
  if (fontSize != null && flat.lineHeight == null) {
    base.lineHeight = Math.round(fontSize * LINE_HEIGHT_MULTIPLIER);
  }
  return base;
}

/**
 * Text component that applies app font (PP Agrandir) and 120% line-height globally.
 * Use this instead of react-native's Text in all screens.
 */
const Text = (props) => {
  const base = getBaseStyle(props.style);
  return (
    <RNText
      {...props}
      style={[base, props.style]}
    />
  );
};

export default Text;
