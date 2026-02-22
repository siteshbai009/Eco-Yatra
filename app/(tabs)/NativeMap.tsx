import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function NativeMapScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mapRef = useRef<MapView>(null);

    const [region, setRegion] = useState({
        latitude: 20.2961, // Default to Bhubaneswar
        longitude: 85.8245,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const fromLat = parseFloat(params.fromLat as string) || 20.2961;
    const fromLon = parseFloat(params.fromLon as string) || 85.8245;
    const toLat = parseFloat(params.toLat as string) || 20.3561;
    const toLon = parseFloat(params.toLon as string) || 85.8845;

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.fitToCoordinates(
                [
                    { latitude: fromLat, longitude: fromLon },
                    { latitude: toLat, longitude: toLon },
                ],
                {
                    edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                    animated: true,
                }
            );
        }
    }, [fromLat, fromLon, toLat, toLon]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={24} color="#0D5F4F" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Route Preview</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                >
                    <Marker
                        coordinate={{ latitude: fromLat, longitude: fromLon }}
                        title="Start"
                        description={params.from as string}
                        pinColor="#06D6A0"
                    />
                    <Marker
                        coordinate={{ latitude: toLat, longitude: toLon }}
                        title="Destination"
                        description={params.to as string}
                        pinColor="#FF6B6B"
                    />

                    <Polyline
                        coordinates={[
                            { latitude: fromLat, longitude: fromLon },
                            { latitude: toLat, longitude: toLon },
                        ]}
                        strokeColor="#1ABC9C"
                        strokeWidth={4}
                        lineDashPattern={[1]}
                    />
                </MapView>

                {/* Bottom Card */}
                <View style={styles.bottomCard}>
                    <View style={styles.routeInfo}>
                        <View style={styles.locationRow}>
                            <Feather name="circle" size={16} color="#06D6A0" />
                            <Text style={styles.locationText} numberOfLines={1}>{params.from}</Text>
                        </View>
                        <View style={styles.connectorLine} />
                        <View style={styles.locationRow}>
                            <Feather name="map-pin" size={16} color="#FF6B6B" />
                            <Text style={styles.locationText} numberOfLines={1}>{params.to}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => router.push({
                            pathname: '/(tabs)/tripDetails',
                            params: params
                        })}
                    >
                        <Text style={styles.continueButtonText}>See Transport Options</Text>
                        <Feather name="arrow-right" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0D5F4F',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    bottomCard: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    routeInfo: {
        marginBottom: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0D5F4F',
        flex: 1,
    },
    connectorLine: {
        width: 2,
        height: 20,
        backgroundColor: '#E0E0E0',
        marginLeft: 7,
        marginVertical: 4,
    },
    continueButton: {
        backgroundColor: '#1ABC9C',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
