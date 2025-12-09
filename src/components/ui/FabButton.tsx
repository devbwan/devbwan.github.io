import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from './Icon';
import { colors, radius, shadows, gradients } from '@/theme/tokens';

interface FabButtonProps {
  onPress: () => void;
  iconName: string;
  size?: number;
}

export function FabButton({ onPress, iconName, size = 60 }: FabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          position: 'absolute',
          bottom: 24,
          right: 24,
          ...shadows.fab,
        },
      ]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name="zap" size={24} color="#FFFFFF" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

