import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700;

// Authorized users - All CSE Department + Admin
const AUTHORIZED_USERS = [
  {
    email: 'swarnapravaparida2004@gmail.com',
    password: 'Swarnaprava@123',
    name: 'Swarnaprava Parida',
    department: 'Computer Science & Engineering (CSE)',
  },
  {
    email: 'bijayinipanda2004@gmail.com',
    password: 'Bijayini@123',
    name: 'Bijayini Panda',
    department: 'Computer Science & Engineering (CSE)',
  },
  {
    email: 'mousumiprabharout@gmail.com',
    password: 'Mousumi@123',
    name: 'Mousumi Prabha Rout',
    department: 'Computer Science & Engineering (CSE)',
  },
  {
    email: 'sranjan41509@gmail.com',
    password: 'Sr@123',
    name: 'Soumya Ranjan',
    department: 'Computer Science & Engineering (CSE)',
  },
  {
    email: 'siteshbai9975@gmail.com',
    password: 'Sitesh@123',
    name: 'Sitesh Bai',
    department: 'Computer Science & Engineering (CSE)',
  },
  // ADMIN ACCOUNT
  {
    email: 'admin@giet.edu.in',
    password: 'Admin@1234',
    name: 'GIET Administrator',
    department: 'Administration',
  },
];

export default function LoginScreen() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
  
  // New animations for tech theme
  const cardAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const orbAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const router = useRouter();

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.timing(orbAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ visible: true, message, type });
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      hideToast();
    }, 3000);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast({ visible: false, message: '', type: 'error' });
    });
  };

  const handleLogin = async () => {
    if (!registrationNumber || !password) {
      showToast('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const authorizedUser = AUTHORIZED_USERS.find(
        user => user.email.toLowerCase() === registrationNumber.toLowerCase().trim()
      );

      if (!authorizedUser) {
        showToast('Invalid registration number');
        setLoading(false);
        return;
      }

      if (authorizedUser.password !== password) {
        showToast('Invalid password');
        setLoading(false);
        return;
      }

      const isAdmin = authorizedUser.email.includes('admin@giet.edu.in');
      const userRole = isAdmin ? 'Administrator' : 'Student';
      const userData = {
        id: Date.now().toString(),
        name: authorizedUser.name,
        email: authorizedUser.email,
        role: userRole,
        department: authorizedUser.department,
        password: authorizedUser.password,
      };

      await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');
      showToast('Login successful!', 'success');
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } catch (error) {
      showToast('Login failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

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
              opacity: orbAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
              transform: [
                {
                  scale: orbAnim.interpolate({
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
              opacity: orbAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
            },
          ]} 
        />
        <Animated.View 
          style={[
            styles.orb3,
            {
              opacity: orbAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.12],
              }),
            },
          ]} 
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.logoGlow,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.5],
                  }),
                  transform: [
                    {
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                },
              ]}
            />
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
            <Text style={styles.appSubname}>LOGIN</Text>
          </View>
        </Animated.View>

        {/* Login Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
                {
                  scale: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your grievance portal</Text>

          {/* Registration Number Input */}
          <Text style={styles.inputLabel}>Enter your email</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#00D9FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#6B7AA1"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#00D9FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#6B7AA1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather 
                name={showPassword ? "eye" : "eye-off"} 
                size={20} 
                color="#6B7AA1" 
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button with Gradient */}
          <TouchableOpacity
            style={[styles.signInButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New User? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.registerText}>Register Here</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Toast */}
      {toast.visible && (
        <View style={styles.toastContainer}>
          <Animated.View
            style={[
              styles.toast,
              toast.type === 'error' ? styles.toastError : styles.toastSuccess,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Feather 
              name={toast.type === 'error' ? "x-circle" : "check-circle"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.toastText}>{toast.message}</Text>
          </Animated.View>
        </View>
      )}
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

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: isSmallDevice ? 40 : 60,
    paddingBottom: isSmallDevice ? 30 : 40,
    minHeight: height,
  },

  // Logo section matching welcome screen
  logoSection: {
    alignItems: 'center',
    marginBottom: isSmallDevice ? 30 : 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: isSmallDevice ? 20 : 24,
  },
  logoGlow: {
    position: 'absolute',
    width: isSmallDevice ? 90 : 100,
    height: isSmallDevice ? 90 : 100,
    borderRadius: isSmallDevice ? 23 : 25,
    backgroundColor: '#00D9FF',
    top: -6,
    left: -6,
  },
  logoWrapper: {
    width: isSmallDevice ? 78 : 88,
    height: isSmallDevice ? 78 : 88,
    backgroundColor: '#151B3D',
    borderRadius: isSmallDevice ? 20 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D9FF',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  logo: {
    width: isSmallDevice ? 50 : 55,
    height: isSmallDevice ? 50 : 55,
  },
  titleContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: isSmallDevice ? 32 : 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  glowLine: {
    width: 50,
    height: 2,
    backgroundColor: '#00D9FF',
    marginVertical: 6,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  appSubname: {
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: '600',
    color: '#00D9FF',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  // Modern card styling
  card: {
    backgroundColor: '#151B3D',
    borderRadius: 24,
    padding: isSmallDevice ? 24 : 28,
    marginTop: isSmallDevice ? 20 : 30,
    borderWidth: 1,
    borderColor: '#00D9FF',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#6B7AA1',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D9FF',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1629',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    outlineStyle: 'none',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 14,
    color: '#00D9FF',
    fontWeight: '600',
  },
  signInButton: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#8a5cf6bd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7AA1',
  },
  registerText: {
    fontSize: 14,
    color: '#00D9FF',
    fontWeight: '600',
  },

  // Toast styling
  toastContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastError: {
    backgroundColor: '#EF4444',
  },
  toastSuccess: {
    backgroundColor: '#10B981',
  },
  toastText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});
