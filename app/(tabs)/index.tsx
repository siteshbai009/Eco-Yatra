import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../../UserContext';
import { getGrievanceStats, loadGrievances } from '../../dataStorage';

const { width } = Dimensions.get('window');

// Types
interface GrievanceItem {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  date: string;
  description: string;
}

interface StatsItem {
  title: string;
  count: number;
  color: string;
  icon: keyof typeof Feather.glyphMap;
}

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
      duration: 800,
      delay: animationDelay,
      useNativeDriver: true,
    }).start();
  }, [count]);

  return (
    <TouchableOpacity style={styles.statsButton} onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
        <View style={[styles.statsIconContainer, { backgroundColor: color }]}>
          <Feather name={icon} size={32} color="white" />
        </View>
        <Text style={styles.statsCount}>{count}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- Grievance Card ---
const GrievanceCard: React.FC<{
  item: GrievanceItem;
  index: number;
  onPress: () => void;
}> = ({ item, index, onPress }) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getStatusColor = () => {
    switch (item.status) {
      case 'Resolved':
        return '#10B981';
      case 'In Progress':
        return '#F59E0B';
      case 'Under Review':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case 'High':
        return '#EF4444';
      case 'Medium':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.grievanceCard,
          { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${getPriorityColor()}20` },
              ]}
            >
              <Text
                style={[styles.priorityText, { color: getPriorityColor() }]}
              >
                {item.priority}
              </Text>
            </View>
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.categoryContainer}>
            <Feather name="tag" size={12} color="#8B5CF6" />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor()}20` },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
              />
              <Text
                style={[styles.statusText, { color: getStatusColor() }]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- Tips Section ---
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
    '🕒 Stay patient for replies.',
    '📤 No duplicate submissions.',
    '🔍 Track real-time progress.',
    '💬 Keep replies factual.',
    '🔒 Your data is safe.',
    '📱 Access grievances anytime.',
    '🧾 Attach relevant files.',
    '🧭 Pick the right category.',
    '📨 Check for confirmation.',
    '🎉 Thanks for your support!',
  ];

  const [currentTip, setCurrentTip] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const nextFadeAnim = useRef(new Animated.Value(0)).current;
  const nextTip = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(nextFadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentTip(nextTip.current);
        fadeAnim.setValue(1);
        nextFadeAnim.setValue(0);
        nextTip.current = (nextTip.current + 1) % tips.length;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.tipCard}>
      <Feather name="info" size={20} color="#0EA5E9" style={{ marginRight: 8 }} />

      <View style={{ flex: 1, position: 'relative', height: 20 }}>
        <Animated.Text
          style={[
            styles.tipText,
            {
              opacity: fadeAnim,
              position: 'absolute',
              width: '100%',
            },
          ]}
        >
          {tips[currentTip]}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tipText,
            {
              opacity: nextFadeAnim,
              position: 'absolute',
              width: '100%',
            },
          ]}
        >
          {tips[nextTip.current]}
        </Animated.Text>
      </View>
    </View>
  );
};

// --- Main Screen ---
export default function HomeScreen() {
  const { user, updateUser } = useUser();
  const router = useRouter();
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const refreshUser = async () => {
        try {
          const saved = await AsyncStorage.getItem('userProfile');
          if (saved) {
            const parsed = JSON.parse(saved);
            updateUser({
              name: parsed.name || 'Student Name',
              email: parsed.email || 'student@giet.edu',
              role: parsed.role || 'Student',
              department: parsed.department || 'CSE',
            });
          }
        } catch (err) {
          console.log('Error updating user:', err);
        }
      };
      refreshUser();
    }, [])
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadGrievances();
      setGrievances(data || []);
    } catch (err) {
      console.error('Error loading grievances:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const stats = getGrievanceStats(grievances);
  const statsData: StatsItem[] = [
    { title: 'Total', count: stats.total, color: '#6366F1', icon: 'file-text' },
    { title: 'Pending', count: stats.pending, color: '#F59E0B', icon: 'clock' },
    { title: 'Resolved', count: stats.resolved, color: '#10B981', icon: 'check-circle' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.background, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#64748B', fontSize: 16 }}>Loading your grievances...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
        {/* Gradient Header Card */}
        <LinearGradient
          colors={['#F0F9FF', '#E0F2FE', '#F0F9FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <View style={styles.headerCard}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Hello 👋</Text>
              <Text style={styles.username}>{user.name.split(' ')[0]}</Text>
            </View>

            {/* Blue Avatar Button */}
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.7}
            >
              <View style={styles.avatarCircle}>
                <Feather name="user" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tips Section */}
        <TipsSection />

        {/* Stats */}
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

        {/* Recent Grievances */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Grievances</Text>
            <TouchableOpacity onPress={() => router.push('/track')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {grievances.length > 0 ? (
            grievances.slice(0, 3).map((item, i) => (
              <GrievanceCard key={item.id} item={item} index={i} onPress={() => router.push('/track')} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Grievances Yet</Text>
              <Text style={styles.emptyText}>Submit your first grievance to see it here</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/submit')}
              >
                <Text style={styles.emptyButtonText}>Submit Grievance</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flex: 1, backgroundColor: '#F8FAFC' },
  gradientContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    borderRadius: 24,
    backdropFilter: 'blur(20px)',
    elevation: 4,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerLeft: { flex: 1 },
  profileButton: {
    marginLeft: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  greeting: { fontSize: 13, color: '#94A3B8', marginBottom: 6, fontWeight: '500', letterSpacing: 0.3 },
  username: { fontSize: 28, fontWeight: '700', color: '#1E293B', marginBottom: 0, letterSpacing: -0.5 },

  // Tips Card - Glassmorphic
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 249, 255, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 22,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsButton: { flex: 1, alignItems: 'center' },
  statsCard: { alignItems: 'center' },
  statsIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsCount: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  statsTitle: { fontSize: 13, color: '#64748B', textTransform: 'uppercase' },
  recentSection: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  seeAllText: { fontSize: 15, color: '#6366F1', fontWeight: '600' },

  // Grievance Card - Glassmorphic
  grievanceCard: {
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(15px)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: { marginBottom: 12 },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', flex: 1 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardDescription: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  categoryContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryText: { fontSize: 12, color: '#8B5CF6', fontWeight: '600' },
  statusRow: { alignItems: 'flex-end', gap: 6 },
  dateText: { fontSize: 11, color: '#94A3B8' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  emptyText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  emptyButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
