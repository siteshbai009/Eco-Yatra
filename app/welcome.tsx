import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700;

export default function WelcomeScreen() {
  const router = useRouter();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Infinite animation for rainbow effect
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      
      {/* Tech Background */}
      <View style={styles.background}>
        <View style={styles.gridLayer} />
        <View style={styles.orb1} />
        <View style={styles.orb2} />
        <View style={styles.orb3} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Logo Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <View style={styles.logoWrapper}>
              <Image 
                source={require('../assets/icon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>GIET</Text>
            <View style={styles.glowLine} />
            <Text style={styles.appSubname}>GRIEVANCE</Text>
          </View>
        </View>

        {/* Main Content - Empty spacer */}
        <View style={styles.mainContent} />

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.rainbowButtonContainer}>
            <Animated.View style={[styles.rainbowGradient, { transform: [{ translateX }] }]}>
              <LinearGradient
                colors={['#FF0080', '#7928CA', '#0070F3', '#00DFD8', '#7928CA', '#FF0080']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
            </Animated.View>
            
            <TouchableOpacity
              style={styles.rainbowButton}
              onPress={() => router.push('/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Team Credit */}
          <View style={styles.creditContainer}>
            <Text style={styles.creditText}>
              <Text style={styles.creditLabel}>{''} </Text>
              Designed & Developed by{' '}
              <Text style={styles.teamName}>TEAM NEXUS</Text>
              <Text style={styles.creditLabel}> {'💫'}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0A0E27',
  },
  gridLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    opacity: 0.1,
  },
  orb1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#1E6FD9',
    opacity: 0.15,
    top: -width * 0.5,
    right: -width * 0.3,
  },
  orb2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#00D9FF',
    opacity: 0.1,
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  orb3: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#6366F1',
    opacity: 0.12,
    top: height * 0.4,
    right: -width * 0.2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: isSmallDevice ? 30 : 50,
    paddingBottom: isSmallDevice ? 20 : 30,
    minHeight: height,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: isSmallDevice ? 20 : 30,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: isSmallDevice ? 24 : 32,
  },
  logoGlow: {
    position: 'absolute',
    width: isSmallDevice ? 110 : 130,
    height: isSmallDevice ? 110 : 130,
    borderRadius: isSmallDevice ? 28 : 35,
    backgroundColor: '#00D9FF',
    opacity: 0.2,
    top: -8,
    left: -8,
  },
  logoWrapper: {
    width: isSmallDevice ? 95 : 115,
    height: isSmallDevice ? 95 : 115,
    backgroundColor: '#151B3D',
    borderRadius: isSmallDevice ? 24 : 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D9FF',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    width: isSmallDevice ? 60 : 75,
    height: isSmallDevice ? 60 : 75,
  },
  titleContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: isSmallDevice ? 38 : 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  glowLine: {
    width: 60,
    height: 3,
    backgroundColor: '#00D9FF',
    marginVertical: 8,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  appSubname: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    color: '#00D9FF',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  ctaSection: {
    alignItems: 'center',
    marginTop: isSmallDevice ? 20 : 30,
  },
  rainbowButtonContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 30,
    padding: 3,
  },
  rainbowGradient: {
    position: 'absolute',
    width: width * 2,
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  rainbowButton: {
    flexDirection: 'row',
    backgroundColor: '#0A0E27',
    paddingVertical: isSmallDevice ? 16 : 18,
    paddingHorizontal: isSmallDevice ? 36 : 44,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minWidth: width * 0.3,
  },
  buttonText: {
    fontSize: isSmallDevice ? 17 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  creditContainer: {
    marginTop: isSmallDevice ? 24 : 28,
    alignItems: 'center',
  },
  creditText: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#6B7AA1',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  creditLabel: {
    color: '#00D9FF',
    fontWeight: '700',
  },
  teamName: {
    fontWeight: '700',
    color: '#00FF9D',
    letterSpacing: 1,
  },
});