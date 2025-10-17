import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getGrievanceStats, GrievanceItem, loadGrievances } from '../../dataStorage';

interface TimelineItem {
  status: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
}

interface TrackCardProps {
  item: GrievanceItem;
  index: number;
}

const TrackCard: React.FC<TrackCardProps> = React.memo(({ item, index }) => {
  const slideAnim = useMemo(() => new Animated.Value(0), []);
  const opacityAnim = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    // Simple entrance animation only once
    slideAnim.setValue(50);
    opacityAnim.setValue(0);
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      })
    ]).start();
  }, []); // Only run once when component mounts

  const getStatusColor = useCallback((): string => {
    switch (item.status) {
      case 'Resolved': return '#10B981';
      case 'In Progress': return '#F59E0B';
      case 'Under Review': return '#8B5CF6';
      default: return '#6B7280';
    }
  }, [item.status]);

  const getPriorityColor = useCallback((): string => {
    switch (item.priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      default: return '#10B981';
    }
  }, [item.priority]);

  const getCategoryColor = useCallback((): string => {
    switch (item.category) {
      case 'Technical': return '#6366F1';
      case 'Facilities': return '#EF4444';
      case 'Administrative': return '#8B5CF6';
      case 'Infrastructure': return '#10B981';
      case 'Academics': return '#8B5CF6';
      case 'Hostel': return '#06B6D4';
      default: return '#6366F1';
    }
  }, [item.category]);

  const handleCardPress = useCallback(() => {
    if (item.timeline && item.timeline.length > 0) {
      const timelineText = item.timeline
        .map(t => `• ${t.status} (${t.date} ${t.time})\n  ${t.description}`)
        .join('\n\n');
      
      Alert.alert(
        `${item.title} - Timeline`,
        timelineText,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        item.title,
        `Status: ${item.status}\nCategory: ${item.category}\nPriority: ${item.priority}\nDate: ${item.date}\n\nDescription: ${item.description}`,
        [{ text: "OK" }]
      );
    }
  }, [item]);

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9}>
      <Animated.View 
        style={[
          styles.trackCard, 
          { 
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim 
          }
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {item.status}
              </Text>
            </View>
          </View>
          
          {/* Description */}
          <Text style={styles.cardDescription}>{item.description}</Text>
          
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Feather name="tag" size={12} color={getCategoryColor()} />
              <Text style={[styles.metaText, { color: getCategoryColor() }]}>{item.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={12} color="#64748B" />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '15' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
                {item.priority}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        {item.timeline && item.timeline.length > 0 && (
          <View style={styles.timelineContainer}>
            <Text style={styles.timelineTitle}>Progress Timeline</Text>
            {item.timeline.map((timelineItem, timelineIndex) => (
              <View key={timelineIndex} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View 
                    style={[
                      styles.timelineDot,
                      { 
                        backgroundColor: timelineItem.completed ? getStatusColor() : '#E2E8F0'
                      }
                    ]}
                  />
                  {timelineIndex < item.timeline!.length - 1 && (
                    <View 
                      style={[
                        styles.timelineLine, 
                        { backgroundColor: timelineItem.completed ? getStatusColor() : '#E2E8F0' }
                      ]} 
                    />
                  )}
                </View>
                <View style={styles.timelineRight}>
                  <View style={styles.timelineHeader}>
                    <Text 
                      style={[
                        styles.timelineStatus,
                        { 
                          color: timelineItem.completed ? '#1E293B' : '#94A3B8' 
                        }
                      ]}
                    >
                      {timelineItem.status}
                    </Text>
                    <Text style={styles.timelineDateTime}>
                      {timelineItem.date} • {timelineItem.time}
                    </Text>
                  </View>
                  <Text 
                    style={[
                      styles.timelineDescription,
                      { 
                        color: timelineItem.completed ? '#64748B' : '#94A3B8' 
                      }
                    ]}
                  >
                    {timelineItem.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

interface StatsCardProps {
  title: string;
  count: number;
  animationDelay: number;
}

const StatsCard: React.FC<StatsCardProps> = React.memo(({ title, count, animationDelay }) => {
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: animationDelay,
      useNativeDriver: true,
    }).start();
  }, [animationDelay]);

  return (
    <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
      <Text style={styles.statsNumber}>{count}</Text>
      <Text style={styles.statsLabel}>{title}</Text>
    </Animated.View>
  );
});

export default function TrackGrievanceScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats dynamically
  const stats = useMemo(() => getGrievanceStats(grievances), [grievances]);

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

  // This runs every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
      setRefreshKey(prev => prev + 1);
    }, [loadData])
  );

  // Render item function with proper key
  const renderItem = useCallback(({ item, index }: { item: GrievanceItem; index: number }) => (
    <TrackCard 
      item={item} 
      index={index}
    />
  ), []);

  // Key extractor
  const keyExtractor = useCallback((item: GrievanceItem) => item.id, []);

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Track Grievances</Text>
            <Text style={styles.headerSubtitle}>Monitor the progress of your submitted complaints</Text>
          </View>

          {/* Stats Summary */}
          <View style={styles.statsContainer}>
            <StatsCard title="Total" count={stats.total} animationDelay={0} />
            <StatsCard title="Resolved" count={stats.resolved} animationDelay={200} />
            <StatsCard title="Pending" count={stats.pending} animationDelay={400} />
          </View>

          {/* Grievances List */}
          {grievances.length > 0 ? (
            <FlatList
              data={grievances}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              getItemLayout={(data, index) => ({
                length: 200, // Approximate item height
                offset: 200 * index,
                index,
              })}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="clipboard" size={64} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Grievances Found</Text>
              <Text style={styles.emptyText}>You haven't submitted any grievances yet.</Text>
              <Text style={styles.emptySubtext}>Start by submitting your first grievance in the Submit tab.</Text>
            </View>
          )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
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
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  trackCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 20,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  timelineLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineDateTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  timelineDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
