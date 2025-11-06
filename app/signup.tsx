import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
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
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const orbAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnim, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(orbAnim, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const orb1Translate = orbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });
  const orb2Translate = orbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type });
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setToast({ visible: false, message: '', type: 'error' }));
    }, 2500);
  };

  const handleSignup = async () => {
    if (!name || !email || !department || !password || !confirmPassword) {
      showToast('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        showToast(error.message || 'Signup failed. Try again.');
        return;
      }

      if (data.user) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            name,
            email: email.toLowerCase().trim(),
            department,
            role: 'Student',
          },
        ]);

        await AsyncStorage.setItem('isLoggedIn', 'true');
        showToast('Account created successfully!', 'success');

        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      }
    } catch (err) {
      showToast('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF7FF" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#DFF7FF', '#EBFAFF', '#F6FCFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Orbs */}
      <Animated.View
        style={[
          styles.orb,
          {
            backgroundColor: 'rgba(14,165,233,0.25)',
            top: -width * 0.4,
            right: -width * 0.3,
            transform: [{ translateY: orb1Translate }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            backgroundColor: 'rgba(59,130,246,0.20)',
            bottom: -width * 0.2,
            left: -width * 0.25,
            transform: [{ translateY: orb2Translate }],
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Logo */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Signup Card */}
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the GIET grievance portal</Text>

          {/* Scrollable Input Section */}
          <View style={{ maxHeight: 400 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#0EA5E9" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#6B7280"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#0EA5E9" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="student@giet.edu"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.inputLabel}>Department</Text>
              <View style={styles.inputWrapper}>
                <Feather name="book" size={20} color="#0EA5E9" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your department"
                  placeholderTextColor="#6B7280"
                  value={department}
                  onChangeText={setDepartment}
                />
              </View>

              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#0EA5E9" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#0EA5E9" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.glassButton, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.9)',
                'rgba(255,255,255,0.75)',
                'rgba(14,165,233,0.15)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.glowBorder} />
            <Text style={styles.glassButtonText}>
              {loading ? 'Creating...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Designed & built with ❤️ by TEAM NEXUS</Text>
      </View>

      {/* Toast */}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor:
                toast.type === 'success' ? '#10B981' : '#EF4444',
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Feather
            name={toast.type === 'success' ? 'check-circle' : 'alert-circle'}
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF7FF' },
  orb: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    opacity: 0.45,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 100,
  },
  header: { alignItems: 'center', marginBottom: -20 },
  logoWrapper: {
    width: 210,
    height: 210,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(14,165,233,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 10,
  },
  logo: { width: 160, height: 160 },
  card: {
    width: '88%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(14,165,233,0.25)',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0EA5E9',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(14,165,233,0.2)',
  },
  input: { flex: 1, fontSize: 16, color: '#0F172A', fontWeight: '500' },
  glassButton: {
    width: '100%',
    paddingVertical: 22,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(14,165,233,0.4)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 25,
    overflow: 'hidden',
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
  },
  glassButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonDisabled: { opacity: 0.6 },
  signupContainer: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { fontSize: 14, color: '#64748B' },
  signupLink: { fontSize: 14, color: '#0EA5E9', fontWeight: '700' },
  footerContainer: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(14,165,233,0.8)',
    fontWeight: '500',
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 40,
    right: 40,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
