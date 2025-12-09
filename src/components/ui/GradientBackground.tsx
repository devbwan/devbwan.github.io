import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/theme/tokens';

interface GradientBackgroundProps {
  children: ReactNode;
  gradient: 'primary' | 'orange' | 'green' | 'purple';
  style?: ViewStyle;
}

const gradientMap = {
  primary: gradients.primary,
  orange: gradients.orange,
  green: gradients.green,
  purple: gradients.purple,
};

export function GradientBackground({ children, gradient, style }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={gradientMap[gradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, style]}
    >
      {children}
    </LinearGradient>
  );
}

