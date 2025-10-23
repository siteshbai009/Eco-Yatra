import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
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
  // ADMIN ACCOUNT FOR DEMO/COLLEGE PRESENTATION
  {
    email: 'admin@giet.edu.in',
    password: 'Admin@1234',
    name: 'GIET Administrator',
    department: 'Administration',
  },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    if (!email || !password) {
      showToast('Please fill all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const authorizedUser = AUTHORIZED_USERS.find(
        user => user.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (!authorizedUser) {
        showToast('Access denied. Contact admin for access');
        setLoading(false);
        return;
      }

      if (authorizedUser.password !== password) {
        showToast('Invalid password. Please try again');
        setLoading(false);
        return;
      }

      // Determine role based on email domain and department
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
      
      showToast(`Login successful! Welcome ${isAdmin ? 'Administrator' : 'Student'}`, 'success');
      
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('.././assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Please Sign in to continue.</Text>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <Feather name="user" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••••"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather 
              name={showPassword ? "eye" : "eye-off"} 
              size={18} 
              color="#64748B" 
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me */}
        <View style={styles.rememberContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Feather name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.rememberText}>Remember me nexttime</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.signInButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          <View
            style={[
              styles.toast,
              toast.type === 'success' ? styles.toastSuccess : styles.toastError,
            ]}
          >
            <Feather
              name={toast.type === 'success' ? 'check-circle' : 'alert-circle'}
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
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logo: {
    width: 220,
    height: 220,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    outlineStyle: 'none',
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
  rememberContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  rememberText: {
    fontSize: 13,
    color: '#64748B',
  },
  signInButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
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
  signUpText: {
    fontSize: 14,
    color: '#1E3A5F',
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
    backgroundColor: '#1F2937',
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
