import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/tokens';

interface CircleIconProps {
  children: ReactNode;
  from: string;
  to: string;
  size?: number;
}

export function CircleIcon({ children, from, to, size = 32 }: CircleIconProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
        },
      ]}
    >
      <LinearGradient
        colors={[from, to]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <View style={StyleSheet.absoluteFill} />
      </LinearGradient>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </View>
    </View>
  );
}
