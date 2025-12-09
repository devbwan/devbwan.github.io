import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CircleIcon } from './CircleIcon';
import { colors, spacing } from '@/theme/tokens';

interface CommunityRowProps {
  name: string;
  distance: number | string;
  time: string;
  avatarColor: [string, string];
  photoURL?: string | null;
}

export function CommunityRow({ name, distance, time, avatarColor, photoURL }: CommunityRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}
    >
      {photoURL ? (
        <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden' }}>
          <Image
            source={{ uri: photoURL }}
            style={{ width: 40, height: 40 }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <CircleIcon from={avatarColor[0]} to={avatarColor[1]} size={40}>
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 16,
            }}
          >
            {name[0]}
          </Text>
        </CircleIcon>
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            color: colors.textStrong,
            fontWeight: '600',
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.textLight,
          }}
        >
          {distance}km 러닝 완료
        </Text>
      </View>
      <Text
        style={{
          fontSize: 12,
          color: colors.primary.light,
          fontWeight: '600',
        }}
      >
        {time}
      </Text>
    </View>
  );
}

