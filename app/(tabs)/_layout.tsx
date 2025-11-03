import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import { Platform, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { UserProvider } from '../../UserContext';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const filteredRoutes = state.routes.filter((route: any) => route.name !== 'profile');

  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={['rgba(255,255,255,0.7)', 'rgba(240,249,255,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tabBar}
      >
        {filteredRoutes.map((route: any) => {
          const { options } = descriptors[route.key];
          const actualIndex = state.routes.findIndex((r: any) => r.name === route.name);
          const isFocused = state.index === actualIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Feather.glyphMap = 'home';
          let label = 'Home';
          if (route.name === 'index') iconName = 'home';
          if (route.name === 'submit') { iconName = 'edit'; label = ''; }
          if (route.name === 'track') { iconName = 'search'; label = 'Track'; }

          // Center (Submit) button
          if (route.name === 'submit') {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.centerButtonContainer}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    styles.outerCircle,
                    {
                      backgroundColor: isFocused ? '#0EA5E9' : 'rgba(14,165,233,0.1)',
                      borderColor: '#0EA5E9',
                    },
                  ]}
                >
                  <Feather
                    name={iconName}
                    size={28}
                    color={isFocused ? '#FFFFFF' : '#0EA5E9'}
                    style={isFocused ? styles.glowEffect : undefined}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#0EA5E9' : '#64748B' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }

          // Regular tabs
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
      styles.regularTab,
      route.name === 'index' && { marginRight: 40 }, // push Home slightly left
      route.name === 'track' && { marginLeft: 40 },  // push Track slightly right
    ]}
            >
              <Feather
                name={iconName}
                size={24}
                color={isFocused ? '#0EA5E9' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#0EA5E9' : '#64748B' },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="submit" options={{ title: 'Submit' }} />
        <Tabs.Screen name="track" options={{ title: 'Track' }} />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
            title: 'Profile',
          }}
        />
      </Tabs>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 75,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 0,
  },
  regularTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  outerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  glowEffect: {
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
