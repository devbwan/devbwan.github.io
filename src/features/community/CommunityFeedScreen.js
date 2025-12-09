import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PageContainer, Card } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export function CommunityFeedScreen() {
  const mockPosts = [
    { id: 1, user: '러너1', distance: 5.2, time: '25분', pace: '4:48/km' },
    { id: 2, user: '러너2', distance: 10.0, time: '45분', pace: '4:30/km' },
    { id: 3, user: '러너3', distance: 3.5, time: '18분', pace: '5:08/km' },
  ];

  return (
    <PageContainer scrollable>
      {mockPosts.map((post) => (
        <Card key={post.id} style={styles.postCard}>
          <Text style={styles.userName}>{post.user}</Text>
          <View style={styles.postStats}>
            <Text style={styles.statText}>{post.distance}km</Text>
            <Text style={styles.statText}> • </Text>
            <Text style={styles.statText}>{post.time}</Text>
            <Text style={styles.statText}> • </Text>
            <Text style={styles.statText}>{post.pace}</Text>
          </View>
        </Card>
      ))}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  postCard: {
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.body,
    color: colors.textStrong,
    marginBottom: spacing.sm,
    fontFamily: typography.body.fontFamily,
  },
  postStats: {
    flexDirection: 'row',
  },
  statText: {
    ...typography.caption,
    color: colors.textLight,
    fontFamily: typography.caption.fontFamily,
  },
});
