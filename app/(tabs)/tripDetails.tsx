import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  color: string;
  cost: number;
  duration: number;
  carbonSaved: number;
  distance: number;
  passengers?: number;
  availability: number;
}

export default function TripDetailsScreen() {
  const router = useRouter();
  const { from, to, mode } = useLocalSearchParams();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [distance, setDistance] = useState(12.5);
  const [showDirections, setShowDirections] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  // Trip options with pricing
  const tripOptions: TripOption[] = [
    {
      id: '1',
      mode: 'Carpool',
      icon: 'users',
      color: '#FF6B6B',
      cost: 45,
      duration: 22,
      carbonSaved: 1.5,
      distance: 12.5,
      passengers: 3,
      availability: 2,
    },
    {
      id: '2',
      mode: 'Public Transit',
      icon: 'transit',
      color: '#4ECDC4',
      cost: 20,
      duration: 28,
      carbonSaved: 0.625,
      distance: 12.5,
      availability: 8,
    },
    {
      id: '3',
      mode: 'Bike',
      icon: 'bike-2',
      color: '#95E1D3',
      cost: 0,
      duration: 35,
      carbonSaved: 3.125,
      distance: 12.5,
      availability: 1,
    },
    {
      id: '4',
      mode: 'Walk',
      icon: 'activity',
      color: '#06D6A0',
      cost: 0,
      duration: 150,
      carbonSaved: 3.125,
      distance: 12.5,
      availability: 1,
    },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setSelectedOption('1'); // Default Carpool
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <MaterialIcons name="groups" size={24} color="white" />;
      case 'transit':
        return <MaterialIcons name="directions-bus" size={24} color="white" />;
      case 'bike-2':
        return <MaterialIcons name="two-wheeler" size={24} color="white" />;
      case 'activity':
        return <Feather name="activity" size={24} color="white" />;
      default:
        return <Feather name="smile" size={24} color="white" />;
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
      <StatusBar barStyle="dark-content" backgroundColor="#E8F8F5" />

      <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#0D5F4F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Options</Text>
          <TouchableOpacity onPress={() => setShowDirections(!showDirections)}>
            <Feather name={showDirections ? 'map' : 'list'} size={24} color="#0D5F4F" />
          </TouchableOpacity>
        </View>

        {/* Beautiful Map Container - No WebView */}
        <LinearGradient
          colors={['#E8F8F5', '#D4F1EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mapContainer}
        >
          <View style={styles.mapContent}>
            {/* Route Visualization */}
            <View style={styles.routeVisualization}>
              {/* Start Point */}
              <View style={styles.locationPoint}>
                <View style={[styles.locationMarker, styles.startMarker]}>
                  <Feather name="map-pin" size={20} color="white" />
                </View>
                <Text style={styles.locationName} numberOfLines={2}>{from}</Text>
              </View>

              {/* Route Line with Icons */}
              <View style={styles.routeLineContainer}>
                <View style={styles.routeLine} />
                <View style={styles.routeIconContainer}>
                  <View style={styles.routeIcon}>
                    <Feather name="navigation-2" size={16} color="#1ABC9C" />
                  </View>
                </View>
              </View>

              {/* End Point */}
              <View style={styles.locationPoint}>
                <View style={[styles.locationMarker, styles.endMarker]}>
                  <Feather name="flag" size={20} color="white" />
                </View>
                <Text style={styles.locationName} numberOfLines={2}>{to}</Text>
              </View>
            </View>

            {/* Distance Info */}
            <View style={styles.distanceCard}>
              <Feather name="navigation" size={20} color="white" />
              <View style={styles.distanceInfo}>
                <Text style={styles.distanceLabel}>Total Distance</Text>
                <Text style={styles.distanceValue}>{distance.toFixed(1)} km</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Route Info Badge */}
        <View style={styles.routeInfo}>
          <Feather name="navigation" size={18} color="#1ABC9C" />
          <View style={{ flex: 1 }}>
            <Text style={styles.routeText} numberOfLines={1}>
              {from} → {to}
            </Text>
          </View>
          <Text style={styles.distanceBadgeText}>{distance.toFixed(1)} km</Text>
        </View>

        {/* Trip Options or Directions */}
        <ScrollView
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.optionsContent}
        >
          {!showDirections ? (
            <>
              <Text style={styles.optionsTitle}>Choose Your Transport</Text>

              {tripOptions.length > 0 ? (
                tripOptions.map((option) => {
                  const isSelected = selectedOption === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() => setSelectedOption(option.id)}
                    >
                      <View style={styles.optionHeader}>
                        <View style={styles.optionTitleSection}>
                          <View style={[styles.optionIconBg, { backgroundColor: option.color }]}>
                            {getIconComponent(option.icon)}
                          </View>
                          <View style={styles.optionTitleText}>
                            <Text style={styles.optionMode}>{option.mode}</Text>
                            <Text style={styles.optionDuration}>~{option.duration} min</Text>
                          </View>
                        </View>
                        <View style={styles.optionPriceSection}>
                          <Text style={styles.optionPrice}>₹{option.cost}</Text>
                          {option.cost === 0 && <Text style={styles.freeTag}>FREE</Text>}
                        </View>
                      </View>

                      <View style={styles.optionDetails}>
                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            <Ionicons name="leaf" size={16} color="#06D6A0" />
                          </View>
                          <View style={styles.detailText}>
                            <Text style={styles.detailLabel}>Carbon Saved</Text>
                            <Text style={styles.detailValue}>
                              {option.carbonSaved} kg CO₂
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            <Feather name="clock" size={16} color="#1ABC9C" />
                          </View>
                          <View style={styles.detailText}>
                            <Text style={styles.detailLabel}>Duration</Text>
                            <Text style={styles.detailValue}>
                              {option.duration} min
                            </Text>
                          </View>
                        </View>

                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            {option.mode === 'Carpool' ? (
                              <Feather name="users" size={16} color="#FF6B6B" />
                            ) : (
                              <Feather name="check-circle" size={16} color="#1ABC9C" />
                            )}
                          </View>
                          <View style={styles.detailText}>
                            <Text style={styles.detailLabel}>
                              {option.mode === 'Carpool'
                                ? 'Available Seats'
                                : 'Availability'}
                            </Text>
                            <Text style={styles.detailValue}>
                              {option.availability} {option.mode === 'Carpool' ? 'seats' : 'options'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {isSelected && (
                        <View style={styles.selectionIndicator}>
                          <Feather name="check" size={20} color={option.color} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.noOptions}>Loading options...</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.optionsTitle}>Trip Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>From</Text>
                  <Text style={styles.summaryValue}>{from}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>To</Text>
                  <Text style={styles.summaryValue}>{to}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Distance</Text>
                  <Text style={styles.summaryValue}>{distance.toFixed(1)} km</Text>
                </View>
              </View>
            </>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Confirm Button */}
        {selectedTripData && !showDirections && (
          <View style={styles.bottomButton}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmTrip}
            >
              <LinearGradient
                colors={['#1ABC9C', '#06D6A0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.confirmButtonText}>
                  Book {selectedTripData.mode}
                </Text>
                <Text style={styles.confirmButtonSubtext}>
                  ₹{selectedTripData.cost}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F8F5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D5F4F',
  },
  mapContainer: {
    height: height * 0.35,
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mapContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeVisualization: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationPoint: {
    alignItems: 'center',
    marginVertical: 8,
  },
  locationMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startMarker: {
    backgroundColor: '#06D6A0',
  },
  endMarker: {
    backgroundColor: '#FF6B6B',
  },
  locationName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D5F4F',
    textAlign: 'center',
    maxWidth: 100,
  },
  routeLineContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  routeLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#1ABC9C',
    borderRadius: 1,
  },
  routeIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1ABC9C',
  },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  distanceInfo: {
    flex: 1,
  },
  distanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A085',
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1ABC9C',
    marginTop: 2,
  },
  routeInfo: {
    marginHorizontal: 16,
    marginTop: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D5F4F',
  },
  distanceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1ABC9C',
    backgroundColor: 'rgba(26, 188, 156, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionsContainer: {
    flex: 1,
    backgroundColor: '#E8F8F5',
  },
  optionsContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D5F4F',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(26, 188, 156, 0.15)',
    position: 'relative',
  },
  optionCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#1ABC9C',
    borderWidth: 2.5,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitleText: {
    flex: 1,
  },
  optionMode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D5F4F',
  },
  optionDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16A085',
    marginTop: 2,
  },
  optionPriceSection: {
    alignItems: 'flex-end',
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1ABC9C',
  },
  freeTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#06D6A0',
    backgroundColor: 'rgba(6, 214, 160, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  optionDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'rgba(26, 188, 156, 0.05)',
    borderRadius: 8,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(26, 188, 156, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A085',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D5F4F',
    marginTop: 2,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(26, 188, 156, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOptions: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16A085',
    textAlign: 'center',
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 188, 156, 0.1)',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A085',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D5F4F',
  },
  bottomButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: '#E8F8F5',
    borderTopWidth: 1,
    borderTopColor: 'rgba(26, 188, 156, 0.1)',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  confirmButtonSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
