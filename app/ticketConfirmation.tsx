import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function TicketConfirmationScreen() {
  const router = useRouter();
  const { from, to, mode, cost, carbonSaved, distance } = useLocalSearchParams();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  const ticketNumber = `ECO${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const bookingTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I booked an eco-friendly trip! 🌱\n\nFrom: ${from}\nTo: ${to}\nTransport: ${mode}\nCost: ₹${cost}\nCarbon Saved: ${carbonSaved}kg\n\nJoin me on Ecoyatra! 🚀`,
        title: 'My Eco Trip Ticket',
      });
    } catch (error) { console.error(error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.backBtnWrap}>
            <View style={styles.backBtnShadow} />
            <View style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#22C55E" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Puffy Success Bubble */}
        <Animated.View style={[styles.successWrap, { transform: [{ scale: scaleAnim }, { translateY: floatY }], opacity: fadeAnim }]}>
          <View style={styles.successShadow} />
          <View style={styles.successCard}>
            <View style={styles.successHighlight} />
            <View style={styles.iconCircle}>
               <Ionicons name="checkmark-circle" size={50} color="#22C55E" />
            </View>
            <Text style={styles.successText}>Success! 🎉</Text>
            <Text style={styles.successSub}>Your eco-journey is booked</Text>
          </View>
        </Animated.View>

        {/* The Clay Ticket */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }, styles.ticketWrap]}>
          <View style={styles.ticketShadow} />
          <View style={styles.ticket}>
            <View style={styles.ticketHighlight} />
            
            {/* Ticket Top */}
            <View style={styles.ticketHeaderRow}>
              <View>
                <Text style={styles.ticketBrand}>EcoYatra</Text>
                <Text style={styles.ticketType}>Official E-Ticket</Text>
              </View>
              <View style={styles.modePillWrap}>
                <View style={styles.modePillShadow} />
                <View style={styles.modePill}>
                  <Text style={styles.modeText}>{mode}</Text>
                </View>
              </View>
            </View>

            <View style={styles.ticketDivider} />

            {/* Route */}
            <View style={styles.routeRow}>
              <View style={styles.cityCol}>
                <Text style={styles.cityLabel}>FROM</Text>
                <Text style={styles.cityName} numberOfLines={1}>{from}</Text>
              </View>
              <View style={styles.pathIcon}>
                <Ionicons name="chevron-forward-circle" size={32} color="#22C55E" />
              </View>
              <View style={[styles.cityCol, { alignItems: 'flex-end' }]}>
                <Text style={styles.cityLabel}>TO</Text>
                <Text style={styles.cityName} numberOfLines={1}>{to}</Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.ticketStats}>
              {[
                { label: 'COST', value: `₹${cost}`, color: '#FFFFFF' },
                { label: 'CO2 SAVED', value: `${carbonSaved}kg`, color: '#FFFFFF' },
                { label: 'DISTANCE', value: `${distance}km`, color: '#FFFFFF' },
              ].map((s, i) => (
                <View key={i} style={[styles.statItem, { backgroundColor: s.color + '40' }]}>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.ticketDivider} />

            {/* Footer */}
            <View style={styles.ticketFooter}>
              <View>
                <Text style={styles.footerLabel}>TICKET ID</Text>
                <Text style={styles.footerVal}>{ticketNumber}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.footerLabel}>TIME</Text>
                <Text style={styles.footerVal}>{bookingTime}</Text>
              </View>
            </View>

            {/* Cut line dummy */}
            <View style={styles.cutLine} />
            <View style={styles.barcodePlaceholder} />
          </View>
        </Animated.View>

        {/* Share Buttons */}
        <View style={styles.actionRow}>
           <TouchableOpacity style={styles.actionBtnWrap} onPress={handleShare}>
              <View style={[styles.actionBtnShadow, { backgroundColor: '#DCFCE7' }]} />
              <View style={[styles.actionBtn, { backgroundColor: '#22C55E' }]}>
                <View style={styles.actionBtnHighlight} />
                <Feather name="share-2" size={20} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Share</Text>
              </View>
           </TouchableOpacity>

           <TouchableOpacity style={styles.actionBtnWrap} onPress={() => router.push('/(tabs)/history')}>
              <View style={[styles.actionBtnShadow, { backgroundColor: '#22C55E' }]} />
              <View style={[styles.actionBtn, { backgroundColor: '#FFFFFF' }]}>
                <View style={styles.actionBtnHighlight} />
                <Feather name="clock" size={20} color="#16A34A" />
                <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>History</Text>
              </View>
           </TouchableOpacity>
        </View>

        {/* Home Button */}
        <TouchableOpacity style={styles.homeBtnWrap} onPress={() => router.push('/(tabs)')}>
          <View style={styles.homeBtnShadow} />
          <View style={styles.homeBtn}>
            <View style={styles.homeBtnHighlight} />
            <Text style={styles.homeBtnText}>Back to Dashboard 🌿</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.5 },
  blob1: { width: 300, height: 300, backgroundColor: '#FFFFFF', top: -50, right: -100 },
  blob2: { width: 250, height: 250, backgroundColor: '#FFFFFF', bottom: -50, left: -100 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 10 },
  backBtnWrap: { position: 'relative' },
  backBtnShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#FFFFFF', borderRadius: 16, opacity: 0.6 },
  backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#16A34A' },

  // Success bubble
  successWrap: { position: 'relative', marginBottom: 28 },
  successShadow: { position: 'absolute', top: 8, left: 8, right: -8, bottom: -8, backgroundColor: '#FFFFFF', borderRadius: 32, opacity: 0.5 },
  successCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 20, alignItems: 'center', overflow: 'hidden' },
  successHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 50, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  successText: { fontSize: 28, fontWeight: '900', color: '#22C55E' },
  successSub: { fontSize: 13, fontWeight: '700', color: '#22C55E' },

  // Ticket
  ticketWrap: { position: 'relative', marginBottom: 28 },
  ticketShadow: { position: 'absolute', top: 10, left: 10, right: -10, bottom: -10, backgroundColor: '#FFFFFF', borderRadius: 32, opacity: 0.6 },
  ticket: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, overflow: 'hidden' },
  ticketHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  
  ticketHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  ticketBrand: { fontSize: 22, fontWeight: '900', color: '#22C55E' },
  ticketType: { fontSize: 12, fontWeight: '700', color: '#DCFCE7' },
  modePillWrap: { position: 'relative' },
  modePillShadow: { position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, backgroundColor: '#DCFCE7', borderRadius: 12, opacity: 0.5 },
  modePill: { backgroundColor: '#22C55E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  modeText: { fontSize: 11, fontWeight: '900', color: '#FFFFFF' },

  ticketDivider: { height: 2, backgroundColor: '#FFFFFF', marginVertical: 16, borderRadius: 1 },
  
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  cityCol: { flex: 1 },
  cityLabel: { fontSize: 10, fontWeight: '800', color: '#DCFCE7', marginBottom: 4 },
  cityName: { fontSize: 18, fontWeight: '900', color: '#16A34A' },
  pathIcon: { paddingHorizontal: 10 },

  ticketStats: { flexDirection: 'row', gap: 10 },
  statItem: { flex: 1, padding: 10, borderRadius: 16, alignItems: 'center' },
  statLabel: { fontSize: 9, fontWeight: '800', color: '#22C55E', marginBottom: 4 },
  statValue: { fontSize: 13, fontWeight: '900', color: '#16A34A' },

  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  footerLabel: { fontSize: 9, fontWeight: '800', color: '#DCFCE7' },
  footerVal: { fontSize: 14, fontWeight: '900', color: '#16A34A' },

  cutLine: { height: 1, backgroundColor: '#FFFFFF', borderStyle: 'dotted', borderWidth: 1, marginVertical: 20, borderRadius: 1 },
  barcodePlaceholder: { height: 40, width: '100%', backgroundColor: '#FFFFFF', borderRadius: 8, opacity: 0.5 },

  // Actions
  actionRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  actionBtnWrap: { flex: 1, position: 'relative' },
  actionBtnShadow: { position: 'absolute', top: 5, left: 5, right: -5, bottom: -5, borderRadius: 18, opacity: 0.6 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 18, overflow: 'hidden' },
  actionBtnHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 18, backgroundColor: 'rgba(255,255,255,0.3)', borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  actionBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },

  homeBtnWrap: { position: 'relative' },
  homeBtnShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#DCFCE7', borderRadius: 22, opacity: 0.6 },
  homeBtn: { backgroundColor: '#22C55E', paddingVertical: 20, alignItems: 'center', borderRadius: 22, overflow: 'hidden' },
  homeBtnHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 28, backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  homeBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
});
