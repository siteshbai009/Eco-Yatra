  import { LinearGradient } from 'expo-linear-gradient';
  import { useRouter } from 'expo-router';
  import React, { useEffect, useRef, useState } from 'react';
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
  const isTinyDevice = height < 600;

  export default function WelcomeScreen() {
    const router = useRouter();
    const [isPressed, setIsPressed] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Continuous subtle glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, []);

    const handlePressIn = () => {
      setIsPressed(true);
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      setIsPressed(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    const borderColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(99, 102, 241, 0.7)', 'rgba(139, 92, 246, 0.85)'],
    });

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Tech Background */}
          <View style={styles.background}>
            <View style={styles.gridLayer} />
            <View style={styles.orb1} />
            <View style={styles.orb2} />
            <View style={styles.orb3} />
          </View>

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

          {/* Main Content - Spacer */}
          <View style={styles.mainContent} />

          {/* CTA Section with Enhanced Glow Button */}
          <View style={styles.ctaSection}>
            <Animated.View
              style={[
                styles.buttonContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <TouchableOpacity
                onPress={() => router.push('/login')}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
              >
                {/* Outer Glow Layer - Large Purple Glow */}
                {isPressed && (
                  <View style={styles.outerGlowLayer} />
                )}
                
                {/* Middle Glow Layer - Medium Purple Glow */}
                {isPressed && (
                  <View style={styles.middleGlowLayer} />
                )}

                <Animated.View
                  style={[
                    styles.glowBorder,
                    {
                      borderColor: isPressed ? '#A855F7' : borderColor,
                      borderRadius: isPressed ? 40 : 30,
                      shadowColor: isPressed ? '#A855F7' : '#6366F1',
                      shadowOpacity: isPressed ? 1 : 0.5,
                      shadowRadius: isPressed ? 30 : 15,
                    },
                  ]}
                >
                  <View style={[styles.buttonInner, { borderRadius: isPressed ? 37 : 27 }]}>
                    <Text style={styles.buttonText}>Get Started</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            {/* Team Credit */}
            <View style={styles.creditContainer}>
              <Text style={styles.creditText}>
                Designed & Developed by{' '}
                <Text style={styles.teamName}>TEAM NEXUS</Text> 💫
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
      paddingTop: isTinyDevice ? 20 : isSmallDevice ? 30 : 50,
      paddingBottom: isTinyDevice ? 15 : isSmallDevice ? 20 : 30,
      minHeight: height,
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'center',
      marginTop: isTinyDevice ? 10 : isSmallDevice ? 20 : 30,
    },
    logoContainer: {
      position: 'relative',
      marginBottom: isTinyDevice ? 18 : isSmallDevice ? 24 : 32,
    },
    logoGlow: {
      position: 'absolute',
      width: isTinyDevice ? 90 : isSmallDevice ? 110 : 130,
      height: isTinyDevice ? 90 : isSmallDevice ? 110 : 130,
      borderRadius: isTinyDevice ? 22 : isSmallDevice ? 28 : 35,
      backgroundColor: '#00D9FF',
      opacity: 0.2,
      top: -8,
      left: -8,
    },
    logoWrapper: {
      width: isTinyDevice ? 75 : isSmallDevice ? 95 : 115,
      height: isTinyDevice ? 75 : isSmallDevice ? 95 : 115,
      backgroundColor: '#151B3D',
      borderRadius: isTinyDevice ? 18 : isSmallDevice ? 24 : 30,
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
      width: isTinyDevice ? 50 : isSmallDevice ? 60 : 75,
      height: isTinyDevice ? 50 : isSmallDevice ? 60 : 75,
    },
    titleContainer: {
      alignItems: 'center',
    },
    appName: {
      fontSize: isTinyDevice ? 32 : isSmallDevice ? 38 : 44,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: 4,
      textTransform: 'uppercase',
      marginBottom: isTinyDevice ? 6 : 8,
    },
    glowLine: {
      width: isTinyDevice ? 50 : 60,
      height: 3,
      backgroundColor: '#00D9FF',
      marginVertical: isTinyDevice ? 6 : 8,
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    appSubname: {
      fontSize: isTinyDevice ? 14 : isSmallDevice ? 16 : 18,
      fontWeight: '600',
      color: '#00D9FF',
      letterSpacing: isTinyDevice ? 4 : 6,
      textTransform: 'uppercase',
    },
    mainContent: {
      flex: 1,
      justifyContent: 'center',
      minHeight: isTinyDevice ? 50 : 80,
    },
    ctaSection: {
      alignItems: 'center',
      marginTop: isTinyDevice ? 15 : isSmallDevice ? 20 : 30,
    },
    buttonContainer: {
      alignItems: 'center',
      position: 'relative',
    },
    // Triple layer glow effect - largest
    outerGlowLayer: {
      position: 'absolute',
      width: width * 0.68,
      height: isTinyDevice ? 58 : isSmallDevice ? 62 : 66,
      borderRadius: 45,
      backgroundColor: '#A855F7',
      opacity: 0.15,
      top: -8,
      left: '50%',
      marginLeft: -width * 0.34,
    },
    // Middle glow layer
    middleGlowLayer: {
      position: 'absolute',
      width: width * 0.58,
      height: isTinyDevice ? 54 : isSmallDevice ? 58 : 62,
      borderRadius: 42,
      backgroundColor: '#A855F7',
      opacity: 0.25,
      top: -4,
      left: '50%',
      marginLeft: -width * 0.29,
    },
    glowBorder: {
      borderWidth: 3,
      padding: 2,
      shadowOffset: { width: 0, height: 0 },
      elevation: 20,
    },
    buttonInner: {
      flexDirection: 'row',
      backgroundColor: '#0A0E27',
      paddingVertical: isTinyDevice ? 14 : isSmallDevice ? 16 : 18,
      paddingHorizontal: isTinyDevice ? 32 : isSmallDevice ? 40 : 48,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      minWidth: width * 0.5,
    },
    buttonText: {
      fontSize: isTinyDevice ? 16 : isSmallDevice ? 17 : 18,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 1,
    },
    creditContainer: {
      marginTop: isTinyDevice ? 18 : isSmallDevice ? 24 : 28,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    creditText: {
      fontSize: isTinyDevice ? 9 : isSmallDevice ? 10 : 11,
      color: '#6B7AA1',
      textAlign: 'center',
      fontWeight: '500',
      fontFamily: 'monospace',
    },
    teamName: {
      fontWeight: '700',
      color: '#00FF9D',
      letterSpacing: 1,
    },
  });
