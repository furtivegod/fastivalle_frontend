import React from 'react';
import { TextInput as RNTextInput } from 'react-native';

const FONT_FAMILY = 'Agrandir';

/**
 * TextInput component that automatically applies the app font (Agrandir).
 * Use this instead of react-native's TextInput in all screens.
 */
const TextInput = (props) => (
  <RNTextInput {...props} style={[{ fontFamily: FONT_FAMILY }, props.style]} />
);

export default TextInput;
