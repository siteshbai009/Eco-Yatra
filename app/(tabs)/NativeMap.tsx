import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function NativeMapScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mapRef = useRef<MapView>(null);

    const [region] = useState({
        latitude: 20.2961,
        longitude: 85.8245,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const fromLat = parseFloat(params.fromLat as string) || 20.2961;
    const fromLon = parseFloat(params.fromLon as string) || 85.8245;
    const toLat = parseFloat(params.toLat as string) || 20.3561;
    const toLon = parseFloat(params.toLon as string) || 85.8845;

    // Using state for real routing data
    const [routeCoords, setRouteCoords] = useState<{latitude: number, longitude: number}[]>([
        { latitude: fromLat, longitude: fromLon },
        { latitude: toLat, longitude: toLon }
    ]);
    const [routeDistance, setRouteDistance] = useState("0");
    const [routeTime, setRouteTime] = useState("");

    useEffect(() => {
        const fetchRealRoute = async () => {
            try {
                // Use open source OSRM for routing
                const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();
                
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const coordsList = route.geometry.coordinates.map((c: any) => ({
                        latitude: c[1],
                        longitude: c[0]
                    }));
                    setRouteCoords([
                        { latitude: fromLat, longitude: fromLon },
                        ...coordsList,
                        { latitude: toLat, longitude: toLon }
                    ]);
                    
                    const dKm = (route.distance / 1000).toFixed(1);
                    setRouteDistance(dKm);
                    
                    const tMins = Math.round(route.duration / 60);
                    const tStr = tMins >= 60 ? `${Math.floor(tMins/60)}h ${tMins%60}m` : `${tMins} min`;
                    setRouteTime(tStr);

                    if (mapRef.current) {
                        mapRef.current.fitToCoordinates(coordsList, {
                            edgePadding: { top: 120, right: 60, bottom: 250, left: 60 },
                            animated: true,
                        });
                    }
                }
            } catch (err) {
                console.warn('Could not fetch real route', err);
                if (mapRef.current) {
                    mapRef.current.fitToCoordinates(
                        [ { latitude: fromLat, longitude: fromLon }, { latitude: toLat, longitude: toLon } ],
                        { edgePadding: { top: 120, right: 60, bottom: 250, left: 60 }, animated: true }
                    );
                }
            }
        };

        fetchRealRoute();
    }, [fromLat, fromLon, toLat, toLon]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                customMapStyle={mapStyle}
            >
                <Marker coordinate={{ latitude: fromLat, longitude: fromLon }}>
                    <View style={styles.markerBubble}>
                        <View style={[styles.markerInner, { backgroundColor: '#111827' }]}>
                             <Ionicons name="location" size={16} color="#FFFFFF" />
                        </View>
                        <View style={styles.markerTail} />
                    </View>
                </Marker>
                <Marker coordinate={{ latitude: toLat, longitude: toLon }}>
                    <View style={styles.markerBubble}>
                        <View style={[styles.markerInner, { backgroundColor: '#16A34A' }]}>
                             <Ionicons name="flag" size={16} color="#FFFFFF" />
                        </View>
                        <View style={[styles.markerTail, { borderTopColor: '#16A34A' }]} />
                    </View>
                </Marker>

                <Polyline
                    coordinates={routeCoords}
                    strokeColor="#16A34A"
                    strokeWidth={4}
                    geodesic={true}
                />
            </MapView>

            <SafeAreaView style={styles.headerSafe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
                        <Feather name="arrow-left" size={24} color="#111827" />
                    </TouchableOpacity>
                    <View style={styles.titleChip}>
                        <Text style={styles.headerTitle}>Route Preview</Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>
            </SafeAreaView>

            <View style={styles.bottomArea}>
                <View style={styles.card}>
                    <View style={styles.routeBox}>
                        <View style={styles.timeline}>
                            <View style={[styles.dot, { backgroundColor: '#111827' }]} />
                            <View style={styles.line} />
                            <View style={[styles.dot, { backgroundColor: '#16A34A' }]} />
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.locLabel}>START</Text>
                            <Text style={styles.locName} numberOfLines={1}>{params.from}</Text>
                            <View style={{ height: 18 }} />
                            <Text style={styles.locLabel}>DESTINATION</Text>
                            <Text style={styles.locName} numberOfLines={1}>{params.to}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Feather name="clock" size={18} color="#16A34A" />
                            <Text style={styles.statValue}>{routeTime || '--'}</Text>
                            <Text style={styles.statLabel}>Est. Time</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Feather name="map" size={18} color="#16A34A" />
                            <Text style={styles.statValue}>{routeDistance || '--'} km</Text>
                            <Text style={styles.statLabel}>Distance</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.ctaBtn}
                        onPress={() => router.push({ pathname: '/(tabs)/tripDetails', params: params })}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.ctaBtnText}>Compare Transport Options</Text>
                        <Feather name="chevron-right" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const mapStyle = [
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "off" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
    { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#E5E7EB" }] },
    { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#F9FAFB" }] },
    { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#FFFFFF" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#D1D5DB" }] },
    { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#FFFFFF" }] },
    { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#FFFFFF" }] }
];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    map: { width: '100%', height: '100%' },

    headerSafe: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16 },
    
    backBtn: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
    },

    titleChip: {
        backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
    },
    headerTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },

    markerBubble: { alignItems: 'center', justifyContent: 'center' },
    markerTail: {
        width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
        borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#111827',
        marginTop: -1,
    },
    markerInner: {
        width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#FFFFFF',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
    },

    bottomArea: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
    card: {
        backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20,
        borderWidth: 1, borderColor: '#E5E7EB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4,
    },

    routeBox: { flexDirection: 'row', marginBottom: 20, paddingHorizontal: 10 },
    timeline: { alignItems: 'center', width: 20, marginRight: 15 },
    dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#FFFFFF' },
    line: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
    infoCol: { flex: 1 },
    locLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', marginBottom: 2 },
    locName: { fontSize: 15, fontWeight: '700', color: '#111827' },

    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingVertical: 14,
        marginBottom: 20,
        marginHorizontal: 10,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#D1D5DB',
        marginVertical: 4,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginTop: 6,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 2,
    },

    ctaBtn: {
        backgroundColor: '#16A34A', paddingVertical: 18, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    ctaBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
