import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  const orbAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating orbs
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(orbAnim, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    ).start();

    // Logo glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Navigate to welcome
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const orb1Translate = orbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const orb2Translate = orbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E6F7FF" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#DFF7FF', '#EBFAFF', '#F6FCFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Orbs */}
      <Animated.View
        style={[
          styles.orb,
          {
            backgroundColor: 'rgba(14,165,233,0.25)',
            top: -width * 0.4,
            right: -width * 0.3,
            transform: [{ translateY: orb1Translate }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            backgroundColor: 'rgba(59,130,246,0.20)',
            bottom: -width * 0.2,
            left: -width * 0.25,
            transform: [{ translateY: orb2Translate }],
          },
        ]}
      />

      {/* Main Layout */}
      <View style={styles.scrollContent}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                shadowOpacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 0.45],
                }),
              },
            ]}
          >
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles.appName}>GIET</Text>
          <View style={styles.glowLine} />
          <Text style={styles.appSubname}>GRIEVANCE</Text>
        </View>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dotAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.3, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dotAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dotAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.3, 1],
                }),
              },
            ]}
          />
        </View>

        {/* Footer Credit */}
        <View style={styles.creditContainer}>
          <Text style={styles.creditText}>
            Designed & built with ❤️ by{' '}
            <Text style={styles.teamName}>TEAM NEXUS</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* --- Styles --- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF7FF' },

  orb: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    opacity: 0.45,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },

  /* Logo Section */
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
  },
  logoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(14,165,233,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowRadius: 25,
    elevation: 10,
  },
  logo: { width: 140, height: 140 },
  appName: {
    fontSize: 46,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 20,
  },
  glowLine: {
    width: 80,
    height: 3,
    backgroundColor: '#0EA5E9',
    marginVertical: 10,
    borderRadius: 2,
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  appSubname: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0EA5E9',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },

  /* Loading */
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: height * 0.1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },

  /* Footer */
  creditContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  creditText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  teamName: {
    fontWeight: '700',
    color: '#0EA5E9',
    letterSpacing: 1,
  },
});
