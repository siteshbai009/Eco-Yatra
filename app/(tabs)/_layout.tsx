import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3DBF87',
        tabBarInactiveTintColor: '#B0C8B8',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F0FAFF' }]} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Feather name="home" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Feather name="clock" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Ranks',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons name="trophy" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Feather name="user" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen name="tripDetails" options={{ href: null, title: 'Trip Details', headerShown: false }} />
      <Tabs.Screen name="NativeMap" options={{ href: null, title: 'Native Map', headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    height: 74,
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#A8D8FF',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  iconWrap: {
    width: 46,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(61, 191, 135, 0.15)',
    shadowColor: '#3DBF87',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
