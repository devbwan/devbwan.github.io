import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RunMapView } from '../../components/MapView';
import { SectionTitle } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export function CommunityMapScreen() {
  const nearbyRunners = [
    { id: 1, name: '러너1', distance: '2.5km' },
    { id: 2, name: '러너2', distance: '5.0km' },
    { id: 3, name: '러너3', distance: '1.8km' },
  ];

  return (
    <View style={styles.container}>
      {/* Absolute positioned map */}
      <View style={styles.mapContainer}>
        <RunMapView 
          route={[]}
          currentLocation={null}
          initialLocation={{ lat: 37.5665, lng: 126.978 }}
        />
      </View>

      {/* Bottom sheet (height 40%) */}
      <View style={styles.bottomSheet}>
        <SectionTitle>Nearby Runners</SectionTitle>
        {nearbyRunners.map((runner) => (
          <View key={runner.id} style={styles.runnerRow}>
            <Text style={styles.runnerName}>{runner.name}</Text>
            <Text style={styles.runnerDistance}>{runner.distance}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '40%',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  runnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  runnerName: {
    ...typography.body,
    color: colors.textStrong,
    fontFamily: typography.body.fontFamily,
  },
  runnerDistance: {
    ...typography.caption,
    color: colors.textLight,
    fontFamily: typography.caption.fontFamily,
  },
});
