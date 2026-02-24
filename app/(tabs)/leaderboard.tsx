import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
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

interface LeaderboardEntry {
  rank: number;
  name: string;
  carbon_saved: number;
  trips: number;
  points: number;
  badge?: 'gold' | 'silver' | 'bronze' | null;
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const mock: LeaderboardEntry[] = [
      { rank: 1, name: 'Sarah Chen', carbon_saved: 245.8, trips: 42, points: 1280, badge: 'gold' },
      { rank: 2, name: 'Alex Kumar', carbon_saved: 198.5, trips: 38, points: 1140, badge: 'silver' },
      { rank: 3, name: 'Jordan Smith', carbon_saved: 156.2, trips: 31, points: 980, badge: 'bronze' },
      { rank: 4, name: 'Emily Watson', carbon_saved: 142.1, trips: 28, points: 890 },
      { rank: 5, name: 'Michael Lee', carbon_saved: 128.7, trips: 25, points: 810 },
      { rank: 6, name: 'Priya Sharma', carbon_saved: 115.3, trips: 22, points: 750 },
      { rank: 7, name: 'David Wilson', carbon_saved: 98.5, trips: 19, points: 680 },
      { rank: 8, name: 'Lisa Johnson', carbon_saved: 87.2, trips: 16, points: 620 },
    ];
    setData(mock);
    setLoading(false);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#16A34A" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Hall of Legends</Text>
        <View style={{ width: 44 }} />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Top 3 Podium */}
          <View style={styles.podiumCard}>
            <View style={styles.podiumRow}>
              {/* 2nd Place */}
              {data.length > 1 && (
                <View style={[styles.podiumItem, { marginTop: 20 }]}>
                  <View style={styles.medalAvatar}>
                    <Text style={styles.medalInitials}>{getInitials(data[1].name)}</Text>
                  </View>
                  <Text style={styles.medalRank}>#2</Text>
                  <Text style={styles.medalName} numberOfLines={1}>{data[1].name.split(' ')[0]}</Text>
                  <Text style={styles.medalPts}>{data[1].points} pts</Text>
                </View>
              )}

              {/* 1st Place */}
              {data.length > 0 && (
                <View style={[styles.podiumItem, styles.podiumFirst]}>
                  <Text style={styles.crownEmoji}>👑</Text>
                  <View style={[styles.medalAvatar, styles.medalAvatarLarge]}>
                    <Text style={[styles.medalInitials, { fontSize: 24 }]}>{getInitials(data[0].name)}</Text>
                  </View>
                  <Text style={styles.medalRank}>#1</Text>
                  <Text style={styles.medalName} numberOfLines={1}>{data[0].name.split(' ')[0]}</Text>
                  <Text style={styles.medalPts}>{data[0].points} pts</Text>
                </View>
              )}

              {/* 3rd Place */}
              {data.length > 2 && (
                <View style={[styles.podiumItem, { marginTop: 30 }]}>
                  <View style={styles.medalAvatar}>
                    <Text style={styles.medalInitials}>{getInitials(data[2].name)}</Text>
                  </View>
                  <Text style={styles.medalRank}>#3</Text>
                  <Text style={styles.medalName} numberOfLines={1}>{data[2].name.split(' ')[0]}</Text>
                  <Text style={styles.medalPts}>{data[2].points} pts</Text>
                </View>
              )}
            </View>
          </View>

          {/* Rest of Rankings */}
          <Text style={styles.listTitle}>Full Rankings</Text>
          {data.slice(3).map((entry) => (
            <View key={entry.rank} style={styles.rankCard}>
              <View style={styles.rankCardRow}>
                {/* Rank badge */}
                <Text style={styles.rankBadgeText}>#{entry.rank}</Text>

                {/* Avatar */}
                <View style={styles.rankAvatar}>
                  <Text style={styles.rankAvatarText}>{getInitials(entry.name)}</Text>
                </View>

                {/* Info */}
                <View style={styles.rankInfo}>
                  <Text style={styles.rankName}>{entry.name}</Text>
                  <View style={styles.rankStats}>
                    <Ionicons name="leaf" size={14} color="#6B7280" />
                    <Text style={styles.rankStatText}>{entry.carbon_saved} kg</Text>
                    <View style={styles.rankStatDot} />
                    <Feather name="navigation" size={12} color="#6B7280" />
                    <Text style={styles.rankStatText}>{entry.trips} trips</Text>
                  </View>
                </View>

                {/* Points */}
                <View style={styles.rankPtsWrap}>
                  <Text style={styles.rankPtsNum}>{entry.points}</Text>
                  <Text style={styles.rankPtsLbl}>pts</Text>
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: '#F9FAFB',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  navTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },

  // Podium
  podiumCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, paddingBottom: 32,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 28,
  },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 12 },
  podiumItem: { flex: 1, alignItems: 'center' },
  podiumFirst: { flex: 1.2 },
  crownEmoji: { fontSize: 24, marginBottom: 8 },

  medalAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  medalAvatarLarge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ECFDF5' },
  medalInitials: { fontSize: 20, fontWeight: '700', color: '#111827' },
  medalRank: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
  medalName: { fontSize: 13, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 4, maxWidth: 80 },
  medalPts: { fontSize: 12, fontWeight: '600', color: '#16A34A' },

  listTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16, paddingHorizontal: 4 },

  // Rank cards
  rankCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  rankCardRow: { flexDirection: 'row', alignItems: 'center' },

  rankBadgeText: { width: 32, fontSize: 14, fontWeight: '700', color: '#6B7280' },

  rankAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rankAvatarText: { fontSize: 15, fontWeight: '600', color: '#111827' },
  
  rankInfo: { flex: 1 },
  rankName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 },
  rankStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rankStatText: { fontSize: 13, fontWeight: '500', color: '#6B7280' },
  rankStatDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginHorizontal: 2 },
  
  rankPtsWrap: { alignItems: 'flex-end', justifyContent: 'center' },
  rankPtsNum: { fontSize: 16, fontWeight: '700', color: '#16A34A' },
  rankPtsLbl: { fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
});
