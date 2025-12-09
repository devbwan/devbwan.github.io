import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/components/ui';
import { colors, spacing, radius, shadows } from '@/theme/tokens';

export default function LoadingScreen() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim3 = useRef(new Animated.Value(0)).current;
  const ringAnim1 = useRef(new Animated.Value(1)).current;
  const ringAnim2 = useRef(new Animated.Value(1)).current;
  const ringAnim3 = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shine animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bounce animations
    const createBounce = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.5,
              duration: 400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(400),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 0,
              duration: 400,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.5,
              duration: 400,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    createBounce(bounceAnim1, 0).start();
    createBounce(bounceAnim2, 200).start();
    createBounce(bounceAnim3, 400).start();

    // Ring animations
    const createRing = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 2,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createRing(ringAnim1, 0).start();
    createRing(ringAnim2, 500).start();
    createRing(ringAnim3, 1000).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const shineOpacity = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const bounceScale1 = bounceAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const bounceOpacity1 = bounceAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const bounceScale2 = bounceAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const bounceOpacity2 = bounceAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const bounceScale3 = bounceAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const bounceOpacity3 = bounceAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const ringOpacity1 = ringAnim1.interpolate({
    inputRange: [1, 2],
    outputRange: [1, 0],
  });

  const ringOpacity2 = ringAnim2.interpolate({
    inputRange: [1, 2],
    outputRange: [1, 0],
  });

  const ringOpacity3 = ringAnim3.interpolate({
    inputRange: [1, 2],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Gradient */}
      <Animated.View
        style={[
          styles.backgroundGradient,
          {
            opacity: pulseAnim,
          },
        ]}
      >
        <View style={styles.gradientCircle} />
      </Animated.View>

      {/* Animated Rings */}
      <View style={styles.ringsContainer}>
        <Animated.View
          style={[
            styles.ring,
            styles.ring1,
            {
              transform: [{ scale: ringAnim1 }],
              opacity: ringOpacity1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring2,
            {
              transform: [{ scale: ringAnim2 }],
              opacity: ringOpacity2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring3,
            {
              transform: [{ scale: ringAnim3 }],
              opacity: ringOpacity3,
            },
          ]}
        />
      </View>

      {/* Logo and Brand */}
      <View style={styles.content}>
        {/* Logo Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ translateY: floatTranslateY }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary.light, colors.primary.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Icon name="zap" size={56} color="#FFFFFF" />
            {/* Shine Effect */}
            <Animated.View
              style={[
                styles.shineOverlay,
                {
                  opacity: shineOpacity,
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Brand Name */}
        <Text style={styles.brandName}>RunWave</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>당신의 러닝을 기록하다</Text>

        {/* Loading Spinner */}
        <View style={styles.spinnerContainer}>
          <Animated.View
            style={[
              styles.spinnerDot,
              {
                transform: [{ scale: bounceScale1 }],
                opacity: bounceOpacity1,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.spinnerDot,
              {
                transform: [{ scale: bounceScale2 }],
                opacity: bounceOpacity2,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.spinnerDot,
              {
                transform: [{ scale: bounceScale3 }],
                opacity: bounceOpacity3,
              },
            ]}
          />
        </View>
      </View>

      {/* Bottom Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 600,
    height: 600,
    marginLeft: -300,
    marginTop: -300,
    borderRadius: 300,
  },
  gradientCircle: {
    flex: 1,
    borderRadius: 300,
    backgroundColor: colors.primary.light,
    opacity: 0.2,
  },
  ringsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 2,
  },
  ring1: {
    width: 256,
    height: 256,
    borderColor: `${colors.primary.light}33`, // 20% opacity
  },
  ring2: {
    width: 192,
    height: 192,
    borderColor: `${colors.primary.light}4D`, // 30% opacity
  },
  ring3: {
    width: 128,
    height: 128,
    borderColor: `${colors.primary.light}66`, // 40% opacity
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    marginBottom: spacing.xl,
    ...shadows.fab,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shineOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.textStrong,
    letterSpacing: -0.03,
    marginBottom: spacing.sm,
    textShadowColor: `${colors.primary.light}66`,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: spacing.xl * 1.5,
  },
  spinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  spinnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.light,
  },
  versionContainer: {
    position: 'absolute',
    bottom: spacing.xl * 1.5,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[300],
  },
});

