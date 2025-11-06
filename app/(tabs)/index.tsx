import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useUser } from '../../UserContext';
import { getGrievanceStats, loadGrievances } from '../../dataStorage';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

// --- Glass Header ---
const GlassHeader: React.FC<{ name: string; onProfilePress: () => void }> = ({
  name,
  onProfilePress,
}) => {
  return (
    <View style={styles.glassHeaderWrapper}>
      <LinearGradient
        colors={['#E0F7FF', '#F5FBFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[
            'rgba(14,165,233,0.25)',
            'rgba(255,255,255,0.12)',
            'rgba(14,165,233,0.15)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </BlurView>

      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.username}>{name.split(' ')[0]}</Text>
        </View>

        <TouchableOpacity
          onPress={onProfilePress}
          style={styles.profileButton}
          activeOpacity={0.8}
        >
          <View style={styles.avatarCircle}>
            <Feather name="user" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Glass Tips Section ---
const TipsSection: React.FC = () => {
  const tips = [
    '📝 Explain issues clearly for quick help.',
    '⚡ Keep your reg. number handy.',
    '📅 Track updates regularly.',
    '📢 Stay polite and concise.',
    '🔔 You\'ll get notified soon!',
    '💡 Add valid proofs if needed.',
    '🚀 Submit early, avoid rush.',
    '🎯 Use clear, short subjects.',
    '✅ Review before submitting.',
    '📂 Save your ref ID always.',
  ];

  const [currentTip, setCurrentTip] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const containerWidth = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(translateX, {
        toValue: -containerWidth.current,
        duration: 700,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        const next = (currentTip + 1) % tips.length;
        setCurrentTip(next);
        translateX.setValue(containerWidth.current);
        Animated.timing(translateX, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    }, 3600);
    return () => clearInterval(interval);
  }, [currentTip]);

  return (
    <View style={styles.glassTipsContainer}>
      <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[
            'rgba(14,165,233,0.22)',
            'rgba(255,255,255,0.12)',
            'rgba(14,165,233,0.16)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </BlurView>

      <View style={styles.tipRow}>
        <Feather name="info" size={18} color="#0EA5E9" style={{ marginRight: 8 }} />
        <View
          style={{ flex: 1, overflow: 'hidden' }}
          onLayout={(e) => (containerWidth.current = e.nativeEvent.layout.width)}
        >
          <Animated.Text
            style={[styles.tipText, { transform: [{ translateX }] }]}
            numberOfLines={1}
          >
            {tips[currentTip]}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

// --- Stats Card ---
const StatsCard: React.FC<{
  title: string;
  count: number;
  color: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  animationDelay: number;
}> = ({ title, count, color, icon, onPress, animationDelay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      delay: animationDelay,
      useNativeDriver: true,
    }).start();
  }, [count]);

  return (
    <TouchableOpacity style={styles.statsButton} onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
        <View style={[styles.statsIconContainer, { backgroundColor: color }]}>
          <Feather name={icon} size={28} color="white" />
        </View>
        <Text style={styles.statsCount}>{count}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- Recent Grievances ---
const RecentGrievances: React.FC<{ grievances: any[] }> = ({ grievances }) => {
  if (!grievances.length) {
    return (
      <View style={styles.noGrievanceBox}>
        <Text style={styles.noGrievanceText}>No recent grievances</Text>
      </View>
    );
  }

  return (
    <View style={styles.recentContainer}>
      <Text style={styles.recentTitle}>Recent Grievances</Text>
      {grievances.slice(0, 3).map((item, idx) => (
        <BlurView key={idx} intensity={80} tint="light" style={styles.recentCard}>
          <LinearGradient
            colors={[
              'rgba(14,165,233,0.15)',
              'rgba(255,255,255,0.08)',
              'rgba(14,165,233,0.12)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View>
            <Text style={styles.recentTitleText}>{item.title}</Text>
            <Text style={styles.recentDescText} numberOfLines={1}>
              {item.description}
            </Text>
            <Text style={styles.recentStatusText}>{item.status.toUpperCase()}</Text>
          </View>
        </BlurView>
      ))}
    </View>
  );
};

// --- Main Screen ---
export default function HomeScreen() {
  const { user, updateUser } = useUser();
  const router = useRouter();
  const [grievances, setGrievances] = useState<any[]>([]);

  // Hybrid Profile Loading — Cached + Supabase Refresh
  useFocusEffect(
    useCallback(() => {
      const refreshUser = async () => {
        try {
          // 1️⃣ Load cached user instantly
          const saved = await AsyncStorage.getItem('userProfile');
          if (saved) updateUser(JSON.parse(saved));

          // 2️⃣ Fetch from Supabase for fresh data
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();

          if (authUser) {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('name, email, role, department')
              .eq('id', authUser.id)
              .single();

            if (!error && profile) {
              updateUser(profile);
              await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
            }
          }
        } catch (err) {
          console.error('User sync error:', err);
        }
      };

      refreshUser();
    }, [])
  );

  // Load grievances
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const data = await loadGrievances();
          setGrievances(data || []);
        } catch (err) {
          console.error('Error loading grievances:', err);
        }
      };
      load();
    }, [])
  );

  const stats = getGrievanceStats(grievances);
  const statsData = [
    { title: 'Total', count: stats.total, color: '#6366F1', icon: 'file-text' },
    { title: 'Pending', count: stats.pending, color: '#F59E0B', icon: 'clock' },
    { title: 'Resolved', count: stats.resolved, color: '#10B981', icon: 'check-circle' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <GlassHeader name={user.name} onProfilePress={() => router.push('/(tabs)/profile')} />
      <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
        <TipsSection />
        <View style={styles.statsContainer}>
          {statsData.map((s, i) => (
            <StatsCard
              key={s.title}
              {...s}
              onPress={() => router.push('/track')}
              animationDelay={i * 200}
            />
          ))}
        </View>
        <RecentGrievances grievances={grievances} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles (unchanged) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  background: { flex: 1, backgroundColor: '#F8FAFC' },
  glassHeaderWrapper: {
    position: 'relative',
    width: '100%',
    height: 140,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 18, color: '#222f31ff', marginBottom: 6, fontWeight: '500' },
  username: { fontSize: 28, fontWeight: '700', color: '#1E293B' },
  profileButton: { alignItems: 'center', justifyContent: 'center' },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  glassTipsContainer: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(14,165,233,0.22)',
    backgroundColor: 'rgba(14,165,233,0.08)',
  },
  tipRow: { flexDirection: 'row', alignItems: 'center' },
  tipText: { fontSize: 14, color: '#1E293B', fontWeight: '500' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  statsButton: { flex: 1, alignItems: 'center' },
  statsCard: { alignItems: 'center' },
  statsIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsCount: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  statsTitle: { fontSize: 13, color: '#64748B', textTransform: 'uppercase' },
  recentContainer: { paddingHorizontal: 20, marginBottom: 50 },
  recentTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 12 },
  recentCard: {
    borderRadius: 18,
    overflow: 'hidden',
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(14,165,233,0.2)',
    backgroundColor: 'rgba(14,165,233,0.08)',
  },
  recentTitleText: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  recentDescText: { fontSize: 13, color: '#475569', marginVertical: 4 },
  recentStatusText: { fontSize: 12, color: '#0EA5E9', fontWeight: '600' },
  noGrievanceBox: { alignItems: 'center', marginVertical: 16 },
  noGrievanceText: { fontSize: 14, color: '#64748B' },
});
