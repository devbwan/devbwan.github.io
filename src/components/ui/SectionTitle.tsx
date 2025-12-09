import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { typography, colors } from '@/theme/tokens';

interface SectionTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

export function SectionTitle({ children, style }: SectionTitleProps) {
  return (
    <Text
      style={[
        {
          ...typography.h2,
          color: colors.textStrong,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
