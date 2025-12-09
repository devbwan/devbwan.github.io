import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme';

export function GradientView({ 
  children, 
  colors: gradientColors, 
  start = [0, 0], 
  end = [1, 1],
  style,
  ...props 
}) {
  const gradient = gradientColors || colors.gradientPrimary;

  return (
    <LinearGradient
      colors={gradient}
      start={start}
      end={end}
      style={[styles.gradient, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

