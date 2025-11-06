import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useUser } from '../../UserContext';
import { getGrievanceStats, GrievanceItem, loadGrievances } from '../../dataStorage';

const CYAN = {
  main: '#06B6D4',
  light: '#22D3EE',
};

export default function TrackGrievanceScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const stats = useMemo(() => getGrievanceStats(grievances), [grievances]);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Animate icon spin
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      // Fade in toast
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const data = await loadGrievances();
      setGrievances(data);
    } catch (error) {
      console.error('Error loading grievances:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        rotateAnim.stopAnimation();
        rotateAnim.setValue(0);
        setRefreshing(false);
      }, 1500);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderItem = ({ item }: { item: GrievanceItem }) => (
    <View style={styles.trackCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'Resolved' ? '#10B98120' : item.status === 'In Progress' ? '#F59E0B20' : '#06B6D420' },
          ]}
        >
          <Feather
            name="activity"
            size={14}
            color={item.status === 'Resolved' ? '#10B981' : item.status === 'In Progress' ? '#F59E0B' : CYAN.main}
          />
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'Resolved' ? '#10B981' : item.status === 'In Progress' ? '#F59E0B' : CYAN.main },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDescription}>{item.description}</Text>

      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Progress Timeline</Text>
        {item.timeline?.map((step, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: step.completed ? CYAN.main : '#E2E8F0' },
                ]}
              />
              {index < item.timeline.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: step.completed ? CYAN.main : '#E2E8F0' },
                  ]}
                />
              )}
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineStatus}>{step.status}</Text>
              <Text style={styles.timelineDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#64748B' }}>Loading your grievances...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Glass Header */}
      <LinearGradient
        colors={['rgba(6,182,212,0.25)', 'rgba(255,255,255,0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Track Grievances</Text>
            <Text style={styles.headerSubtitle}>Monitor your submitted complaints</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.profileButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[CYAN.main, CYAN.light]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileGradient}
            >
              <Feather name="user" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { opacity: toastAnim, transform: [{ scale: toastAnim }] },
        ]}
      >
        <Text style={styles.toastText}>Refreshing...</Text>
      </Animated.View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {[
          { label: 'Total', count: stats.total },
          { label: 'Resolved', count: stats.resolved },
          { label: 'Pending', count: stats.pending },
        ].map((stat, index) => (
          <View key={index} style={styles.statsCard}>
            <Text style={styles.statsNumber}>{stat.count}</Text>
            <Text style={styles.statsLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* List */}
      {grievances.length > 0 ? (
        <FlatList
          data={grievances}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="clipboard" size={64} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Grievances Found</Text>
          <Text style={styles.emptyText}>Submit a grievance to start tracking.</Text>
        </View>
      )}

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(6,182,212,0.15)',
    shadowColor: CYAN.main,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#0F172A' },
  headerSubtitle: { fontSize: 15, color: '#64748B', marginTop: 4 },
  profileButton: { width: 45, height: 45, borderRadius: 22.5, overflow: 'hidden' },
  profileGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  toast: {
    position: 'absolute',
    top: 105,
    alignSelf: 'center',
    backgroundColor: 'rgba(6,182,212,0.9)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  toastText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(6,182,212,0.4)',
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: CYAN.main,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statsNumber: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  statsLabel: { fontSize: 13, color: '#64748B', marginTop: 4, textTransform: 'uppercase' },

  trackCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(6,182,212,0.3)',
    shadowColor: CYAN.main,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 10 },
  cardDescription: { fontSize: 14, color: '#64748B', marginTop: 8, lineHeight: 20 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },

  timelineContainer: { borderTopWidth: 1, borderTopColor: '#E2E8F0', marginTop: 14, paddingTop: 12 },
  timelineTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 12 },
  timelineLeft: { alignItems: 'center', marginRight: 14 },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineLine: { width: 2, height: 38, marginTop: 2 },
  timelineRight: { flex: 1 },
  timelineStatus: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  timelineDescription: { fontSize: 13, color: '#64748B', lineHeight: 18 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginTop: 20 },
  emptyText: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 6 },

  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 25,
    shadowColor: CYAN.main,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  refreshGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
