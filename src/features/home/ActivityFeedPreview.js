import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export function ActivityFeedPreview({ activities = [], onViewAll }) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>최근 활동</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
            <Text style={styles.viewAll}>전체 보기</Text>
          </TouchableOpacity>
        )}
      </View>
      {activities.slice(0, 5).map((activity, index) => (
        <View key={index} style={styles.activityItem}>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{activity.title || '러닝 기록'}</Text>
            <Text style={styles.activityMeta}>
              {activity.distance ? `${(activity.distance / 1000).toFixed(2)}km` : ''}
              {activity.duration ? ` • ${Math.floor(activity.duration / 60)}분` : ''}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textStrong,
    fontFamily: typography.h2.fontFamily,
  },
  viewAll: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: typography.caption.fontFamily,
  },
  activityItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...typography.body,
    color: colors.textStrong,
    marginBottom: spacing.xs,
    fontFamily: typography.body.fontFamily,
  },
  activityMeta: {
    ...typography.caption,
    color: colors.textLight,
    fontFamily: typography.caption.fontFamily,
  },
});
