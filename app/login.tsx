import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
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
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const showToast = (message: string, type = 'error') => {
    setToast({ visible: true, message, type });
    Animated.timing(toastAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
        setToast({ visible: false, message: '', type: 'error' })
      );
    }, 2500);
  };

  const validateMobileNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone.replace(/[^\d]/g, ''));

  const handleLogin = async () => {
    if (!mobileNumber.trim() || !validateMobileNumber(mobileNumber)) {
      showToast('Please enter a valid 10-digit mobile number'); return;
    }
    if (!password.trim()) { showToast('Please enter your password'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      showToast('Login successful!', 'success');
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userId', 'mock-user-id');
      await AsyncStorage.setItem('userName', 'Test Student');
      setTimeout(() => router.replace('/(tabs)'), 1000);
    } catch {
      showToast('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Logo Section */}
        <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoWrap}>
            <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>EcoYatra</Text>
          <Text style={styles.tagline}>Your Sustainable Journey 🌿</Text>
        </Animated.View>

        {/* Login Card */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }]}>
          <View style={styles.card}>
            <Text style={styles.cardHeaderText}>Sign In</Text>

            {/* Mobile */}
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <View style={styles.inputField}>
              <Feather name="phone" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.textInput}
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                editable={!loading}
                maxLength={13}
              />
            </View>

            {/* Password */}
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputField}>
              <Feather name="lock" size={18} color="#9CA3AF" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity style={[styles.signInBtn]} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
              {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.signInBtnText}>Sign In</Text>}
            </TouchableOpacity>

            {/* Sign Up */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>New here? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {toast.visible && (
        <Animated.View style={[styles.toast, { opacity: toastAnim, backgroundColor: toast.type === 'success' ? '#16A34A' : '#EF4444' }]}>
          <Feather name={toast.type === 'success' ? 'check-circle' : 'alert-circle'} size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, alignItems: 'center' },

  // Logo section
  logoSection: { alignItems: 'center', marginBottom: 32, width: '100%' },
  logoWrap: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  logo: { width: 60, height: 60 },
  appName: { fontSize: 28, fontWeight: '700', color: '#111827', letterSpacing: 0.5 },
  tagline: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginTop: 4 },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%',
    borderWidth: 1, borderColor: '#E5E7EB',
  },

  cardHeaderText: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 20, textAlign: 'center' },

  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8 },

  // Input
  inputField: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 14, minHeight: 52, paddingHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  textInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827' },

  // Sign In button
  signInBtn: {
    backgroundColor: '#16A34A', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  signInBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signupText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  signupLink: { fontSize: 14, color: '#16A34A', fontWeight: '600' },

  toast: {
    position: 'absolute', bottom: 40, left: 30, right: 30,
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  toastText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
