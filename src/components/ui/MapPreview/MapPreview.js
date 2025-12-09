import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RunMapView } from '../../MapView';
import { colors } from '../../../theme';

export function MapPreview({ route, currentLocation, initialLocation, style, height = 200 }) {
  return (
    <View style={[styles.container, { height }, style]}>
      <RunMapView
        route={route}
        currentLocation={currentLocation}
        initialLocation={initialLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
});
