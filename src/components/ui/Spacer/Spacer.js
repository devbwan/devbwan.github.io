import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Spacer({ height }) {
  return <View style={[styles.spacer, { height }]} />;
}

const styles = StyleSheet.create({
  spacer: {
    flexShrink: 0,
  },
});
