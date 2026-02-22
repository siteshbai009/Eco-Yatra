import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
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
    View
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

  const fieldColors = ['#A8E6CF', '#B8D4FF', '#FFD4E8', '#D4C8F5', '#FFE8A0'];
  const fieldShadows = ['#6BCBA5', '#80AAFF', '#FF9EC8', '#A090E0', '#FFCC40'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />

      {/* Background blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header chip */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, styles.headerArea]}>
          <View style={styles.headerChipWrap}>
            <View style={styles.headerChipShadow} />
            <View style={styles.headerChip}>
              <View style={styles.headerChipHighlight} />
              <Text style={styles.headerTitle}>Create Account 🌿</Text>
            </View>
          </View>
          <Text style={styles.headerSub}>Join EcoYatra and start your sustainable journey</Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardWrap}>
            <View style={styles.cardShadow} />
            <View style={styles.card}>
              <View style={styles.cardHighlight} />

              {fields.map((f, i) => (
                <View key={i}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <View style={styles.inputWrap}>
                    <View style={[styles.inputShadow, { backgroundColor: fieldShadows[i] }]} />
                    <View style={[styles.inputField, { backgroundColor: fieldColors[i] + '40' }]}>
                      <Feather name={f.icon as any} size={18} color="#3DBF87" />
                      <TextInput
                        style={styles.textInput}
                        placeholder={f.placeholder}
                        placeholderTextColor="#B0C8B8"
                        keyboardType={f.keyboard}
                        secureTextEntry={f.secure && !showPassword}
                        value={f.value}
                        onChangeText={f.setter}
                        editable={!loading}
                        maxLength={f.icon === 'phone' ? 13 : undefined}
                      />
                      {f.secure && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Feather name={showPassword ? 'eye' : 'eye-off'} size={16} color="#8AB8A0" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              {/* Sign Up Button */}
              <View style={styles.btnWrap}>
                <View style={styles.btnShadow} />
                <TouchableOpacity style={[styles.signupBtn, loading && { opacity: 0.7 }]} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
                  <View style={styles.btnHighlight} />
                  <Text style={styles.signupBtnText}>{loading ? 'Creating Account...' : 'Sign Up 🚀'}</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Link */}
              <View style={styles.signInRow}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.signInLink}>Sign In →</Text>
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
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.45 },
  blob1: { width: 250, height: 250, backgroundColor: '#C8EDDA', top: -60, left: -60 },
  blob2: { width: 200, height: 200, backgroundColor: '#D4C8F5', bottom: 60, right: -50 },
  blob3: { width: 180, height: 180, backgroundColor: '#FFD4E8', top: '35%', right: -40 },

  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 60, alignItems: 'center' },

  // Header
  headerArea: { alignItems: 'center', marginBottom: 24, width: '100%' },
  headerChipWrap: { position: 'relative', alignSelf: 'center', marginBottom: 10 },
  headerChipShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#6BCBA5', borderRadius: 22, opacity: 0.6,
  },
  headerChip: {
    backgroundColor: '#3DBF87', borderRadius: 22, paddingHorizontal: 28, paddingVertical: 14,
    overflow: 'hidden', shadowColor: '#3DBF87', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  headerChipHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 26,
    backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 14, fontWeight: '700', color: '#6B9A80', textAlign: 'center' },

  // Card
  cardWrap: { width: '100%', position: 'relative', marginBottom: 20 },
  cardShadow: {
    position: 'absolute', top: 10, left: 10, right: -10, bottom: -10,
    backgroundColor: '#A8D8FF', borderRadius: 32, opacity: 0.4,
  },
  card: {
    backgroundColor: '#FFF', borderRadius: 32, padding: 24,
    shadowColor: '#A8D8FF', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20,
    elevation: 10, overflow: 'hidden',
  },
  cardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },

  fieldLabel: { fontSize: 12, fontWeight: '800', color: '#5A9A75', marginBottom: 8, marginTop: 4 },

  // Input
  inputWrap: { position: 'relative', marginBottom: 14 },
  inputShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    borderRadius: 18, opacity: 0.4,
  },
  inputField: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F9FF', borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 13,
    shadowColor: '#B0DEFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  textInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#2D4A30', fontWeight: '600' },

  // Sign Up button
  btnWrap: { position: 'relative', marginTop: 8 },
  btnShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#6BCBA5', borderRadius: 22, opacity: 0.6,
  },
  signupBtn: {
    backgroundColor: '#3DBF87', borderRadius: 22, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    shadowColor: '#3DBF87', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  btnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  signupBtnText: { fontSize: 18, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },

  signInRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 2, borderTopColor: '#F0FAFF' },
  signInText: { fontSize: 14, color: '#8AB8A0', fontWeight: '600' },
  signInLink: { fontSize: 14, color: '#3DBF87', fontWeight: '900' },

  footer: { fontSize: 13, color: '#8AB8A0', fontWeight: '600', textAlign: 'center' },

  toast: {
    position: 'absolute', bottom: 100, left: 30, right: 30,
    borderRadius: 20, paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  toastText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
