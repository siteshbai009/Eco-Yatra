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
  const slideAnim = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalCarbon = trips.reduce((s, t) => s + t.carbon, 0).toFixed(1);
  const totalDist = trips.reduce((s, t) => s + t.distance, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Trip Logbook</Text>
        <View style={{ width: 44 }} />
      </View>

      <Animated.View style={[{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Summary Banner */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Journey Summary</Text>
            <View style={styles.summaryStats}>
              {[
                { icon: 'bicycle', value: trips.length.toString(), label: 'Trips' },
                { icon: 'leaf', value: `${totalCarbon}kg`, label: 'CO₂ Saved' },
                { icon: 'map', value: `${totalDist}km`, label: 'Distance' },
              ].map((s, i) => (
                <View key={i} style={styles.summaryItem}>
                  <Ionicons name={s.icon as any} size={22} color="#16A34A" />
                  <Text style={styles.summaryNum}>{s.value}</Text>
                  <Text style={styles.summaryLbl}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.listHeader}>Recent Journeys</Text>

          {trips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripRow}>
                <View style={styles.timeline}>
                  <View style={styles.dotBlack} />
                  <View style={styles.timelineLine} />
                  <View style={styles.dotGreen} />
                </View>

                <View style={styles.routeInfo}>
                  <Text style={styles.fromPlace}>{trip.from}</Text>
                  <Text style={styles.routeTime}>{trip.time}</Text>
                  <Text style={styles.toPlace}>{trip.to}</Text>
                </View>

                <View style={styles.tripMeta}>
                  <Text style={styles.metaText}>{trip.date}</Text>
                  <Text style={styles.metaDist}>{trip.distance} km</Text>
                </View>
              </View>

              <View style={styles.tripStatsRow}>
                <View style={styles.statChip}>
                  <Ionicons name="leaf" size={12} color="#16A34A" />
                  <Text style={styles.statChipText}>{trip.carbon} kg CO₂</Text>
                </View>
                <View style={[styles.statChip, { marginLeft: 8 }]}>
                  <Feather name="users" size={12} color="#16A34A" />
                  <Text style={styles.statChipText}>{trip.passengers} pax</Text>
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: '#F9FAFB',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  navTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },

  // Summary
  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 28,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16, textAlign: 'center' },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 8 },
  summaryLbl: { fontSize: 13, fontWeight: '500', color: '#6B7280', marginTop: 2 },

  listHeader: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16, paddingHorizontal: 4 },

  // Trip cards
  tripCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  tripRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  timeline: { alignItems: 'center', width: 20, marginRight: 14 },
  dotBlack: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#111827', borderWidth: 2, borderColor: '#FFFFFF' },
  timelineLine: { width: 2, height: 26, backgroundColor: '#E5E7EB', marginVertical: 4 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16A34A', borderWidth: 2, borderColor: '#FFFFFF' },
  
  routeInfo: { flex: 1 },
  fromPlace: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  toPlace: { fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2 },
  routeTime: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  tripMeta: { alignItems: 'flex-end', justifyContent: 'center' },
  metaText: { fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 2 },
  metaDist: { fontSize: 16, fontWeight: '700', color: '#111827' },

  // Stats strip
  tripStatsRow: { flexDirection: 'row', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  statChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#ECFDF5',
  },
  statChipText: { fontSize: 13, fontWeight: '600', color: '#16A34A' },
});
