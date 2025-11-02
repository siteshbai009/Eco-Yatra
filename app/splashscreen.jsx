// app/SplashScreen.js
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700;

export default function SplashScreen() {
  const router = useRouter();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const orbAnimation = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence matching your welcome screen style
    const animationSequence = Animated.sequence([
      // Background orbs fade in
      Animated.timing(orbAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      
      // Logo entrance with glow
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Text entrance with glow line
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(lineWidth, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    ]);

    // Start continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    animationSequence.start();

    // Navigate to welcome screen
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Animation interpolations
  const glowScale = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const lineWidthInterpolated = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      
      {/* Tech Background - Same as welcome */}
      <View style={styles.background}>
        <View style={styles.gridLayer} />
        
        {/* Animated Orbs */}
        <Animated.View 
          style={[
            styles.orb1,
            {
              opacity: orbAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
              transform: [
                {
                  scale: orbAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]} 
        />
        <Animated.View 
          style={[
            styles.orb2,
            {
              opacity: orbAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
              transform: [
                {
                  scale: orbAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ],
            },
          ]} 
        />
        <Animated.View 
          style={[
            styles.orb3,
            {
              opacity: orbAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.12],
              }),
              transform: [
                {
                  scale: orbAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
            },
          ]} 
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section - Matching welcome screen */}
        <View style={styles.logoContainer}>
          {/* Animated Glow */}
          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />
          
          {/* Logo Wrapper */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { scale: pulseScale },
                ],
              },
            ]}
          >
            <Image
              source={require("../assets/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Title Section - Matching welcome screen */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.appName}>GIET</Text>
          
          {/* Animated Glow Line */}
          <Animated.View
            style={[
              styles.glowLine,
              {
                width: lineWidthInterpolated,
              },
            ]}
          />
          
          <Text style={styles.appSubname}>GRIEVANCE</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: textOpacity,
            },
          ]}
        >
          <View style={styles.loadingDots}>
            <Animated.View 
              style={[
                styles.dot,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 0.3, 0.6, 1],
                    outputRange: [0.3, 1, 0.3, 0.3],
                  }),
                },
              ]} 
            />
            <Animated.View 
              style={[
                styles.dot,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 0.3, 0.6, 1],
                    outputRange: [0.3, 0.3, 1, 0.3],
                  }),
                },
              ]} 
            />
            <Animated.View 
              style={[
                styles.dot,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 0.3, 0.6, 1],
                    outputRange: [0.3, 0.3, 0.3, 1],
                  }),
                },
              ]} 
            />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27', // Same as welcome screen
  },
  
  // Same background as welcome screen
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
  
  // Same orbs as welcome screen
  orb1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#1E6FD9',
    top: -width * 0.5,
    right: -width * 0.3,
  },
  orb2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#00D9FF',
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  orb3: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#6366F1',
    top: height * 0.4,
    right: -width * 0.2,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },

  // Same logo styling as welcome screen
  logoContainer: {
    position: 'relative',
    marginBottom: isSmallDevice ? 40 : 50,
  },
  logoGlow: {
    position: 'absolute',
    width: isSmallDevice ? 130 : 150,
    height: isSmallDevice ? 130 : 150,
    borderRadius: isSmallDevice ? 33 : 40,
    backgroundColor: '#00D9FF',
    top: -10,
    left: -10,
  },
  logoWrapper: {
    width: isSmallDevice ? 110 : 130,
    height: isSmallDevice ? 110 : 130,
    backgroundColor: '#151B3D',
    borderRadius: isSmallDevice ? 28 : 35,
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
    width: isSmallDevice ? 70 : 85,
    height: isSmallDevice ? 70 : 85,
  },

  // Same title styling as welcome screen
  titleContainer: {
    alignItems: 'center',
    marginBottom: isSmallDevice ? 60 : 70,
  },
  appName: {
    fontSize: isSmallDevice ? 44 : 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
    textShadowColor: '#00D9FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  glowLine: {
    height: 3,
    backgroundColor: '#00D9FF',
    marginVertical: 8,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  appSubname: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
    color: '#00D9FF',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },

  // Loading indicator
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00D9FF',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#6B7AA1',
    letterSpacing: 1,
    fontWeight: '500',
    fontFamily: 'monospace',
  },
});
