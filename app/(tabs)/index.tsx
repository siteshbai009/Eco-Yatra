import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
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
import { useUser } from '../../UserContext';
import { getGrievanceStats, loadGrievances } from '../../dataStorage';

const { width } = Dimensions.get('window');

// Type definitions
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

interface StatsCardProps {
  title: string;
  count: number;
  color: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  animationDelay: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, count, color, icon, onPress, animationDelay }) => {
  const fadeAnim = new Animated.Value(0);

  const startAnimation = useCallback(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: animationDelay,
      useNativeDriver: true,
    }).start();
  }, [animationDelay, count]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation, count]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.statsButton} activeOpacity={0.8}>
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

interface GrievanceCardProps {
  item: GrievanceItem;
  index: number;
  onPress: () => void;
  resetAnimation: boolean;
}

const GrievanceCard: React.FC<GrievanceCardProps> = ({ item, index, onPress, resetAnimation }) => {
  const slideAnim = new Animated.Value(50);
  const opacityAnim = new Animated.Value(0);

  const startAnimation = useCallback(() => {
    slideAnim.setValue(50);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      })
    ]).start();
  }, [index]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation, resetAnimation]);

  const getStatusColor = (): string => {
    switch (item.status) {
      case 'Resolved': return '#10B981';
      case 'In Progress': return '#F59E0B';
      case 'Under Review': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (): string => {
    switch (item.priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.grievanceCard,
          {
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '15' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
                {item.priority}
              </Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.categoryContainer}>
            <Feather name="tag" size={14} color="#8B5CF6" />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { user, greeting } = useUser();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  // State for dynamic data
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Better Authentication check - runs every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        try {
          console.log('Checking auth on focus...');
          const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
          if (!isLoggedIn || isLoggedIn !== 'true') {
            console.log('Not logged in, redirecting to login...');
            router.replace('/login');
            return;
          }
          console.log('Auth check passed');
        } catch (error) {
          console.log('Auth check error:', error);
          router.replace('/login');
        }
      };

      checkAuth();
    }, [])
  );

  const stats = getGrievanceStats(grievances);
  const statsData: StatsItem[] = [
    { title: 'Total', count: stats.total, color: '#6366F1', icon: 'file-text' },
    { title: 'Pending', count: stats.pending, color: '#F59E0B', icon: 'clock' },
    { title: 'Resolved', count: stats.resolved, color: '#10B981', icon: 'check-circle' }
  ];

  // Load grievances from storage
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedGrievances = await loadGrievances();
      setGrievances(loadedGrievances);
    } catch (error) {
      console.error('Error loading grievances:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data when screen comes into focus (reloads after navigation too)
  useFocusEffect(
    useCallback(() => {
      loadData();
      setRefreshKey(prev => prev + 1);
    }, [loadData])
  );

  const handleStatsPress = (title: string) => {
    if (title === 'Total' || title === 'Pending') {
      router.push('/track');
    } else {
      Alert.alert(`${title} Grievances`, `View all ${title.toLowerCase()} grievances in Track section.`);
    }
  };

  const handleCardPress = (item: GrievanceItem) => {
    Alert.alert(
      item.title,
      `Status: ${item.status}\nCategory: ${item.category}\nPriority: ${item.priority}\n\n${item.description}`,
      [
        { text: "View Details", onPress: () => router.push('/track') },
        { text: "Close", style: "cancel" }
      ]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#64748B' }}>Loading your grievances...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Header - notification icon removed */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>{greeting} 👋</Text>
                <Text style={styles.username}>{user.name}</Text>
                <Text style={styles.subtitle}>Welcome to GIET Grievance Portal</Text>
              </View>
            </View>

            {/* Stats Cards - 3 in a Row */}
            <View style={styles.statsContainer}>
              {statsData.map((stat, index) => (
                <StatsCard
                  key={`${stat.title}-${refreshKey}`}
                  {...stat}
                  onPress={() => handleStatsPress(stat.title)}
                  animationDelay={index * 200}
                />
              ))}
            </View>

            {/* Recent Activity */}
            <View style={styles.activityContainer}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityCard}>
                {grievances.length > 0 ? (
                  <>
                    <View style={styles.activityItem}>
                      <View style={[styles.activityIcon, { backgroundColor: '#6366F115' }]}>
                        <Feather name="plus-circle" size={18} color="#6366F1" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>New Submission</Text>
                        <Text style={styles.activityText}>{grievances[0].title} - {grievances[0].date}</Text>
                      </View>
                    </View>

                    {grievances.length > 1 && (
                      <>
                        <View style={styles.activityDivider} />
                        <View style={styles.activityItem}>
                          <View style={[styles.activityIcon, { backgroundColor: '#F59E0B15' }]}>
                            <Feather name="clock" size={18} color="#F59E0B" />
                          </View>
                          <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Status Update</Text>
                            <Text style={styles.activityText}>{grievances[1].title} - {grievances[1].status}</Text>
                          </View>
                        </View>
                      </>
                    )}

                    {grievances.filter(g => g.status === 'Resolved').length > 0 && (
                      <>
                        <View style={styles.activityDivider} />
                        <View style={styles.activityItem}>
                          <View style={[styles.activityIcon, { backgroundColor: '#10B98115' }]}>
                            <Feather name="check-circle" size={18} color="#10B981" />
                          </View>
                          <View style={styles.activityContent}>
                            <Text style={styles.activityTitle}>Grievance Resolved</Text>
                            <Text style={styles.activityText}>{grievances.find(g => g.status === 'Resolved')?.title} - Completed</Text>
                          </View>
                        </View>
                      </>
                    )}
                  </>
                ) : (
                  <View style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: '#6366F115' }]}>
                      <Feather name="info" size={18} color="#6366F1" />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>No Activity Yet</Text>
                      <Text style={styles.activityText}>Submit your first grievance to see activity here</Text>
                    </View>
                  </View>
                )}
              </View>
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
                grievances.slice(0, 3).map((item, index) => (
                  <GrievanceCard
                    key={`${item.id}-${refreshKey}`}
                    item={item}
                    index={index}
                    onPress={() => handleCardPress(item)}
                    resetAnimation={refreshKey > 0}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Feather name="clipboard" size={48} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>No Grievances Yet</Text>
                  <Text style={styles.emptyText}>Start by submitting your first grievance</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 16,
  },
  statsButton: {
    flex: 1,
    alignItems: 'center',
  },
  statsCard: {
    alignItems: 'center',
  },
  statsIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  statsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#64748B',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
    marginLeft: 56,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  grievanceCard: {
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  statusRow: {
    alignItems: 'flex-end',
    gap: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
