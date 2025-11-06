import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path } from 'react-native-svg';
import { UserProvider } from '../../UserContext';

const BAR_HEIGHT = 80;

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const filteredRoutes = state.routes.filter((route: any) => route.name !== 'profile');

  const handlePress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
  };

  return (
    <View pointerEvents="box-none" style={[styles.root, { paddingBottom: Math.max(insets.bottom, 0) }]}>
      
      {/* Background gradient */}
      <LinearGradient
        pointerEvents="none"
        colors={['#0EA5E9', '#93C5FD', '#A7F3D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Glass Morph Bar with BIGGER Center Notch */}
      <View style={[styles.barWrapper, { height: BAR_HEIGHT + Math.max(insets.bottom, 0) }]}>
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <Svg width="100%" height="100%" viewBox="0 0 400 80" preserveAspectRatio="none">
              <Path
  d={`
    M0,0
    H105
    C135,0 165,42 200,42
    C235,42 265,0 295,0
    H400
    V80
    H0
    Z
  `}
  fill="#fff"
/>


            </Svg>
          }
        >
          <BlurView
            intensity={100}
            tint="light"
            style={styles.glass}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          >
            <LinearGradient
              colors={[
                'rgba(14,165,233,0.35)',
                'rgba(255,255,255,0.15)',
                'rgba(14,165,233,0.25)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </BlurView>
        </MaskedView>

        {/* Tabs Row */}
        <View style={[styles.row, { justifyContent: 'space-evenly' }]}>
          {filteredRoutes.map((route: any) => {
            const actualIndex = state.routes.findIndex((r: any) => r.name === route.name);
            const isFocused = state.index === actualIndex;

            let icon: keyof typeof Feather.glyphMap = 'home';
            let label = 'Home';
            if (route.name === 'index') icon = 'home';
            if (route.name === 'submit') { icon = 'edit'; label = ''; }
            if (route.name === 'track') { icon = 'search'; label = 'Track'; }

            if (route.name === 'submit') return <View key={route.key} style={styles.centerSpacer} />;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => handlePress(route, isFocused)}
                activeOpacity={0.8}
                style={styles.tab}
              >
                <Feather name={icon} size={24} color={isFocused ? '#0EA5E9' : '#94A3B8'} />
                <Text style={[styles.tabLabel, { color: isFocused ? '#0EA5E9' : '#64748B' }]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating Center Button */}
      {(() => {
        const submitRoute = state.routes.find((r: any) => r.name === 'submit');
        const isFocused = state.index === state.routes.findIndex((r: any) => r.name === 'submit');
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: submitRoute.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) navigation.navigate('submit');
        };

        return (
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.95}
            style={[styles.fab, { bottom: (BAR_HEIGHT + Math.max(insets.bottom, 0)) - 38 }]}
          >
            <LinearGradient
              colors={isFocused ? ['#0EA5E9', '#38BDF8'] : ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabCircle}
            >
              <Feather name="edit" size={28} color={isFocused ? '#FFFFFF' : '#0EA5E9'} />
            </LinearGradient>
          </TouchableOpacity>
        );
      })()}
    </View>
  );
}

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="submit" options={{ title: 'Submit' }} />
        <Tabs.Screen name="track" options={{ title: 'Track' }} />
        <Tabs.Screen name="profile" options={{ href: null, title: 'Profile' }} />
      </Tabs>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  barWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  glass: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderColor: 'rgba(14,165,233,0.25)',
    backgroundColor: 'rgba(14,165,233,0.08)',
  },
  row: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  centerSpacer: {
    width: 72,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 20,
  },
  fabCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(14,165,233,0.4)',
    backgroundColor: 'rgba(14,165,233,0.18)',
  },
});
