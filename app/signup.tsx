import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Image,
  Modal,
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

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (MEC)',
  'Electrical & Electronics Engineering (EEE)',
  'Civil Engineering (CE)',
  'Information Technology (IT)',
  'Chemical Engineering (CHE)',
];

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
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

  const handleDepartmentSelect = (dept: string) => {
    setFormData({ ...formData, department: dept });
    setShowDepartmentModal(false);
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill all required fields');
      return;
    }

    if (!formData.department) {
      showToast('Please select your department');
      return;
    }

    if (formData.name.trim().length < 2) {
      showToast('Name must be at least 2 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const existingUser = await AsyncStorage.getItem('userProfile');
      if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email.toLowerCase() === formData.email.toLowerCase().trim()) {
          showToast('Account exists. Please login');
          setLoading(false);
          return;
        }
      }

      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        role: 'Student',
        department: formData.department,
        password: formData.password,
      };

      await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    } catch (error) {
      showToast('Failed to create account');
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
            <Text style={styles.appSubname}>REGISTER</Text>
          </View>
        </Animated.View>

        {/* Signup Card */}
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the GIET grievance portal</Text>

          {/* Name Input */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#00D9FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#6B7AA1"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Email Input */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#00D9FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#6B7AA1"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Department Dropdown */}
          <Text style={styles.inputLabel}>Department</Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowDepartmentModal(true)}
            disabled={loading}
          >
            <Feather name="book" size={20} color="#00D9FF" style={styles.inputIcon} />
            <Text style={[styles.dropdownText, !formData.department && styles.placeholderText]}>
              {formData.department || 'Select your department'}
            </Text>
            <Feather name="chevron-down" size={20} color="#6B7AA1" />
          </TouchableOpacity>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#00D9FF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#6B7AA1"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
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

          {/* Sign Up Button with Gradient */}
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Department Modal */}
      <Modal
        visible={showDepartmentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDepartmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowDepartmentModal(false)}
          />
          <View style={styles.departmentModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Department</Text>
              <TouchableOpacity onPress={() => setShowDepartmentModal(false)}>
                <Feather name="x" size={24} color="#00D9FF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.departmentList}>
              {DEPARTMENTS.map((dept, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.departmentItem,
                    formData.department === dept && styles.selectedDepartment,
                  ]}
                  onPress={() => handleDepartmentSelect(dept)}
                >
                  <Text style={[
                    styles.departmentText,
                    formData.department === dept && styles.selectedDepartmentText,
                  ]}>
                    {dept}
                  </Text>
                  {formData.department === dept && (
                    <Feather name="check" size={20} color="#00D9FF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    paddingTop: isSmallDevice ? 30 : 40,
    paddingBottom: isSmallDevice ? 30 : 40,
    minHeight: height,
  },

  // Logo section matching welcome screen
  logoSection: {
    alignItems: 'center',
    marginBottom: isSmallDevice ? 20 : 30,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: isSmallDevice ? 16 : 20,
  },
  logoGlow: {
    position: 'absolute',
    width: isSmallDevice ? 75 : 85,
    height: isSmallDevice ? 75 : 85,
    borderRadius: isSmallDevice ? 19 : 21,
    backgroundColor: '#00D9FF',
    top: -5,
    left: -5,
  },
  logoWrapper: {
    width: isSmallDevice ? 65 : 75,
    height: isSmallDevice ? 65 : 75,
    backgroundColor: '#151B3D',
    borderRadius: isSmallDevice ? 16 : 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D9FF',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: isSmallDevice ? 40 : 45,
    height: isSmallDevice ? 40 : 45,
  },
  titleContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: isSmallDevice ? 28 : 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  glowLine: {
    width: 45,
    height: 2,
    backgroundColor: '#00D9FF',
    marginVertical: 4,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  appSubname: {
    fontSize: isSmallDevice ? 10 : 12,
    fontWeight: '600',
    color: '#00D9FF',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // Modern card styling
  card: {
    backgroundColor: '#151B3D',
    borderRadius: 24,
    padding: isSmallDevice ? 20 : 24,
    marginTop: isSmallDevice ? 15 : 20,
    borderWidth: 1,
    borderColor: '#00D9FF',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: isSmallDevice ? 20 : 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#6B7AA1',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00D9FF',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1629',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    outlineStyle: 'none',
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  placeholderText: {
    color: '#6B7AA1',
  },
  signUpButton: {
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 8,
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
    paddingVertical: 14,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6B7AA1',
  },
  signInText: {
    fontSize: 13,
    color: '#00D9FF',
    fontWeight: '600',
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  departmentModalContent: {
    backgroundColor: '#151B3D',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: '#00D9FF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  departmentList: {
    padding: 20,
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#0F1629',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  selectedDepartment: {
    backgroundColor: '#0A1A2A',
    borderColor: '#00D9FF',
  },
  departmentText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  selectedDepartmentText: {
    fontWeight: '600',
    color: '#00D9FF',
  },

  // Toast styling
  toastContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 2000,
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
