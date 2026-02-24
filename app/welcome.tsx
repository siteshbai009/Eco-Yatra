import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
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
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Hero section */}
      <View style={styles.heroSection}>
        {/* Logo */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoWrap}>
            <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, styles.titleCard]}>
          <Text style={styles.appName}>EcoYatra</Text>
          <Text style={styles.tagline}>Your Sustainable Journey 🌿</Text>
        </Animated.View>

        {/* Feature chips */}
        <Animated.View style={[styles.featureRow, { opacity: fadeAnim }]}>
          {[
            { icon: 'leaf', label: 'Eco' },
            { icon: 'map-pin', label: 'Smart' },
            { icon: 'users', label: 'Pool' },
          ].map((f, i) => (
            <View key={i} style={styles.chip}>
              <Ionicons name={f.icon as any} size={16} color="#16A34A" />
              <Text style={styles.chipText}>{f.label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom action area */}
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, styles.actionArea]}>
        <Text style={styles.ctaText}>Begin your eco journey today</Text>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/login')} activeOpacity={0.8}>
          <Text style={styles.ctaBtnText}>Get Started</Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  heroSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40 },

  logoWrap: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  logo: { width: 90, height: 90 },

  titleCard: { alignItems: 'center', marginBottom: 30 },
  appName: { fontSize: 36, fontWeight: '700', color: '#111827', letterSpacing: 0.5 },
  tagline: { fontSize: 16, fontWeight: '500', color: '#6B7280', marginTop: 8 },

  featureRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: '#111827' },

  actionArea: {
    paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB',
  },
  ctaText: { fontSize: 15, fontWeight: '600', color: '#4B5563', marginBottom: 20, textAlign: 'center' },

  ctaBtn: {
    backgroundColor: '#16A34A', borderRadius: 16,
    paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  ctaBtnText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
});
