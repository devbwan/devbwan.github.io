import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../theme';

export function Avatar({ 
  source, 
  name, 
  size = 48,
  style 
}) {
  const initials = name 
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {source ? (
        <Image source={source} style={styles.image} />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: colors.primary }]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontFamily: typography.h2.fontFamily,
    fontWeight: '700',
  },
});

