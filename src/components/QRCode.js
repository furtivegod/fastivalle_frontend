import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCodeSvg from 'react-native-qrcode-svg';

/**
 * Displays a QR code encoding the given value.
 * Use for tickets, orders, or any string payload for scanning.
 *
 * @param {string} value - Data to encode (e.g. order id, ticket id, URL)
 * @param {number} size - Width/height of the QR in pixels (default 200)
 * @param {string} color - QR module color (default black)
 * @param {string} backgroundColor - Background color (default white)
 */
const QRCode = ({
  value,
  size = 200,
  color = '#000000',
  backgroundColor = '#FFFFFF',
  style,
}) => {
  if (!value) return null;

  return (
    <View style={[styles.wrap, style]}>
      <QRCodeSvg
        value={String(value)}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
        quietZone={8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCode;
