import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../theme';

export function PageContainer({ 
  children, 
  scrollable = false, 
  style,
  contentContainerStyle,
  ...props 
}) {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable 
    ? { 
        contentContainerStyle: [styles.scrollContent, contentContainerStyle],
        showsVerticalScrollIndicator: false,
      }
    : {};

  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={['top']}>
      <Container style={styles.container} {...containerProps} {...props}>
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
});
