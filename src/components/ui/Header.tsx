import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleIcon } from './CircleIcon';
import { Icon } from './Icon';
import { colors, spacing, typography } from '@/theme/tokens';

interface HeaderProps {
  title?: string;
  rightElement?: ReactNode;
}

export function Header({ title = 'RunWave', rightElement }: HeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
        }}
      >
        <CircleIcon from={colors.primary.light} to={colors.primary.dark} size={32}>
          <Icon name="zap" size={20} color="#FFFFFF" />
        </CircleIcon>
        <Text
          style={{
            ...typography.h1,
            color: colors.textStrong,
          }}
        >
          {title}
        </Text>
      </View>
      {rightElement}
    </View>
  );
}

