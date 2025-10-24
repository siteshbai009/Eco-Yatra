import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
} from 'react-native';

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
    password: 'Soumyaranjan@123',
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
  const router = useRouter();

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
      // Check if it's email or registration number
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
      <StatusBar barStyle="light-content" backgroundColor="#1E6FD9" />
      
      {/* Blue Header Background */}
      <View style={styles.headerBackground} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* White Card Container */}
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Grievance Portal Login</Text>
          <Text style={styles.subtitle}>Welcome back. Please enter your details.</Text>

          {/* Registration Number Input */}
          <Text style={styles.inputLabel}>Registration Number</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your registration number"
              placeholderTextColor="#94A3B8"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather 
                name={showPassword ? 'eye' : 'eye-off'} 
                size={20} 
                color="#64748B" 
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New User? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.registerText}>Register Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Toast */}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
            <Feather
              name={toast.type === 'error' ? 'alert-circle' : 'check-circle'}
              size={20}
              color="white"
            />
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E6FD9',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: '#1E6FD9',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 100,  // Even more space at the top
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    outlineStyle: 'none',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 14,
    color: '#1E6FD9',
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#1E6FD9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1E6FD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#64748B',
  },
  registerText: {
    fontSize: 14,
    color: '#1E6FD9',
    fontWeight: '600',
  },
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
