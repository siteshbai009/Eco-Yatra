import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />

      {/* Pastel blob background decorations */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />

      {/* Hero section */}
      <View style={styles.heroSection}>
        {/* Floating clay logo bubble */}
        <Animated.View style={[{ transform: [{ translateY: floatY }, { scale: scaleAnim }] }]}>
          <View style={styles.logoBubbleWrap}>
            <View style={styles.logoBubbleShadow} />
            <View style={styles.logoBubble}>
              <View style={styles.logoBubbleHighlight} />
              <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>
        </Animated.View>

        {/* Title clay card */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, styles.titleCardWrap]}>
          <View style={styles.titleCardShadow} />
          <View style={styles.titleCard}>
            <View style={styles.titleCardHighlight} />
            <Text style={styles.appName}>EcoYatra</Text>
            <Text style={styles.tagline}>Your Sustainable Journey 🌿</Text>
          </View>
        </Animated.View>

        {/* Feature chips */}
        <Animated.View style={[styles.featureRow, { opacity: fadeAnim }]}>
          {[
            { icon: 'leaf', label: 'Eco', color: '#A8E6CF', shadow: '#6BCBA5' },
            { icon: 'map-pin', label: 'Smart', color: '#B8D4FF', shadow: '#80AAFF' },
            { icon: 'users', label: 'Pool', color: '#FFD4E8', shadow: '#FF9EC8' },
          ].map((f, i) => (
            <View key={i} style={styles.chipWrap}>
              <View style={[styles.chipShadow, { backgroundColor: f.shadow }]} />
              <View style={[styles.chip, { backgroundColor: f.color }]}>
                <View style={styles.chipHighlight} />
                <Ionicons name={f.icon as any} size={16} color="#444" />
                <Text style={styles.chipText}>{f.label}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom action area */}
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.actionCard}>
          <View style={styles.actionCardHighlight} />
          <Text style={styles.ctaText}>Begin your eco journey today 🌎</Text>

          {/* CTA Button */}
          <View style={styles.ctaBtnWrap}>
            <View style={styles.ctaBtnShadow} />
            <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/login')} activeOpacity={0.85}>
              <View style={styles.ctaBtnHighlight} />
              <Text style={styles.ctaBtnText}>Get Started</Text>
              <View style={styles.ctaArrow}>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>💚 Every journey counts towards a greener planet</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4FF' },

  // Background blobs
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.5 },
  blob1: { width: 300, height: 300, backgroundColor: '#C8EDDA', top: -80, left: -80 },
  blob2: { width: 250, height: 250, backgroundColor: '#D4C8F5', bottom: 100, right: -60 },
  blob3: { width: 200, height: 200, backgroundColor: '#FFE0CC', top: '40%', left: -50 },

  heroSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, gap: 28 },

  // Logo bubble
  logoBubbleWrap: { position: 'relative' },
  logoBubbleShadow: {
    position: 'absolute', top: 10, left: 10, right: -10, bottom: -10,
    backgroundColor: '#A8D8FF', borderRadius: 80, opacity: 0.7,
  },
  logoBubble: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#A8D8FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
    elevation: 12, overflow: 'hidden',
  },
  logoBubbleHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 80, borderTopRightRadius: 80,
  },
  logo: { width: 110, height: 110 },

  // Title card
  titleCardWrap: { width: '100%', position: 'relative' },
  titleCardShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#A8E6CF', borderRadius: 28, opacity: 0.7,
  },
  titleCard: {
    backgroundColor: '#FFF', borderRadius: 28,
    paddingVertical: 22, paddingHorizontal: 28, alignItems: 'center',
    shadowColor: '#A8E6CF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
    elevation: 10, overflow: 'hidden',
  },
  titleCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  appName: { fontSize: 38, fontWeight: '900', color: '#2D8A5F', letterSpacing: 1 },
  tagline: { fontSize: 15, fontWeight: '700', color: '#6B9A80', marginTop: 6 },

  // Feature chips
  featureRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  chipWrap: { position: 'relative' },
  chipShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    borderRadius: 20, opacity: 0.6,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
    elevation: 6, overflow: 'hidden',
  },
  chipHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 18,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  chipText: { fontSize: 13, fontWeight: '800', color: '#444' },

  // Action area
  actionCard: {
    backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40,
    paddingHorizontal: 28, paddingTop: 32, paddingBottom: 40,
    shadowColor: '#B0CAFF', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.3, shadowRadius: 20,
    elevation: 20, overflow: 'hidden',
  },
  actionCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#6B9A80', marginBottom: 16, textAlign: 'center' },

  // CTA button
  ctaBtnWrap: { position: 'relative', marginBottom: 20 },
  ctaBtnShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#6BCBA5', borderRadius: 24, opacity: 0.6,
  },
  ctaBtn: {
    backgroundColor: '#3DBF87', borderRadius: 24,
    paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3DBF87', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16,
    elevation: 10, overflow: 'hidden',
  },
  ctaBtnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 30,
    backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  ctaBtnText: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
  ctaArrow: {
    position: 'absolute', right: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center',
  },

  footerNote: { fontSize: 13, color: '#8AB8A0', fontWeight: '600', textAlign: 'center' },
});
