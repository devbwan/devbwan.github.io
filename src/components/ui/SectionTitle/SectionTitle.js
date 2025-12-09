import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

export function SectionTitle({ children, style }) {
  return (
    <Text style={[styles.title, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    color: colors.textStrong,
    marginBottom: spacing.sm,
    fontFamily: typography.h2.fontFamily,
  },
});
