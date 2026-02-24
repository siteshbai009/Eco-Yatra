import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
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

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
  const validateEmail = (emailValue: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  const validatePassword = (pass: string) => pass.length >= 6;

  const handleSignup = async () => {
    if (!name.trim()) { showToast('Please enter your full name'); return; }
    if (!mobileNumber.trim() || !validateMobileNumber(mobileNumber)) { showToast('Please enter a valid 10-digit mobile number'); return; }
    if (!email.trim() || !validateEmail(email)) { showToast('Please enter a valid email address'); return; }
    if (!password.trim() || !validatePassword(password)) { showToast('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { showToast('Passwords do not match'); return; }

    setLoading(true);
    try {
      const cleanPhone = mobileNumber.replace(/[^\d]/g, '');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = { id: 'mock-user-id-' + Math.random(), name: name.trim(), mobile_number: cleanPhone, email: email.toLowerCase().trim() };

      if (data) {
        showToast('Account created successfully! 🎉', 'success');
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('userId', data.id);
        await AsyncStorage.setItem('userName', data.name);
        setName(''); setMobileNumber(''); setEmail(''); setPassword(''); setConfirmPassword('');
        setTimeout(() => router.replace('/(tabs)'), 1000);
      }
      setLoading(false);
    } catch (err) {
      showToast('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const fields = [
    { icon: 'user', label: 'Full Name', placeholder: 'Your full name', value: name, setter: setName, keyboard: 'default' as any, secure: false },
    { icon: 'phone', label: 'Mobile Number', placeholder: '+91 XXXXX XXXXX', value: mobileNumber, setter: setMobileNumber, keyboard: 'phone-pad' as any, secure: false },
    { icon: 'mail', label: 'Email Address', placeholder: 'your@email.com', value: email, setter: setEmail, keyboard: 'email-address' as any, secure: false },
    { icon: 'lock', label: 'Password', placeholder: 'Min 6 characters', value: password, setter: setPassword, keyboard: 'default' as any, secure: true },
    { icon: 'lock', label: 'Confirm Password', placeholder: 'Re-enter password', value: confirmPassword, setter: setConfirmPassword, keyboard: 'default' as any, secure: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, styles.headerArea]}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Join EcoYatra for your sustainable journey</Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }]}>
          <View style={styles.card}>
            {fields.map((f, i) => (
              <View key={i}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <View style={styles.inputField}>
                  <Feather name={f.icon as any} size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.textInput}
                    placeholder={f.placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={f.keyboard}
                    secureTextEntry={f.secure && !showPassword}
                    value={f.value}
                    onChangeText={f.setter}
                    editable={!loading}
                    maxLength={f.icon === 'phone' ? 13 : undefined}
                  />
                  {f.secure && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* Sign Up Button */}
            <TouchableOpacity style={[styles.signupBtn]} onPress={handleSignup} disabled={loading} activeOpacity={0.8}>
              {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.signupBtnText}>Sign Up</Text>}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInRow}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.signInLink}>Sign In</Text>
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 60, alignItems: 'center' },

  // Header
  headerArea: { alignItems: 'center', marginBottom: 24, width: '100%' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  headerSub: { fontSize: 15, fontWeight: '500', color: '#6B7280', textAlign: 'center' },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%',
    borderWidth: 1, borderColor: '#E5E7EB',
  },

  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 4 },

  // Input
  inputField: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 14, minHeight: 52, paddingHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  textInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827' },

  // Sign Up btn
  signupBtn: {
    backgroundColor: '#16A34A', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 16,
  },
  signupBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  signInRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signInText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  signInLink: { fontSize: 14, color: '#16A34A', fontWeight: '600' },

  toast: {
    position: 'absolute', bottom: 40, left: 30, right: 30,
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  toastText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
