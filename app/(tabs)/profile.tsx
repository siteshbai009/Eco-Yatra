import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface UserData {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  role: string;
  carbon_saved_kg: number;
  total_rides: number;
  rating: number;
  created_at: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useFocusEffect(useCallback(() => { fetchUserData(); }, []));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      await new Promise(r => setTimeout(r, 400));
      const mockUser: UserData = {
        id: userId || 'mock-id',
        name: (await AsyncStorage.getItem('userName')) || 'Test User',
        email: 'test@example.com',
        mobile_number: '9876543210',
        role: 'Eco Traveler',
        carbon_saved_kg: 12.5,
        total_rides: 42,
        rating: 4.8,
        created_at: new Date().toISOString(),
      };
      setUserData(mockUser);
      setEditedName(mockUser.name);
      setEditedEmail(mockUser.email);
    } catch (err) {
      showToast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) { showToast('Name cannot be empty'); return; }
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 500));
      if (userData) {
        setUserData({ ...userData, name: editedName.trim(), email: editedEmail.toLowerCase().trim() });
        await AsyncStorage.setItem('userName', editedName.trim());
      }
      showToast('Profile updated successfully!', 'success');
      setEditing(false);
    } catch (err) {
      showToast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'userId', 'userName']);
    showToast('Logged out!', 'success');
    setTimeout(() => router.replace('/login'), 1000);
  };

  if (loading && !userData) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#16A34A" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>My Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          {userData && (
            <>
              {/* Avatar Card */}
              <View style={styles.avatarCard}>
                <View style={styles.avatarBubble}>
                  <Text style={styles.avatarLetter}>{userData.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.avatarName}>{userData.name}</Text>
                <View style={styles.rolePill}>
                  <Ionicons name="leaf" size={14} color="#16A34A" />
                  <Text style={styles.roleText}>{userData.role}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                {[
                  { label: 'Rides', value: `${userData.total_rides}`, icon: 'bicycle' },
                  { label: 'CO₂ Saved', value: `${userData.carbon_saved_kg.toFixed(1)}kg`, icon: 'leaf' },
                  { label: 'Rating', value: `${userData.rating.toFixed(1)}`, icon: 'star' },
                ].map((s, i) => (
                  <View key={i} style={styles.statCard}>
                    <Ionicons name={s.icon as any} size={20} color="#16A34A" />
                    <Text style={styles.statNum}>{s.value}</Text>
                    <Text style={styles.statLbl}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Info / Edit Card */}
              {!editing ? (
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Account Details</Text>

                  {[
                    { icon: 'mail', label: 'Email', value: userData.email },
                    { icon: 'phone', label: 'Mobile', value: `+91 ${userData.mobile_number}` },
                    { icon: 'calendar', label: 'Member Since', value: new Date(userData.created_at).toLocaleDateString() },
                  ].map((item, i) => (
                    <View key={i}>
                      <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                          <Feather name={item.icon as any} size={18} color="#16A34A" />
                        </View>
                        <View style={styles.infoText}>
                          <Text style={styles.infoLabel}>{item.label}</Text>
                          <Text style={styles.infoValue}>{item.value}</Text>
                        </View>
                      </View>
                      {i < 2 && <View style={styles.infoDivider} />}
                    </View>
                  ))}

                  {/* Edit Button */}
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setEditing(true)} activeOpacity={0.8}>
                    <Feather name="edit-2" size={16} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Edit Profile</Text>

                  <Text style={styles.editLabel}>Full Name</Text>
                  <View style={styles.inputField}>
                    <Feather name="user" size={18} color="#9CA3AF" />
                    <TextInput style={styles.textInput} value={editedName} onChangeText={setEditedName} placeholder="Your name" placeholderTextColor="#9CA3AF" />
                  </View>

                  <Text style={styles.editLabel}>Email</Text>
                  <View style={styles.inputField}>
                    <Feather name="mail" size={18} color="#9CA3AF" />
                    <TextInput style={styles.textInput} value={editedEmail} onChangeText={setEditedEmail} placeholder="Your email" placeholderTextColor="#9CA3AF" keyboardType="email-address" />
                  </View>

                  <TouchableOpacity style={styles.actionBtn} onPress={handleUpdateProfile} disabled={loading} activeOpacity={0.8}>
                    {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.actionBtnText}>Save Changes</Text>}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)} disabled={loading}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Logout */}
              {!editing && (
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                  <Feather name="log-out" size={18} color="#EF4444" />
                  <Text style={styles.logoutBtnText}>Sign Out</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          <View style={{ height: 60 }} />
        </Animated.View>
      </Animated.ScrollView>

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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: '#F9FAFB',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  navTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },

  avatarCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, paddingVertical: 24, paddingHorizontal: 20,
    alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  avatarBubble: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarLetter: { fontSize: 36, fontWeight: '700', color: '#16A34A' },
  avatarName: { fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
  },
  roleText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 8,
    alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
  },
  statNum: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 8 },
  statLbl: { fontSize: 11, fontWeight: '500', color: '#6B7280', textAlign: 'center', marginTop: 2 },

  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20,
  },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  infoIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center',
  },
  infoText: { flex: 1, marginLeft: 14 },
  infoLabel: { fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#111827' },
  infoDivider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 54 },

  editLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 4 },
  inputField: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 14, minHeight: 52, paddingHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  textInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827' },

  actionBtn: {
    backgroundColor: '#16A34A', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16,
  },
  actionBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  cancelBtn: { paddingVertical: 16, marginTop: 8, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },

  logoutBtn: {
    backgroundColor: '#FEF2F2', borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: '#FEE2E2',
  },
  logoutBtnText: { fontSize: 16, fontWeight: '600', color: '#EF4444' },

  toast: {
    position: 'absolute', bottom: 40, left: 30, right: 30,
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  toastText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
