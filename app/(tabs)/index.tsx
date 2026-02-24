import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface UserData {
  name: string;
  carbon_saved_kg: number;
  total_rides: number;
  rating: number;
}

interface TripData {
  from: string;
  to: string;
  fromLat?: string;
  fromLon?: string;
  toLat?: string;
  toLon?: string;
}

interface LocationSuggestion {
  name: string;
  display_name: string;
  lat: string;
  lon: string;
}

const fetchLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  if (query.length < 2) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { 'User-Agent': 'Ecoyatra App' } }
    );
    return await response.json();
  } catch {
    return [];
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Traveler');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<TripData>({ from: '', to: '' });
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fromSearchTimeout = useRef<any>(null);
  const toSearchTimeout = useRef<any>(null);

  useEffect(() => {
    fetchUserData();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const fetchUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);
      setUserData({ name: name || 'Traveler', carbon_saved_kg: 12.5, total_rides: 42, rating: 4.8 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFromChange = (text: string) => {
    setTripData(prev => ({ ...prev, from: text }));
    setShowFromSuggestions(text.length > 0);
    if (fromSearchTimeout.current) clearTimeout(fromSearchTimeout.current);
    if (text.length >= 2) {
      setLoadingFrom(true);
      fromSearchTimeout.current = setTimeout(async () => {
        const s = await fetchLocationSuggestions(text);
        setFromSuggestions(s);
        setLoadingFrom(false);
      }, 500);
    } else {
      setFromSuggestions([]);
      setLoadingFrom(false);
    }
  };

  const handleToChange = (text: string) => {
    setTripData(prev => ({ ...prev, to: text }));
    setShowToSuggestions(text.length > 0);
    if (toSearchTimeout.current) clearTimeout(toSearchTimeout.current);
    if (text.length >= 2) {
      setLoadingTo(true);
      toSearchTimeout.current = setTimeout(async () => {
        const s = await fetchLocationSuggestions(text);
        setToSuggestions(s);
        setLoadingTo(false);
      }, 500);
    } else {
      setToSuggestions([]);
      setLoadingTo(false);
    }
  };

  const selectFromLocation = (loc: LocationSuggestion) => {
    setTripData(prev => ({ ...prev, from: loc.display_name, fromLat: loc.lat, fromLon: loc.lon }));
    setShowFromSuggestions(false);
    setFromSuggestions([]);
  };

  const selectToLocation = (loc: LocationSuggestion) => {
    setTripData(prev => ({ ...prev, to: loc.display_name, toLat: loc.lat, toLon: loc.lon }));
    setShowToSuggestions(false);
    setToSuggestions([]);
  };

  const handlePlanTrip = () => {
    if (!tripData.from.trim() || !tripData.to.trim()) {
      Alert.alert('Missing Information', 'Please fill in both From and To locations');
      return;
    }
    router.push({
      pathname: '/(tabs)/NativeMap',
      params: {
        from: tripData.from, to: tripData.to,
        fromLat: tripData.fromLat || '20.2961', fromLon: tripData.fromLon || '85.8245',
        toLat: tripData.toLat || '20.3561', toLon: tripData.toLon || '85.8845',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const statItems = [
    { icon: 'bicycle', value: userData?.total_rides, label: 'Rides' },
    { icon: 'leaf', value: userData?.carbon_saved_kg?.toFixed(1), label: 'kg CO₂' },
    { icon: 'star', value: userData?.rating?.toFixed(1), label: 'Rating' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.headerLogo} 
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.7} style={styles.profileBtn}>
            <Feather name="user" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Stats Cards */}
          {userData && (
            <View style={styles.statsRow}>
              {statItems.map((s, i) => (
                <View key={i} style={styles.statCard}>
                  <Ionicons name={s.icon as any} size={20} color="#16A34A" />
                  <Text style={styles.statNum}>{s.value}</Text>
                  <Text style={styles.statLbl}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Trip Planner Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.compassBubble}>
                <Feather name="compass" size={20} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Plan a Journey</Text>
                <Text style={styles.cardSub}>Find your eco-friendly route</Text>
              </View>
            </View>

            {/* From Field */}
            <View style={styles.inputField}>
              <View style={styles.inputIconBox}>
                <View style={styles.inputDot} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Where from?"
                placeholderTextColor="#9CA3AF"
                value={tripData.from}
                onChangeText={handleFromChange}
              />
              {loadingFrom && <ActivityIndicator size="small" color="#16A34A" style={styles.loader} />}
            </View>
            
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <View style={styles.dropdown}>
                <ScrollView style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                  {fromSuggestions.map((item, index) => (
                    <TouchableOpacity key={`from-${index}`} style={styles.dropdownItem} onPress={() => selectFromLocation(item)}>
                      <Feather name="map-pin" size={14} color="#6B7280" style={{marginTop: 2}} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.dropdownName} numberOfLines={1}>{item.display_name.split(',')[0]}</Text>
                        <Text style={styles.dropdownAddr} numberOfLines={1}>{item.display_name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Divider Line connecting dots */}
            <View style={styles.connectionLine} />

            {/* To Field */}
            <View style={styles.inputField}>
              <View style={styles.inputIconBox}>
                <View style={[styles.inputSquare]} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Where to?"
                placeholderTextColor="#9CA3AF"
                value={tripData.to}
                onChangeText={handleToChange}
              />
              {loadingTo && <ActivityIndicator size="small" color="#16A34A" style={styles.loader} />}
            </View>
            
            {showToSuggestions && toSuggestions.length > 0 && (
              <View style={styles.dropdown}>
                <ScrollView style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                  {toSuggestions.map((item, index) => (
                    <TouchableOpacity key={`to-${index}`} style={styles.dropdownItem} onPress={() => selectToLocation(item)}>
                      <Feather name="navigation" size={14} color="#6B7280" style={{marginTop: 2}} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.dropdownName} numberOfLines={1}>{item.display_name.split(',')[0]}</Text>
                        <Text style={styles.dropdownAddr} numberOfLines={1}>{item.display_name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Plan Button */}
            <TouchableOpacity style={styles.planBtn} onPress={handlePlanTrip} activeOpacity={0.8}>
              <Text style={styles.planBtnText}>Search Rides</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {[
              { label: 'Leaderboard', route: '/(tabs)/leaderboard', icon: 'award' },
              { label: 'Past Rides', route: '/(tabs)/history', icon: 'clock' },
              { label: 'Profile', route: '/(tabs)/profile', icon: 'user' },
              { label: 'Challenges', route: null, icon: 'target' },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickCard}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.route) router.push(item.route as any);
                  else Alert.alert('Coming Soon', 'Challenges feature arriving soon!');
                }}
              >
                <View style={styles.quickIconBox}>
                  <Feather name={item.icon as any} size={20} color="#111827" />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: { width: 44, height: 44, borderRadius: 12 },
  greetingText: { fontSize: 13, fontWeight: '500', color: '#6B7280', marginBottom: 2 },
  userNameText: { fontSize: 20, fontWeight: '700', color: '#111827' },
  profileBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  statNum: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 8 },
  statLbl: { fontSize: 12, fontWeight: '500', color: '#6B7280', marginTop: 2 },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 28,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  compassBubble: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 2 },
  cardSub: { fontSize: 13, fontWeight: '500', color: '#6B7280' },

  // Input
  inputField: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 14,
    minHeight: 52, paddingHorizontal: 14,
  },
  inputIconBox: { width: 24, alignItems: 'center', justifyContent: 'center' },
  inputDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16A34A' },
  inputSquare: { width: 8, height: 8, backgroundColor: '#111827' },
  connectionLine: {
    position: 'absolute', left: 45, top: 122, width: 2, height: 24,
    backgroundColor: '#D1D5DB', zIndex: 10,
  },
  textInput: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500', paddingVertical: 14 },
  loader: { marginLeft: 8 },

  // Dropdown
  dropdown: {
    backgroundColor: '#FFFFFF', borderRadius: 14, marginTop: 6, marginBottom: 16,
    borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  dropdownAddr: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Plan Button
  planBtn: {
    backgroundColor: '#16A34A', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  planBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  // Section Header
  sectionHeader: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16, paddingHorizontal: 4 },

  // Quick Cards
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 4 },
  quickCard: {
    width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 16, alignItems: 'center', 
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  quickIconBox: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  quickLabel: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'center' },
});
