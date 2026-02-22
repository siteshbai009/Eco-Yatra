import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const blob1Scale = useRef(new Animated.Value(0.8)).current;
  const blob2Scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();

    // Blob pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(blob1Scale, { toValue: 1.05, duration: 3000, useNativeDriver: true }),
        Animated.timing(blob1Scale, { toValue: 0.95, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(blob2Scale, { toValue: 1.08, duration: 3500, useNativeDriver: true }),
        Animated.timing(blob2Scale, { toValue: 0.92, duration: 3500, useNativeDriver: true }),
      ])
    ).start();

    // Logo entrance
    Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }).start();

    // Text fade
    Animated.timing(textOpacity, { toValue: 1, duration: 1000, delay: 400, useNativeDriver: true }).start();

    // Navigate to welcome
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />

      {/* Background blob decorations */}
      <Animated.View style={[styles.blob, styles.blob1, { transform: [{ scale: blob1Scale }] }]} />
      <Animated.View style={[styles.blob, styles.blob2, { transform: [{ scale: blob2Scale }] }]} />
      <Animated.View style={[styles.blob, styles.blob3, { transform: [{ scale: blob1Scale }] }]} />
      <View style={[styles.blob, styles.blob4]} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Floating clay logo bubble */}
        <Animated.View style={[{ transform: [{ translateY: floatY }, { scale: logoScale }] }]}>
          <View style={styles.logoBubbleOuter}>
            <View style={styles.logoBubbleOuterShadow} />
            <View style={styles.logoBubble}>
              <View style={styles.logoBubbleHighlight} />
              <Image
                source={require('../assets/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          {/* Title clay chip */}
          <View style={styles.titleChipWrap}>
            <View style={styles.titleChipShadow} />
            <View style={styles.titleChip}>
              <View style={styles.titleChipHighlight} />
              <Text style={styles.appName}>EcoYatra</Text>
            </View>
          </View>

          {/* Tagline chip */}
          <View style={styles.taglineChipWrap}>
            <View style={styles.taglineChipShadow} />
            <View style={styles.taglineChip}>
              <Text style={styles.tagline}>🌿 Sustainable Commute</Text>
            </View>
          </View>
        </Animated.View>

        {/* Loading dots */}
        <Animated.View style={[styles.dotsRow, { opacity: textOpacity }]}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === 0 ? '#3DBF87' : i === 1 ? '#7BBFFF' : '#FF9EC8' }]} />
          ))}
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginBottom: 32 }}>
        <View style={styles.footerChipWrap}>
          <View style={styles.footerChipShadow} />
          <View style={styles.footerChip}>
            <Text style={styles.footerText}>💚 Made for a Greener Earth</Text>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Blobs
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.5 },
  blob1: { width: 300, height: 300, backgroundColor: '#C8EDDA', top: -80, left: -80 },
  blob2: { width: 280, height: 280, backgroundColor: '#D4C8F5', bottom: -60, right: -60 },
  blob3: { width: 200, height: 200, backgroundColor: '#FFD4E8', top: '45%', right: -60 },
  blob4: { width: 160, height: 160, backgroundColor: '#FFE8A0', top: '30%', left: -50, opacity: 0.4 },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },

  // Logo bubble
  logoBubbleOuter: { position: 'relative' },
  logoBubbleOuterShadow: {
    position: 'absolute', top: 12, left: 12, right: -12, bottom: -12,
    backgroundColor: '#A8D8FF', borderRadius: 80, opacity: 0.7,
  },
  logoBubble: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#A8D8FF', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20,
    elevation: 16, overflow: 'hidden',
  },
  logoBubbleHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 70,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 80, borderTopRightRadius: 80,
  },
  logo: { width: 110, height: 110 },

  // Title chip
  titleChipWrap: { position: 'relative', marginBottom: 12 },
  titleChipShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#A8E6CF', borderRadius: 22, opacity: 0.7,
  },
  titleChip: {
    backgroundColor: '#FFF', borderRadius: 22, paddingHorizontal: 30, paddingVertical: 14,
    shadowColor: '#A8E6CF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    overflow: 'hidden',
  },
  titleChipHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 24,
    backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  appName: { fontSize: 38, fontWeight: '900', color: '#2D8A5F', letterSpacing: 2 },

  // Tagline chip
  taglineChipWrap: { position: 'relative' },
  taglineChipShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#6BCBA5', borderRadius: 18, opacity: 0.5,
  },
  taglineChip: {
    backgroundColor: '#A8E6CF', borderRadius: 18, paddingHorizontal: 20, paddingVertical: 10,
    shadowColor: '#6BCBA5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  tagline: { fontSize: 16, fontWeight: '800', color: '#1A6A45', textAlign: 'center' },

  // Loading dots
  dotsRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  dot: {
    width: 14, height: 14, borderRadius: 7,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 5,
  },

  // Footer chip
  footerChipWrap: { position: 'relative' },
  footerChipShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#B0DEFF', borderRadius: 18, opacity: 0.5,
  },
  footerChip: {
    backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 18, paddingVertical: 10,
    shadowColor: '#B0DEFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  footerText: { fontSize: 14, color: '#3DBF87', fontWeight: '800' },
});
