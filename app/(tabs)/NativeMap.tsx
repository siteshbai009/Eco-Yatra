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
    View
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

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.fitToCoordinates(
                [
                    { latitude: fromLat, longitude: fromLon },
                    { latitude: toLat, longitude: toLon },
                ],
                {
                    edgePadding: { top: 120, right: 60, bottom: 250, left: 60 },
                    animated: true,
                }
            );
        }
    }, [fromLat, fromLon, toLat, toLon]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent />

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                customMapStyle={mapStyle}
            >
                <Marker coordinate={{ latitude: fromLat, longitude: fromLon }}>
                    <View style={styles.markerBubble}>
                        <View style={styles.markerShadow} />
                        <View style={[styles.markerInner, { backgroundColor: '#3DBF87' }]}>
                             <Ionicons name="location" size={18} color="#FFF" />
                        </View>
                    </View>
                </Marker>
                <Marker coordinate={{ latitude: toLat, longitude: toLon }}>
                    <View style={styles.markerBubble}>
                        <View style={styles.markerShadow} />
                        <View style={[styles.markerInner, { backgroundColor: '#FF7B8A' }]}>
                             <Ionicons name="flag" size={18} color="#FFF" />
                        </View>
                    </View>
                </Marker>

                <Polyline
                    coordinates={[{ latitude: fromLat, longitude: fromLon }, { latitude: toLat, longitude: toLon }]}
                    strokeColor="#3DBF87"
                    strokeWidth={5}
                />
            </MapView>

            {/* Clay Floating Header */}
            <SafeAreaView style={styles.headerSafe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <View style={styles.backBtnWrap}>
                            <View style={styles.backBtnShadow} />
                            <View style={styles.backBtn}>
                                <Feather name="arrow-left" size={24} color="#2D8A5F" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleChipWrap}>
                        <View style={styles.titleChipShadow} />
                        <View style={styles.titleChip}>
                            <Text style={styles.headerTitle}>Route Preview</Text>
                        </View>
                    </View>
                    <View style={{ width: 44 }} />
                </View>
            </SafeAreaView>

            {/* Clay Bottom Card */}
            <View style={styles.bottomArea}>
                <View style={styles.cardWrap}>
                    <View style={styles.cardShadow} />
                    <View style={styles.card}>
                        <View style={styles.cardHighlight} />
                        
                        <View style={styles.routeBox}>
                            <View style={styles.timeline}>
                                <View style={[styles.dot, { backgroundColor: '#3DBF87' }]} />
                                <View style={styles.line} />
                                <View style={[styles.dot, { backgroundColor: '#FF7B8A' }]} />
                            </View>
                            <View style={styles.infoCol}>
                                <Text style={styles.locLabel}>START</Text>
                                <Text style={styles.locName} numberOfLines={1}>{params.from}</Text>
                                <View style={{ height: 18 }} />
                                <Text style={styles.locLabel}>DESTINATION</Text>
                                <Text style={styles.locName} numberOfLines={1}>{params.to}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.ctaBtnWrap}
                            onPress={() => router.push({ pathname: '/(tabs)/tripDetails', params: params })}
                        >
                            <View style={styles.ctaBtnShadow} />
                            <View style={styles.ctaBtn}>
                                <View style={styles.ctaBtnHighlight} />
                                <Text style={styles.ctaBtnText}>Compare Transport Options 🌿</Text>
                                <Feather name="chevron-right" size={20} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const mapStyle = [
    { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#6B9A80" }] },
    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f9f5" }] },
    { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#e8f4ff" }, { "visibility": "on" }] }
];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E8F4FF' },
    map: { width: '100%', height: '100%' },

    headerSafe: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
    
    backBtnWrap: { position: 'relative' },
    backBtnShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#A8E6CF', borderRadius: 16, opacity: 0.6 },
    backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#A8E6CF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },

    titleChipWrap: { position: 'relative' },
    titleChipShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#A8D8FF', borderRadius: 20, opacity: 0.6 },
    titleChip: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, shadowColor: '#A8D8FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    headerTitle: { fontSize: 16, fontWeight: '900', color: '#2D8A5F' },

    markerBubble: { alignItems: 'center', justifyContent: 'center' },
    markerShadow: { position: 'absolute', top: 3, left: 3, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.1)' },
    markerInner: { width: 34, height: 34, borderRadius: 17, borderWeight: 2, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },

    bottomArea: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
    cardWrap: { position: 'relative' },
    cardShadow: { position: 'absolute', top: 10, left: 10, right: -10, bottom: -10, backgroundColor: '#A8E6CF', borderRadius: 32, opacity: 0.5 },
    card: { backgroundColor: '#FFF', borderRadius: 32, padding: 20, shadowColor: '#A8E6CF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10, overflow: 'hidden' },
    cardHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 50, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32 },

    routeBox: { flexDirection: 'row', marginBottom: 20, paddingHorizontal: 10 },
    timeline: { alignItems: 'center', width: 20, marginRight: 15 },
    dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#FFF' },
    line: { width: 3, flex: 1, backgroundColor: '#F0FAFF', marginVertical: 4, borderRadius: 2 },
    infoCol: { flex: 1 },
    locLabel: { fontSize: 9, fontWeight: '800', color: '#8AB8A0', marginBottom: 2 },
    locName: { fontSize: 14, fontWeight: '900', color: '#2D4A30' },

    ctaBtnWrap: { position: 'relative' },
    ctaBtnShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#6BCBA5', borderRadius: 20, opacity: 0.6 },
    ctaBtn: { backgroundColor: '#3DBF87', paddingVertical: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, overflow: 'hidden' },
    ctaBtnHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 26, backgroundColor: 'rgba(255,255,255,0.3)', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    ctaBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
