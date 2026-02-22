import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

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
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fromSearchTimeout = useRef<any>(null);
  const toSearchTimeout = useRef<any>(null);

  useEffect(() => {
    fetchUserData();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
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
        <ActivityIndicator size="large" color="#3DBF87" />
      </View>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning ☀️' : hour < 17 ? 'Good Afternoon 🌤️' : 'Good Evening 🌙';

  const statItems = [
    { icon: 'bicycle', value: userData?.total_rides, label: 'Rides', color: '#A8E6CF', shadow: '#6BCBA5', iconColor: '#2D8A5F' },
    { icon: 'leaf', value: `${userData?.carbon_saved_kg?.toFixed(1)}`, label: 'kg CO₂', color: '#C8F5E0', shadow: '#90DFBA', iconColor: '#2D6A45' },
    { icon: 'star', value: userData?.rating?.toFixed(1), label: 'Rating', color: '#FFE8A0', shadow: '#FFCC40', iconColor: '#B8860B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />

      {/* Background blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />

      {/* Header */}
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerWrap}>
          <View style={styles.headerShadow} />
          <View style={styles.header}>
            <View style={styles.headerHighlight} />
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.greetingText}>{greeting}</Text>
                <Text style={styles.userNameText}>{userName} 👋</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                <View style={styles.profileBtnWrap}>
                  <View style={styles.profileBtnShadow} />
                  <View style={styles.profileBtn}>
                    <View style={styles.profileBtnHighlight} />
                    <Feather name="user" size={20} color="#FFF" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
                <View key={i} style={styles.statCardWrap}>
                  <View style={[styles.statCardShadow, { backgroundColor: s.shadow }]} />
                  <View style={[styles.statCard, { backgroundColor: s.color }]}>
                    <View style={styles.statCardHighlight} />
                    <Ionicons name={s.icon as any} size={22} color={s.iconColor} />
                    <Text style={styles.statNum}>{s.value}</Text>
                    <Text style={styles.statLbl}>{s.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Trip Planner Card */}
          <View style={styles.cardWrap}>
            <View style={styles.cardShadow} />
            <View style={styles.card}>
              <View style={styles.cardHighlight} />

              <View style={styles.cardHeaderRow}>
                <View style={styles.compassBubbleWrap}>
                  <View style={styles.compassBubbleShadow} />
                  <View style={styles.compassBubble}>
                    <View style={styles.compassBubbleHighlight} />
                    <Feather name="compass" size={22} color="#2D8A5F" />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>🗺️ Plan a Journey</Text>
                  <Text style={styles.cardSub}>Find your eco-friendly route</Text>
                </View>
              </View>

              {/* From Field */}
              <Text style={styles.fieldLabel}>📍 Starting Point</Text>
              <View style={styles.inputWrap}>
                <View style={styles.inputShadow} />
                <View style={styles.inputField}>
                  <Feather name="map-pin" size={16} color="#3DBF87" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Where from?"
                    placeholderTextColor="#B0C8B8"
                    value={tripData.from}
                    onChangeText={handleFromChange}
                  />
                  {loadingFrom && <ActivityIndicator size="small" color="#3DBF87" />}
                </View>
              </View>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <View style={styles.dropdown}>
                  <ScrollView style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled">
                    {fromSuggestions.map((item, index) => (
                      <TouchableOpacity key={`from-${index}`} style={styles.dropdownItem} onPress={() => selectFromLocation(item)}>
                        <Feather name="map-pin" size={13} color="#3DBF87" />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={styles.dropdownName} numberOfLines={1}>{item.display_name.split(',')[0]}</Text>
                          <Text style={styles.dropdownAddr} numberOfLines={1}>{item.display_name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Divider */}
              <View style={styles.fieldDivider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerDot} />
                <View style={styles.dividerLine} />
              </View>

              {/* To Field */}
              <Text style={styles.fieldLabel}>🏁 Destination</Text>
              <View style={styles.inputWrap}>
                <View style={[styles.inputShadow, { backgroundColor: '#FFB0B8' }]} />
                <View style={styles.inputField}>
                  <Feather name="navigation" size={16} color="#FF7B8A" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Where to?"
                    placeholderTextColor="#B0C8B8"
                    value={tripData.to}
                    onChangeText={handleToChange}
                  />
                  {loadingTo && <ActivityIndicator size="small" color="#FF7B8A" />}
                </View>
              </View>
              {showToSuggestions && toSuggestions.length > 0 && (
                <View style={styles.dropdown}>
                  <ScrollView style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled">
                    {toSuggestions.map((item, index) => (
                      <TouchableOpacity key={`to-${index}`} style={styles.dropdownItem} onPress={() => selectToLocation(item)}>
                        <Feather name="navigation" size={13} color="#FF7B8A" />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={styles.dropdownName} numberOfLines={1}>{item.display_name.split(',')[0]}</Text>
                          <Text style={styles.dropdownAddr} numberOfLines={1}>{item.display_name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Plan Button */}
              <View style={styles.planBtnWrap}>
                <View style={styles.planBtnShadow} />
                <TouchableOpacity style={styles.planBtn} onPress={handlePlanTrip} activeOpacity={0.85}>
                  <View style={styles.planBtnHighlight} />
                  <Feather name="compass" size={18} color="#FFF" />
                  <Text style={styles.planBtnText}>Begin Journey 🌿</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionHeader}>⚡ Quick Actions</Text>
          <View style={styles.quickGrid}>
            {[
              { label: 'Leaderboard', route: '/(tabs)/leaderboard', emoji: '🏆', color: '#FFE8A0', shadow: '#FFCC40' },
              { label: 'Past Rides', route: '/(tabs)/history', emoji: '📜', color: '#D4C8F5', shadow: '#A090E0' },
              { label: 'Profile', route: '/(tabs)/profile', emoji: '👤', color: '#FFD4E8', shadow: '#FF9EC8' },
              { label: 'Challenges', route: null, emoji: '🎯', color: '#A8E6CF', shadow: '#6BCBA5' },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickCardWrap}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.route) router.push(item.route as any);
                  else Alert.alert('Coming Soon', 'Challenges feature arriving soon!');
                }}
              >
                <View style={[styles.quickCardShadow, { backgroundColor: item.shadow }]} />
                <View style={[styles.quickCard, { backgroundColor: item.color }]}>
                  <View style={styles.quickCardHighlight} />
                  <Text style={styles.quickEmoji}>{item.emoji}</Text>
                  <Text style={styles.quickLabel}>{item.label}</Text>
                </View>
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
  container: { flex: 1, backgroundColor: '#E8F4FF' },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F4FF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.45 },
  blob1: { width: 280, height: 280, backgroundColor: '#C8EDDA', top: -60, left: -60 },
  blob2: { width: 220, height: 220, backgroundColor: '#D4C8F5', top: 200, right: -60 },
  blob3: { width: 180, height: 180, backgroundColor: '#FFE0CC', bottom: 100, left: -40 },

  // Header
  headerWrap: { position: 'relative', margin: 16, marginBottom: 0 },
  headerShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#A8D8FF', borderRadius: 28, opacity: 0.5,
  },
  header: {
    backgroundColor: '#3DBF87', borderRadius: 28, overflow: 'hidden',
    shadowColor: '#3DBF87', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  headerHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 40,
    backgroundColor: 'rgba(255,255,255,0.25)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerLeft: {},
  greetingText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  userNameText: { fontSize: 22, fontWeight: '900', color: '#FFF' },

  profileBtnWrap: { position: 'relative' },
  profileBtnShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#2D8A5F', borderRadius: 24, opacity: 0.6,
  },
  profileBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  profileBtnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 22,
    backgroundColor: 'rgba(255,255,255,0.4)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCardWrap: { flex: 1, position: 'relative' },
  statCardShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    borderRadius: 22, opacity: 0.7,
  },
  statCard: {
    borderRadius: 22, paddingVertical: 16, paddingHorizontal: 8,
    alignItems: 'center', gap: 4, overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  statCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    backgroundColor: 'rgba(255,255,255,0.6)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  statNum: { fontSize: 20, fontWeight: '900', color: '#2D4A30', marginTop: 2 },
  statLbl: { fontSize: 10, fontWeight: '700', color: '#5A7A60' },

  // Card
  cardWrap: { position: 'relative', marginBottom: 20 },
  cardShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#B0DEFF', borderRadius: 32, opacity: 0.5,
  },
  card: {
    backgroundColor: '#FFF', borderRadius: 32, padding: 20,
    shadowColor: '#B0DEFF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16,
    elevation: 8, overflow: 'hidden',
  },
  cardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 50,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },

  compassBubbleWrap: { position: 'relative' },
  compassBubbleShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#6BCBA5', borderRadius: 20, opacity: 0.5,
  },
  compassBubble: {
    width: 50, height: 50, borderRadius: 20, backgroundColor: '#E0F8EE',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  compassBubbleHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 22,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },

  cardTitle: { fontSize: 17, fontWeight: '900', color: '#2D4A30', marginBottom: 2 },
  cardSub: { fontSize: 12, fontWeight: '600', color: '#6B9A80' },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: '#5A9A75', marginBottom: 8, marginTop: 4 },

  // Input
  inputWrap: { position: 'relative', marginBottom: 8 },
  inputShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#B0DEFF', borderRadius: 18, opacity: 0.5,
  },
  inputField: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F9FF', borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 13,
    shadowColor: '#B0DEFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
    elevation: 4,
  },
  textInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#2D4A30', fontWeight: '600' },

  // Dropdown
  dropdown: {
    backgroundColor: '#FAFFFE', borderRadius: 18, marginBottom: 8, overflow: 'hidden',
    shadowColor: '#A8E6CF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
    elevation: 6, borderWidth: 2, borderColor: '#E0F5EA',
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEF8F2' },
  dropdownName: { fontSize: 13, fontWeight: '800', color: '#2D4A30' },
  dropdownAddr: { fontSize: 11, color: '#8AB8A0', marginTop: 1 },

  // Field Divider
  fieldDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  dividerLine: { flex: 1, height: 2, backgroundColor: '#E0F5EA', borderRadius: 1 },
  dividerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3DBF87', marginHorizontal: 10 },

  // Plan button
  planBtnWrap: { position: 'relative', marginTop: 16 },
  planBtnShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#6BCBA5', borderRadius: 22, opacity: 0.6,
  },
  planBtn: {
    backgroundColor: '#3DBF87', borderRadius: 22, paddingVertical: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    overflow: 'hidden',
    shadowColor: '#3DBF87', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  planBtnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  planBtnText: { fontSize: 17, fontWeight: '900', color: '#FFF', letterSpacing: 0.3 },

  // Section header
  sectionHeader: { fontSize: 17, fontWeight: '900', color: '#2D4A30', marginBottom: 14, marginTop: 4 },

  // Quick cards
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCardWrap: { width: (width - 44) / 2, position: 'relative' },
  quickCardShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    borderRadius: 26, opacity: 0.7,
  },
  quickCard: {
    borderRadius: 26, padding: 22, alignItems: 'center', overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 8,
  },
  quickCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 40,
    backgroundColor: 'rgba(255,255,255,0.6)', borderTopLeftRadius: 26, borderTopRightRadius: 26,
  },
  quickEmoji: { fontSize: 34, marginBottom: 8 },
  quickLabel: { fontSize: 13, fontWeight: '800', color: '#2D4A30', textAlign: 'center' },
});
