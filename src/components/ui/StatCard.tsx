import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleIcon } from './CircleIcon';
import { Icon } from './Icon';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

interface StatCardProps {
  iconName: string;
  iconColor: [string, string]; // gradient colors
  label: string;
  value: string | ReactNode;
}

export function StatCard({ iconName, iconColor, label, value }: StatCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.card,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          marginBottom: spacing.xs,
        }}
      >
        <CircleIcon from={iconColor[0]} to={iconColor[1]} size={32}>
          <Icon name={iconName} size={16} color="#FFFFFF" />
        </CircleIcon>
        <Text
          style={{
            fontSize: 13,
            color: colors.textLight,
            fontWeight: '500',
          }}
        >
          {label}
        </Text>
      </View>
      {typeof value === 'string' ? (
        <Text
          style={{
            ...typography.stat,
            color: colors.textStrong,
          }}
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
}

