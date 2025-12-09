import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../theme';

export function StatNumber({ value, label, style, valueStyle, labelStyle }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.value, valueStyle]}>
        {value}
      </Text>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  value: {
    ...typography.stat,
    color: colors.textStrong,
    fontFamily: typography.stat.fontFamily,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textLight,
    fontFamily: typography.caption.fontFamily,
  },
});
