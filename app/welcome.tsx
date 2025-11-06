import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const orbAnim = useRef(new Animated.Value(0)).current;

  // Floating orbs for gentle motion
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(orbAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Logo Section --- */}
        <View style={styles.logoSection}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appName}>GIET</Text>
          <View style={styles.glowLine} />
          <Text style={styles.appSubname}>GRIEVANCE</Text>
        </View>

        {/* --- Bottom Section --- */}
        <View style={styles.bottomSection}>
          {/* Glowing Glass Button */}
          <TouchableOpacity
            style={styles.glassButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.9}
          >
            {/* Glass inner gradient */}
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.9)',
                'rgba(255,255,255,0.75)',
                'rgba(14,165,233,0.15)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Glowing cyan border overlay */}
            <View style={styles.glowBorder} />

            <Text style={styles.glassButtonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Footer Credit */}
          <View style={styles.creditContainer}>
            <Text style={styles.creditText}>
              Designed & built with ❤️ by{' '}
              <Text style={styles.teamName}>TEAM NEXUS</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
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

  /* --- Logo --- */
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
    shadowOpacity: 0.2,
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

  /* --- Bottom --- */
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.12,
  },

  glassButton: {
    width: '70%',
    paddingVertical: 22,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(14,165,233,0.4)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 30,
    overflow: 'hidden',
  },

  /* Glowing border layer */
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
  },

  glassButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* --- Credit --- */
  creditContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  creditText: {
    fontSize: 12,
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
