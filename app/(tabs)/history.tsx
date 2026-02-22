import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  carbon: number;
  distance: number;
  passengers: number;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [trips] = useState<Trip[]>([
    { id: '1', from: 'Home', to: 'University Campus', date: 'Today', time: '8:30 AM', carbon: 2.5, distance: 12, passengers: 3 },
    { id: '2', from: 'University Campus', to: 'Shopping Mall', date: 'Yesterday', time: '5:15 PM', carbon: 1.8, distance: 8, passengers: 2 },
    { id: '3', from: 'Home', to: 'University Campus', date: 'Nov 5', time: '8:45 AM', carbon: 2.3, distance: 11, passengers: 4 },
    { id: '4', from: 'University Campus', to: 'Home', date: 'Nov 5', time: '6:00 PM', carbon: 2.5, distance: 12, passengers: 3 },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalCarbon = trips.reduce((s, t) => s + t.carbon, 0).toFixed(1);
  const totalDist = trips.reduce((s, t) => s + t.distance, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />

      {/* Background blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerShadow} />
        <View style={styles.header}>
          <View style={styles.headerHighlight} />
          <View style={styles.navContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <View style={styles.navBtnWrap}>
                <View style={styles.navBtnShadow} />
                <View style={styles.navBtn}>
                  <Feather name="arrow-left" size={22} color="#2D8A5F" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.navTitle}>📜 Trip Logbook</Text>
            <View style={{ width: 44 }} />
          </View>
        </View>
      </View>

      <Animated.View style={[{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Summary Banner */}
          <View style={styles.summaryWrap}>
            <View style={styles.summaryShadow} />
            <View style={styles.summaryCard}>
              <View style={styles.summaryHighlight} />
              <Text style={styles.summaryTitle}>✨ Journey Summary</Text>
              <View style={styles.summaryStats}>
                {[
                  { icon: 'bicycle', value: trips.length.toString(), label: 'Trips', color: '#A8E6CF', shadow: '#6BCBA5', iconColor: '#2D8A5F' },
                  { icon: 'leaf', value: `${totalCarbon}kg`, label: 'CO₂ Saved', color: '#C8F5E0', shadow: '#90DFBA', iconColor: '#2D6A45' },
                  { icon: 'map', value: `${totalDist}km`, label: 'Distance', color: '#FFE8A0', shadow: '#FFCC40', iconColor: '#B8860B' },
                ].map((s, i) => (
                  <View key={i} style={styles.summaryItemWrap}>
                    <View style={[styles.summaryItemShadow, { backgroundColor: s.shadow }]} />
                    <View style={[styles.summaryItem, { backgroundColor: s.color }]}>
                      <View style={styles.summaryItemHighlight} />
                      <Ionicons name={s.icon as any} size={22} color={s.iconColor} />
                      <Text style={styles.summaryNum}>{s.value}</Text>
                      <Text style={styles.summaryLbl}>{s.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.listHeader}>🚀 Recent Journeys</Text>

          {trips.map((trip, i) => (
            <View key={trip.id} style={styles.tripCardWrap}>
              <View style={[styles.tripCardShadow, { backgroundColor: i % 2 === 0 ? '#B0DEFF' : '#D4C8F5' }]} />
              <View style={[styles.tripCard, { backgroundColor: i % 2 === 0 ? '#F0FAFF' : '#F5F0FF' }]}>
                <View style={styles.tripCardHighlight} />

                {/* Timeline */}
                <View style={styles.tripRow}>
                  <View style={styles.timeline}>
                    <View style={styles.dotGreen} />
                    <View style={styles.timelineLine} />
                    <View style={styles.dotRed} />
                  </View>

                  <View style={styles.routeInfo}>
                    <Text style={styles.fromPlace}>{trip.from}</Text>
                    <View style={styles.timeChip}>
                      <Text style={styles.routeTime}>{trip.time}</Text>
                    </View>
                    <Text style={styles.toPlace}>{trip.to}</Text>
                  </View>

                  <View style={styles.tripMeta}>
                    <View style={styles.datePill}>
                      <Text style={styles.metaText}>{trip.date}</Text>
                    </View>
                    <Text style={styles.metaDist}>{trip.distance} km</Text>
                  </View>
                </View>

                {/* Stats strip */}
                <View style={styles.tripStatsRow}>
                  <View style={styles.statChipWrap}>
                    <View style={[styles.statChipShadow, { backgroundColor: '#6BCBA5' }]} />
                    <View style={[styles.statChip, { backgroundColor: '#A8E6CF' }]}>
                      <Ionicons name="leaf" size={12} color="#2D8A5F" />
                      <Text style={styles.statChipText}>{trip.carbon} kg CO₂</Text>
                    </View>
                  </View>
                  <View style={styles.statChipWrap}>
                    <View style={[styles.statChipShadow, { backgroundColor: '#A090E0' }]} />
                    <View style={[styles.statChip, { backgroundColor: '#D4C8F5' }]}>
                      <Feather name="users" size={12} color="#6040C0" />
                      <Text style={styles.statChipText}>{trip.passengers} passengers</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4FF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  blob1: { width: 260, height: 260, backgroundColor: '#C8EDDA', top: -60, right: -60 },
  blob2: { width: 200, height: 200, backgroundColor: '#D4C8F5', bottom: 80, left: -50 },

  // Header
  headerWrap: { position: 'relative', margin: 16 },
  headerShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#A8D8FF', borderRadius: 24, opacity: 0.5,
  },
  header: {
    backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden',
    shadowColor: '#A8D8FF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  headerHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 30,
    backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  navContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  navBtnWrap: { position: 'relative' },
  navBtnShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#A8E6CF', borderRadius: 16, opacity: 0.6,
  },
  navBtn: {
    width: 44, height: 44, borderRadius: 16, backgroundColor: '#E8F8F2',
    justifyContent: 'center', alignItems: 'center',
  },
  navTitle: { fontSize: 18, fontWeight: '900', color: '#2D4A30' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Summary
  summaryWrap: { position: 'relative', marginBottom: 20 },
  summaryShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#A8E6CF', borderRadius: 28, opacity: 0.5,
  },
  summaryCard: {
    backgroundColor: '#FFF', borderRadius: 28, padding: 20, overflow: 'hidden',
    shadowColor: '#A8E6CF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  summaryHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 50,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  summaryTitle: { fontSize: 15, fontWeight: '900', color: '#2D4A30', marginBottom: 16, textAlign: 'center' },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItemWrap: { position: 'relative' },
  summaryItemShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    borderRadius: 20, opacity: 0.6,
  },
  summaryItem: {
    width: (width - 80) / 3, borderRadius: 20, paddingVertical: 14,
    alignItems: 'center', gap: 4, overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  summaryItemHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 24,
    backgroundColor: 'rgba(255,255,255,0.6)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  summaryNum: { fontSize: 18, fontWeight: '900', color: '#2D4A30' },
  summaryLbl: { fontSize: 10, fontWeight: '700', color: '#5A7A60' },

  listHeader: { fontSize: 17, fontWeight: '900', color: '#2D4A30', marginBottom: 14 },

  // Trip cards
  tripCardWrap: { position: 'relative', marginBottom: 16 },
  tripCardShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    borderRadius: 26, opacity: 0.6,
  },
  tripCard: {
    borderRadius: 26, padding: 18, overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  tripCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 40,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 26, borderTopRightRadius: 26,
  },

  tripRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  timeline: { alignItems: 'center', width: 20, marginRight: 14 },
  dotGreen: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#3DBF87', borderWidth: 2, borderColor: '#FFF' },
  timelineLine: { width: 3, height: 26, backgroundColor: '#B0E0C8', marginVertical: 4, borderRadius: 2 },
  dotRed: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#FF7B8A', borderWidth: 2, borderColor: '#FFF' },
  routeInfo: { flex: 1 },
  fromPlace: { fontSize: 14, fontWeight: '900', color: '#2D4A30', marginBottom: 4 },
  toPlace: { fontSize: 14, fontWeight: '900', color: '#2D4A30', marginTop: 4 },
  timeChip: { backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start' },
  routeTime: { fontSize: 11, color: '#6B9A80', fontWeight: '700' },

  tripMeta: { alignItems: 'flex-end', gap: 6 },
  datePill: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  metaText: { fontSize: 11, fontWeight: '800', color: '#5A7A60' },
  metaDist: { fontSize: 15, fontWeight: '900', color: '#3DBF87' },

  // Stats strip
  tripStatsRow: { flexDirection: 'row', gap: 10 },
  statChipWrap: { flex: 1, position: 'relative' },
  statChipShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    borderRadius: 14, opacity: 0.6,
  },
  statChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, overflow: 'hidden',
  },
  statChipText: { fontSize: 12, fontWeight: '800', color: '#2D4A30' },
});
