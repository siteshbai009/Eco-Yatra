import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HelpSupport() {
  const router = useRouter();
  
  const faqs = [
    { q: 'What is EcoYatra?', a: 'A sustainable platform to track your carbon footprint and join eco-friendly commutes.' },
    { q: 'Is my data private?', a: 'Strictly. Your info is only used to calculate impact and optional leaderboard rankings.' },
    { q: 'How is CO2 saved calculated?', a: 'We compare your chosen eco-mode against standard car emissions for that distance.' },
    { q: 'Can I join carpools?', a: 'Yes! Our smart routing helps you find or offer shared rides near you.' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />
      
      {/* Background blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Header */}
      <View style={styles.headerArea}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.backBtnWrap}>
            <View style={styles.backBtnShadow} />
            <View style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#2D8A5F" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.heroShadow} />
          <View style={styles.hero}>
            <View style={styles.heroHighlight} />
            <Ionicons name="help-buoy" size={40} color="#3DBF87" />
            <Text style={styles.heroTitle}>How can we help?</Text>
            <Text style={styles.heroSub}>Find answers to common questions about your green journey.</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>📋 Frequently Asked Questions</Text>

        {faqs.map((f, i) => (
          <View key={i} style={styles.faqWrap}>
            <View style={[styles.faqShadow, { backgroundColor: i % 2 === 0 ? '#B0DEFF' : '#D4C8F5' }]} />
            <View style={styles.faqCard}>
              <View style={styles.faqHighlight} />
              <Text style={styles.faqQ}>{f.q}</Text>
              <Text style={styles.faqA}>{f.a}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionHeader}>✉️ Still need help?</Text>

        <View style={styles.contactWrap}>
          <View style={styles.contactShadow} />
          <View style={styles.contactCard}>
            <View style={styles.contactHighlight} />
            <Text style={styles.contactTitle}>Get in Touch</Text>
            <Text style={styles.contactSub}>Our eco-support team is here for you 24/7.</Text>
            
            <TouchableOpacity 
              style={styles.emailBtnWrap}
              onPress={() => Linking.openURL('mailto:support@ecoyatra.com')}
            >
              <View style={styles.emailBtnShadow} />
              <View style={styles.emailBtn}>
                <View style={styles.emailBtnHighlight} />
                <Feather name="mail" size={18} color="#FFF" />
                <Text style={styles.emailBtnText}>Email Support</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F4FF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  blob1: { width: 300, height: 300, backgroundColor: '#FFE8A0', top: -150, right: -100 },
  blob2: { width: 250, height: 250, backgroundColor: '#C8EDDA', bottom: 50, left: -100 },

  headerArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 10 },
  backBtnWrap: { position: 'relative' },
  backBtnShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#A8E6CF', borderRadius: 16, opacity: 0.6 },
  backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#2D4A30' },

  container: { padding: 24, paddingTop: 10 },

  heroWrap: { position: 'relative', marginBottom: 28 },
  heroShadow: { position: 'absolute', top: 8, left: 8, right: -8, bottom: -8, backgroundColor: '#A8E6CF', borderRadius: 32, opacity: 0.5 },
  hero: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, alignItems: 'center', overflow: 'hidden' },
  heroHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#2D4A30', marginTop: 12 },
  heroSub: { fontSize: 13, color: '#6B9A80', textAlign: 'center', marginTop: 8, fontWeight: '700', lineHeight: 20 },

  sectionHeader: { fontSize: 17, fontWeight: '900', color: '#2D4A30', marginBottom: 16, marginTop: 10 },

  faqWrap: { position: 'relative', marginBottom: 18 },
  faqShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, borderRadius: 24, opacity: 0.6 },
  faqCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, overflow: 'hidden' },
  faqHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 30, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  faqQ: { fontSize: 15, fontWeight: '900', color: '#2D4A30', marginBottom: 8 },
  faqA: { fontSize: 14, color: '#6B9A80', fontWeight: '600', lineHeight: 20 },

  contactWrap: { position: 'relative' },
  contactShadow: { position: 'absolute', top: 8, left: 8, right: -8, bottom: -8, backgroundColor: '#FFE0CC', borderRadius: 32, opacity: 0.5 },
  contactCard: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, alignItems: 'center', overflow: 'hidden' },
  contactHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 50, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  contactTitle: { fontSize: 18, fontWeight: '900', color: '#2D4A30' },
  contactSub: { fontSize: 13, color: '#8AB8A0', textAlign: 'center', marginTop: 6, fontWeight: '700', marginBottom: 20 },

  emailBtnWrap: { position: 'relative', width: '100%' },
  emailBtnShadow: { position: 'absolute', top: 5, left: 5, right: -5, bottom: -5, backgroundColor: '#6BCBA5', borderRadius: 20, opacity: 0.6 },
  emailBtn: { backgroundColor: '#3DBF87', paddingVertical: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, overflow: 'hidden' },
  emailBtnHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 26, backgroundColor: 'rgba(255,255,255,0.3)', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  emailBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});
