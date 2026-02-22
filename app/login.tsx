import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
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
  const slideAnim = useRef(new Animated.Value(50)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
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
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />

      {/* Background blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Logo Section */}
        <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoBubbleWrap}>
            <View style={styles.logoBubbleShadow} />
            <View style={styles.logoBubble}>
              <View style={styles.logoBubbleHighlight} />
              <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>
          <Text style={styles.appName}>EcoYatra</Text>
          <Text style={styles.tagline}>Your Sustainable Journey 🌿</Text>
        </Animated.View>

        {/* Login Card */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardWrap}>
            <View style={styles.cardShadow} />
            <View style={styles.card}>
              <View style={styles.cardHighlight} />

              {/* Card Header */}
              <View style={styles.cardHeaderWrap}>
                <View style={styles.cardHeaderShadow} />
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderHighlight} />
                  <Text style={styles.cardHeaderText}>🔐 Sign In</Text>
                </View>
              </View>

              {/* Mobile */}
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <View style={styles.inputWrap}>
                <View style={styles.inputShadow} />
                <View style={styles.input}>
                  <Feather name="phone" size={18} color="#3DBF87" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="+91 XXXXX XXXXX"
                    placeholderTextColor="#B0C8B8"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    editable={!loading}
                    maxLength={13}
                  />
                </View>
              </View>

              {/* Password */}
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <View style={styles.inputShadow} />
                <View style={styles.input}>
                  <Feather name="lock" size={18} color="#3DBF87" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#B0C8B8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#8AB8A0" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In Button */}
              <View style={styles.btnWrap}>
                <View style={styles.btnShadow} />
                <TouchableOpacity style={[styles.signInBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                  <View style={styles.btnHighlight} />
                  <Text style={styles.signInBtnText}>{loading ? 'Signing In...' : 'Sign In 🚀'}</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign Up */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>New here? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signupLink}>Create Account →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>💚 Made for sustainable travel</Animated.Text>
      </ScrollView>

      {toast.visible && (
        <Animated.View style={[styles.toast, { opacity: toastAnim, backgroundColor: toast.type === 'success' ? '#3DBF87' : '#FF7B8A' }]}>
          <Feather name={toast.type === 'success' ? 'check-circle' : 'alert-circle'} size={16} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4FF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.5 },
  blob1: { width: 250, height: 250, backgroundColor: '#C8EDDA', top: -60, left: -60 },
  blob2: { width: 200, height: 200, backgroundColor: '#FFD4E8', bottom: 60, right: -50 },

  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, alignItems: 'center' },

  // Logo section
  logoSection: { alignItems: 'center', marginBottom: 32, width: '100%' },
  logoBubbleWrap: { position: 'relative', marginBottom: 16 },
  logoBubbleShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#A8D8FF', borderRadius: 60, opacity: 0.7,
  },
  logoBubble: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#A8D8FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
    elevation: 12, overflow: 'hidden',
  },
  logoBubbleHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 50,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 60, borderTopRightRadius: 60,
  },
  logo: { width: 85, height: 85 },
  appName: { fontSize: 34, fontWeight: '900', color: '#2D8A5F', letterSpacing: 1 },
  tagline: { fontSize: 14, fontWeight: '700', color: '#6B9A80', marginTop: 4 },

  // Card
  cardWrap: { width: '100%', position: 'relative', marginBottom: 24 },
  cardShadow: {
    position: 'absolute', top: 10, left: 10, right: -10, bottom: -10,
    backgroundColor: '#A8D8FF', borderRadius: 32, opacity: 0.5,
  },
  card: {
    backgroundColor: '#FFF', borderRadius: 32, padding: 24,
    shadowColor: '#A8D8FF', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20,
    elevation: 12, overflow: 'hidden',
  },
  cardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },

  // Card header chip
  cardHeaderWrap: { alignSelf: 'center', position: 'relative', marginBottom: 24 },
  cardHeaderShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#6BCBA5', borderRadius: 20, opacity: 0.5,
  },
  cardHeader: {
    backgroundColor: '#3DBF87', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10,
    overflow: 'hidden',
  },
  cardHeaderHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 16,
    backgroundColor: 'rgba(255,255,255,0.4)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  cardHeaderText: { fontSize: 17, fontWeight: '900', color: '#FFF', textAlign: 'center' },

  fieldLabel: { fontSize: 13, fontWeight: '800', color: '#5A9A75', marginBottom: 8, marginTop: 4 },

  // Input
  inputWrap: { position: 'relative', marginBottom: 16 },
  inputShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#B0DEFF', borderRadius: 20, opacity: 0.5,
  },
  input: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F9FF', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#B0DEFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
    elevation: 4,
  },
  textInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#2D5C40', fontWeight: '600' },

  // Sign In button
  btnWrap: { position: 'relative', marginTop: 8 },
  btnShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#6BCBA5', borderRadius: 22, opacity: 0.6,
  },
  signInBtn: {
    backgroundColor: '#3DBF87', borderRadius: 22, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    shadowColor: '#3DBF87', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12,
    elevation: 8,
  },
  btnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  signInBtnText: { fontSize: 18, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22, marginBottom: 16 },
  dividerLine: { flex: 1, height: 2, backgroundColor: '#E8F5EE', borderRadius: 1 },
  dividerText: { marginHorizontal: 14, fontSize: 13, fontWeight: '700', color: '#8AB8A0' },

  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { fontSize: 14, color: '#8AB8A0', fontWeight: '600' },
  signupLink: { fontSize: 14, color: '#3DBF87', fontWeight: '900' },

  footer: { fontSize: 13, color: '#8AB8A0', fontWeight: '600', textAlign: 'center' },

  toast: {
    position: 'absolute', bottom: 100, left: 30, right: 30,
    borderRadius: 20, paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12,
    elevation: 8,
  },
  toastText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
