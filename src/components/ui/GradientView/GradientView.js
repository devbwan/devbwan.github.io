import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';

export function GradientView({ 
  children, 
  colors: gradientColors, 
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 },
  style,
  ...props 
}) {
  // Ensure gradientColors is an array
  const gradient = Array.isArray(gradientColors) 
    ? gradientColors 
    : (colors.gradientPrimary || ['#0A84FF', '#0066CC']);

  // Ensure start and end are objects with x and y properties
  const startPoint = Array.isArray(start) ? { x: start[0], y: start[1] } : start;
  const endPoint = Array.isArray(end) ? { x: end[0], y: end[1] } : end;

  return (
    <LinearGradient
      colors={gradient}
      start={startPoint}
      end={endPoint}
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

