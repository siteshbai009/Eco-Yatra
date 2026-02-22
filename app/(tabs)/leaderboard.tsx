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
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

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
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 }),
    ]).start();
  }, []);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const podiumColors = {
    gold:   { card: '#FFE8A0', shadow: '#FFCC40', text: '#B8860B', avatarBg: '#FFD700' },
    silver: { card: '#F0F0F0', shadow: '#C0C0C0', text: '#707070', avatarBg: '#C8C8C8' },
    bronze: { card: '#FFD8B0', shadow: '#CD7F32', text: '#8B5C1A', avatarBg: '#D2874A' },
  };

  const avatarColors = ['#FF7B8A', '#7BBFFF', '#9B7BFF', '#3DBF87', '#FF9B4A', '#4AD4FF', '#FF4AB0', '#7B7B7B'];

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#3DBF87" /></View>;
  }

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
            <Text style={styles.navTitle}>🏆 Hall of Legends</Text>
            <View style={{ width: 44 }} />
          </View>
        </View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Top 3 Podium */}
          <View style={styles.podiumWrap}>
            <View style={styles.podiumShadow} />
            <View style={styles.podiumCard}>
              <View style={styles.podiumCardHighlight} />
              <View style={styles.podiumRow}>
                {/* 2nd Place */}
                {data.length > 1 && (
                  <Animated.View style={[styles.podiumItem, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={[styles.medalAvatarWrap, { backgroundColor: podiumColors.silver.card }]}>
                      <View style={[styles.medalAvatarShadow, { backgroundColor: podiumColors.silver.shadow }]} />
                      <View style={[styles.medalAvatar, { backgroundColor: podiumColors.silver.avatarBg }]}>
                        <View style={styles.medalAvatarHighlight} />
                        <Text style={styles.medalInitials}>{getInitials(data[1].name)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.medalRank, { color: podiumColors.silver.text }]}>#2</Text>
                    <Text style={styles.medalName} numberOfLines={1}>{data[1].name.split(' ')[0]}</Text>
                    <Text style={styles.medalPts}>{data[1].points} pts</Text>
                    <View style={[styles.podiumBlock, { height: 70, backgroundColor: podiumColors.silver.avatarBg }]}>
                      <View style={styles.podiumBlockHighlight} />
                      <Text style={styles.podiumBlockNum}>2</Text>
                    </View>
                  </Animated.View>
                )}

                {/* 1st Place */}
                {data.length > 0 && (
                  <Animated.View style={[styles.podiumItem, styles.podiumFirst, { transform: [{ scale: scaleAnim }] }]}>
                    <Text style={styles.crownEmoji}>👑</Text>
                    <View style={[styles.medalAvatarWrap, { backgroundColor: podiumColors.gold.card }]}>
                      <View style={[styles.medalAvatarShadow, { backgroundColor: podiumColors.gold.shadow }]} />
                      <View style={[styles.medalAvatar, styles.medalAvatarLarge, { backgroundColor: podiumColors.gold.avatarBg }]}>
                        <View style={styles.medalAvatarHighlight} />
                        <Text style={[styles.medalInitials, { fontSize: 26 }]}>{getInitials(data[0].name)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.medalRank, { color: podiumColors.gold.text }]}>#1</Text>
                    <Text style={styles.medalName} numberOfLines={1}>{data[0].name.split(' ')[0]}</Text>
                    <Text style={styles.medalPts}>{data[0].points} pts</Text>
                    <View style={[styles.podiumBlock, { height: 100, backgroundColor: podiumColors.gold.avatarBg }]}>
                      <View style={styles.podiumBlockHighlight} />
                      <Text style={styles.podiumBlockNum}>1</Text>
                    </View>
                  </Animated.View>
                )}

                {/* 3rd Place */}
                {data.length > 2 && (
                  <Animated.View style={[styles.podiumItem, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={[styles.medalAvatarWrap, { backgroundColor: podiumColors.bronze.card }]}>
                      <View style={[styles.medalAvatarShadow, { backgroundColor: podiumColors.bronze.shadow }]} />
                      <View style={[styles.medalAvatar, { backgroundColor: podiumColors.bronze.avatarBg }]}>
                        <View style={styles.medalAvatarHighlight} />
                        <Text style={styles.medalInitials}>{getInitials(data[2].name)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.medalRank, { color: podiumColors.bronze.text }]}>#3</Text>
                    <Text style={styles.medalName} numberOfLines={1}>{data[2].name.split(' ')[0]}</Text>
                    <Text style={styles.medalPts}>{data[2].points} pts</Text>
                    <View style={[styles.podiumBlock, { height: 50, backgroundColor: podiumColors.bronze.avatarBg }]}>
                      <View style={styles.podiumBlockHighlight} />
                      <Text style={styles.podiumBlockNum}>3</Text>
                    </View>
                  </Animated.View>
                )}
              </View>
            </View>
          </View>

          {/* Rest of Rankings */}
          <Text style={styles.listTitle}>📊 Full Rankings</Text>
          {data.slice(3).map((entry, i) => (
            <View key={entry.rank} style={styles.rankCardWrap}>
              <View style={[styles.rankCardShadow, { backgroundColor: avatarColors[(entry.rank - 1) % avatarColors.length] + '80' }]} />
              <View style={styles.rankCard}>
                <View style={styles.rankCardHighlight} />
                <View style={styles.rankCardRow}>
                  {/* Rank badge */}
                  <View style={styles.rankBadgeWrap}>
                    <View style={styles.rankBadgeShadow} />
                    <View style={styles.rankBadge}>
                      <View style={styles.rankBadgeHighlight} />
                      <Text style={styles.rankBadgeText}>#{entry.rank}</Text>
                    </View>
                  </View>

                  {/* Avatar */}
                  <View style={[styles.rankAvatar, { backgroundColor: avatarColors[(entry.rank - 1) % avatarColors.length] }]}>
                    <View style={styles.rankAvatarHighlight} />
                    <Text style={styles.rankAvatarText}>{getInitials(entry.name)}</Text>
                  </View>

                  {/* Info */}
                  <View style={styles.rankInfo}>
                    <Text style={styles.rankName}>{entry.name}</Text>
                    <View style={styles.rankStats}>
                      <Ionicons name="leaf" size={12} color="#3DBF87" />
                      <Text style={styles.rankStatText}>{entry.carbon_saved} kg</Text>
                      <View style={styles.rankStatDot} />
                      <Feather name="navigation" size={12} color="#7B7BFF" />
                      <Text style={styles.rankStatText}>{entry.trips} trips</Text>
                    </View>
                  </View>

                  {/* Points */}
                  <View style={styles.rankPts}>
                    <Text style={styles.rankPtsNum}>{entry.points}</Text>
                    <Text style={styles.rankPtsLbl}>pts</Text>
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F4FF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  blob1: { width: 260, height: 260, backgroundColor: '#FFE8A0', top: -60, left: -60 },
  blob2: { width: 220, height: 220, backgroundColor: '#D4C8F5', bottom: 80, right: -50 },

  // Header
  headerWrap: { position: 'relative', margin: 16 },
  headerShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#FFE8A0', borderRadius: 24, opacity: 0.6,
  },
  header: {
    backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden',
    shadowColor: '#FFE8A0', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  headerHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 30,
    backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  navContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  navBtnWrap: { position: 'relative' },
  navBtnShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#FFD4A0', borderRadius: 16, opacity: 0.6,
  },
  navBtn: {
    width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFF8E8',
    justifyContent: 'center', alignItems: 'center',
  },
  navTitle: { fontSize: 18, fontWeight: '900', color: '#2D4A30' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Podium
  podiumWrap: { position: 'relative', marginBottom: 24 },
  podiumShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#FFE8A0', borderRadius: 32, opacity: 0.6,
  },
  podiumCard: {
    backgroundColor: '#FFF', borderRadius: 32, padding: 16, overflow: 'hidden',
    shadowColor: '#FFE8A0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  podiumCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 50,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8 },
  podiumItem: { flex: 1, alignItems: 'center' },
  podiumFirst: { flex: 1.2 },
  crownEmoji: { fontSize: 26, marginBottom: 4 },

  medalAvatarWrap: { position: 'relative', borderRadius: 30, padding: 4, marginBottom: 6 },
  medalAvatarShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    borderRadius: 30, opacity: 0.6,
  },
  medalAvatar: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  medalAvatarLarge: { width: 75, height: 75, borderRadius: 37.5 },
  medalAvatarHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    backgroundColor: 'rgba(255,255,255,0.5)', borderTopLeftRadius: 30, borderTopRightRadius: 30,
  },
  medalInitials: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  medalRank: { fontSize: 14, fontWeight: '900', marginBottom: 2 },
  medalName: { fontSize: 11, fontWeight: '800', color: '#2D4A30', textAlign: 'center', marginBottom: 2, maxWidth: 80 },
  medalPts: { fontSize: 10, fontWeight: '700', color: '#6B9A80', marginBottom: 8 },
  podiumBlock: {
    width: '100%', borderRadius: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  podiumBlockHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  podiumBlockNum: { fontSize: 22, fontWeight: '900', color: 'rgba(255,255,255,0.9)' },

  listTitle: { fontSize: 17, fontWeight: '900', color: '#2D4A30', marginBottom: 14 },

  // Rank cards
  rankCardWrap: { position: 'relative', marginBottom: 12 },
  rankCardShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    borderRadius: 22, opacity: 0.5,
  },
  rankCard: {
    backgroundColor: '#FFF', borderRadius: 22, padding: 14, overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6,
  },
  rankCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 30,
    backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  rankCardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  rankBadgeWrap: { position: 'relative' },
  rankBadgeShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#D4C8F5', borderRadius: 16, opacity: 0.7,
  },
  rankBadge: {
    width: 42, height: 42, borderRadius: 16, backgroundColor: '#EEE8FF',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  rankBadgeHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 18,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  rankBadgeText: { fontSize: 12, fontWeight: '900', color: '#6040C0' },

  rankAvatar: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  rankAvatarHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 20,
    backgroundColor: 'rgba(255,255,255,0.4)', borderTopLeftRadius: 23, borderTopRightRadius: 23,
  },
  rankAvatarText: { fontSize: 14, fontWeight: '900', color: '#FFF' },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 14, fontWeight: '800', color: '#2D4A30', marginBottom: 4 },
  rankStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rankStatText: { fontSize: 11, fontWeight: '700', color: '#6B9A80' },
  rankStatDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#B0D8FF', marginHorizontal: 2 },
  rankPts: { alignItems: 'flex-end' },
  rankPtsNum: { fontSize: 18, fontWeight: '900', color: '#3DBF87' },
  rankPtsLbl: { fontSize: 10, fontWeight: '700', color: '#8AB8A0' },
});
