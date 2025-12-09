import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated';
  style?: ViewStyle;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  const shadowStyle = variant === 'elevated' ? shadows.card : {};
  
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.cardBorder,
          ...shadowStyle,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
