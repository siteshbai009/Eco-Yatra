import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface TripOption {
  id: string;
  mode: string;
  icon: string;
  desc: string;
  cost: number;
  duration: number;
  carbonSaved: number;
  distance: number;
  passengers?: number;
}

export default function TripDetailsScreen() {
  const router = useRouter();
  const { from, to, mode } = useLocalSearchParams();

  const [selectedOption, setSelectedOption] = useState<string | null>('1');
  const [distance, setDistance] = useState(12.5);
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  // Trip options with pricing
  const tripOptions: TripOption[] = [
    {
      id: '1',
      mode: 'Carpool',
      icon: 'users',
      desc: 'Eco-friendly sharing',
      cost: 45,
      duration: 22,
      carbonSaved: 1.5,
      distance: 12.5,
      passengers: 3,
    },
    {
      id: '2',
      mode: 'Public Transit',
      icon: 'transit',
      desc: 'Local bus & train',
      cost: 20,
      duration: 28,
      carbonSaved: 0.625,
      distance: 12.5,
    },
    {
      id: '3',
      mode: 'Bike',
      icon: 'bike-2',
      desc: 'Healthy & green',
      cost: 0,
      duration: 35,
      carbonSaved: 3.125,
      distance: 12.5,
      passengers: 1,
    },
    {
      id: '4',
      mode: 'Walk',
      icon: 'activity',
      desc: 'Zero emissions',
      cost: 0,
      duration: 150,
      carbonSaved: 3.125,
      distance: 12.5,
      passengers: 1,
    },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'users': return <MaterialIcons name="groups" size={28} color="#111827" />;
      case 'transit': return <MaterialIcons name="directions-bus" size={28} color="#111827" />;
      case 'bike-2': return <MaterialIcons name="two-wheeler" size={28} color="#111827" />;
      case 'activity': return <Feather name="activity" size={28} color="#111827" />;
      default: return <Feather name="smile" size={28} color="#111827" />;
    }
  };

  const selectedTripData = tripOptions.find((opt) => opt.id === selectedOption);

  const handleConfirmTrip = () => {
    if (!selectedTripData) {
      Alert.alert('Error', 'Please select a transport mode');
      return;
    }

    router.push({
      pathname: '/ticketConfirmation',
      params: {
        mode: selectedTripData.mode,
        cost: String(selectedTripData.cost),
        carbonSaved: String(selectedTripData.carbonSaved.toFixed(2)),
        from: String(from),
        to: String(to),
        distance: String(distance.toFixed(1)),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
        
        {/* Top summary matching the image's top info text */}
        <View style={styles.summaryTop}>
          <Text style={styles.ridesForYouTxt}>Rides for you</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsTxt}>{distance.toFixed(1)} km</Text>
            <Text style={styles.statsDot}>·</Text>
            <Feather name="clock" size={14} color="#6B7280" />
            <Text style={styles.statsTxt}> 13 mins</Text>
          </View>
        </View>

        {/* Options List */}
        <ScrollView
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.optionsContent}
        >
          {tripOptions.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelectedOption(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    {getIconComponent(option.icon)}
                    {isSelected && <View style={styles.iconBadge}><Feather name="check" size={10} color="#FFFFFF" /></View>}
                  </View>
                </View>

                <View style={styles.cardMiddle}>
                  <Text style={styles.optionMode}>{option.mode}</Text>
                  <Text style={styles.optionDesc}>
                    {option.desc} {option.passengers ? `· 👤 ${option.passengers}` : ''}
                  </Text>
                </View>

                <View style={styles.cardRight}>
                  {option.cost > 0 ? (
                    <Text style={styles.optionPrice}>₹ {option.cost}</Text>
                  ) : (
                    <Text style={styles.optionPrice}>FREE</Text>
                  )}
                  {option.carbonSaved > 0 && (
                     <Text style={styles.saveBadge}>-{option.carbonSaved}kg CO₂</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Bottom Button */}
      {selectedTripData && (
        <View style={styles.bottomArea}>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmTrip} activeOpacity={0.8}>
            <Text style={styles.confirmBtnTxt}>
              Book {selectedTripData.mode} @ {selectedTripData.cost > 0 ? `₹${selectedTripData.cost}` : 'Free'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  
  content: { flex: 1 },

  summaryTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  ridesForYouTxt: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsTxt: { fontSize: 13, color: '#6B7280', fontWeight: '500', marginHorizontal: 4 },
  statsDot: { fontSize: 16, color: '#6B7280', fontWeight: '700', marginHorizontal: 2, top: -2 },

  optionsContainer: { flex: 1 },
  optionsContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },

  optionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  optionCardSelected: {
    borderColor: '#16A34A', borderWidth: 2, padding: 15,
  },
  
  cardLeft: { width: 60, alignItems: 'center', justifyContent: 'center' },
  iconContainer: {
    position: 'relative', width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  iconBadge: {
    position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#16A34A', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFFFFF',
  },

  cardMiddle: { flex: 1, paddingLeft: 10 },
  optionMode: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  optionDesc: { fontSize: 13, fontWeight: '500', color: '#6B7280' },

  cardRight: { alignItems: 'flex-end', justifyContent: 'center' },
  optionPrice: { fontSize: 18, fontWeight: '800', color: '#111827' },
  saveBadge: {
    marginTop: 6, fontSize: 10, fontWeight: '600', color: '#16A34A',
  },

  bottomArea: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB',
  },
  confirmBtn: {
    backgroundColor: '#16A34A', borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmBtnTxt: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
});
