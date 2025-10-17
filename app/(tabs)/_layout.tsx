import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { UserProvider } from '../../UserContext';

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#6366F1',
          tabBarInactiveTintColor: '#94A3B8',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopColor: '#F1F5F9',
            paddingBottom: Platform.OS === 'ios' ? 20 : 5,
            height: Platform.OS === 'ios' ? 85 : 60,
          },
        }}>
        
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Feather name="home" size={24} color={focused ? '#6366F1' : color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="submit"
          options={{
            title: 'Submit',
            tabBarIcon: ({ color, focused }) => (
              <Feather name="plus-circle" size={24} color={focused ? '#6366F1' : color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="track"
          options={{
            title: 'Track',
            tabBarIcon: ({ color, focused }) => (
              <Feather name="search" size={24} color={focused ? '#6366F1' : color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Feather name="user" size={24} color={focused ? '#6366F1' : color} />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
