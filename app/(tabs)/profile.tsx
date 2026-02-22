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
  const slideAnim = useRef(new Animated.Value(40)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useFocusEffect(useCallback(() => { fetchUserData(); }, []));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
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
    return <View style={styles.loader}><ActivityIndicator size="large" color="#3DBF87" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />

      {/* Background blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerShadow} />
        <View style={styles.header}>
          <View style={styles.headerHighlight} />
          <View style={styles.navContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <View style={styles.navBtnWrap}>
                <View style={styles.navBtnShadow} />
                <View style={styles.navBtn}>
                  <Feather name="arrow-left" size={22} color="#2D8A5F" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.navTitle}>👤 My Profile</Text>
            <View style={{ width: 44 }} />
          </View>
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {userData && (
          <>
            {/* Avatar Card */}
            <View style={styles.avatarCardWrap}>
              <View style={styles.avatarCardShadow} />
              <View style={styles.avatarCard}>
                <View style={styles.avatarCardHighlight} />
                <View style={styles.avatarBubbleWrap}>
                  <View style={styles.avatarBubbleShadow} />
                  <View style={styles.avatarBubble}>
                    <View style={styles.avatarBubbleHighlight} />
                    <Text style={styles.avatarLetter}>{userData.name.charAt(0).toUpperCase()}</Text>
                  </View>
                </View>
                <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                  <Text style={styles.avatarName}>{userData.name}</Text>
                  <View style={styles.rolePillWrap}>
                    <View style={styles.rolePillShadow} />
                    <View style={styles.rolePill}>
                      <View style={styles.rolePillHighlight} />
                      <Ionicons name="leaf" size={12} color="#2D8A5F" />
                      <Text style={styles.roleText}>{userData.role}</Text>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { label: 'Total Rides', value: `${userData.total_rides}`, icon: 'bicycle', color: '#A8E6CF', shadow: '#6BCBA5', iconColor: '#2D8A5F' },
                { label: 'CO₂ Saved', value: `${userData.carbon_saved_kg.toFixed(1)}kg`, icon: 'leaf', color: '#C8F5E0', shadow: '#90DFBA', iconColor: '#2D6A45' },
                { label: 'Rating', value: `${userData.rating.toFixed(1)}★`, icon: 'star', color: '#FFE8A0', shadow: '#FFCC40', iconColor: '#B8860B' },
              ].map((s, i) => (
                <View key={i} style={styles.statCardWrap}>
                  <View style={[styles.statCardShadow, { backgroundColor: s.shadow }]} />
                  <View style={[styles.statCard, { backgroundColor: s.color }]}>
                    <View style={styles.statCardHighlight} />
                    <Ionicons name={s.icon as any} size={20} color={s.iconColor} />
                    <Text style={styles.statNum}>{s.value}</Text>
                    <Text style={styles.statLbl}>{s.label}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Info / Edit Card */}
            {!editing ? (
              <View style={styles.infoCardWrap}>
                <View style={styles.infoCardShadow} />
                <View style={styles.infoCard}>
                  <View style={styles.infoCardHighlight} />
                  <Text style={styles.infoCardTitle}>✨ Account Details</Text>

                  {[
                    { icon: 'mail', label: 'Email', value: userData.email },
                    { icon: 'phone', label: 'Mobile', value: `+91 ${userData.mobile_number}` },
                    { icon: 'calendar', label: 'Member Since', value: new Date(userData.created_at).toLocaleDateString() },
                  ].map((item, i) => (
                    <View key={i}>
                      <View style={styles.infoRow}>
                        <View style={styles.infoIconWrap}>
                          <View style={styles.infoIconShadow} />
                          <View style={styles.infoIcon}>
                            <View style={styles.infoIconHighlight} />
                            <Feather name={item.icon as any} size={16} color="#FFF" />
                          </View>
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
                  <View style={styles.actionBtnWrap}>
                    <View style={styles.actionBtnShadow} />
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setEditing(true)} activeOpacity={0.85}>
                      <View style={styles.actionBtnHighlight} />
                      <Feather name="edit-2" size={16} color="#FFF" />
                      <Text style={styles.actionBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.infoCardWrap}>
                <View style={[styles.infoCardShadow, { backgroundColor: '#D4C8F5' }]} />
                <View style={styles.infoCard}>
                  <View style={styles.infoCardHighlight} />
                  <Text style={styles.infoCardTitle}>✏️ Edit Profile</Text>

                  <Text style={styles.editLabel}>Full Name</Text>
                  <View style={styles.inputWrap}>
                    <View style={styles.inputShadow} />
                    <View style={styles.inputField}>
                      <Feather name="user" size={16} color="#3DBF87" />
                      <TextInput style={styles.textInput} value={editedName} onChangeText={setEditedName} placeholder="Your name" placeholderTextColor="#B0C8B8" />
                    </View>
                  </View>

                  <Text style={styles.editLabel}>Email</Text>
                  <View style={styles.inputWrap}>
                    <View style={styles.inputShadow} />
                    <View style={styles.inputField}>
                      <Feather name="mail" size={16} color="#3DBF87" />
                      <TextInput style={styles.textInput} value={editedEmail} onChangeText={setEditedEmail} placeholder="Your email" placeholderTextColor="#B0C8B8" keyboardType="email-address" />
                    </View>
                  </View>

                  <View style={styles.actionBtnWrap}>
                    <View style={styles.actionBtnShadow} />
                    <TouchableOpacity style={styles.actionBtn} onPress={handleUpdateProfile} disabled={loading} activeOpacity={0.85}>
                      <View style={styles.actionBtnHighlight} />
                      <Text style={styles.actionBtnText}>{loading ? 'Saving...' : 'Save Changes ✅'}</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)} disabled={loading}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Logout */}
            {!editing && (
              <View style={styles.logoutBtnWrap}>
                <View style={styles.logoutBtnShadow} />
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                  <View style={styles.logoutBtnHighlight} />
                  <Feather name="log-out" size={18} color="#D04040" />
                  <Text style={styles.logoutBtnText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        <View style={{ height: 60 }} />
      </Animated.ScrollView>

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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F4FF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  blob1: { width: 240, height: 240, backgroundColor: '#FFD4E8', top: -50, right: -50 },
  blob2: { width: 200, height: 200, backgroundColor: '#C8EDDA', bottom: 100, left: -50 },
  blob3: { width: 180, height: 180, backgroundColor: '#D4C8F5', top: '40%', right: -40 },

  // Header
  headerWrap: { position: 'relative', margin: 16 },
  headerShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#FFD4E8', borderRadius: 24, opacity: 0.6,
  },
  header: {
    backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden',
    shadowColor: '#FFD4E8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  headerHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 30,
    backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  navContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  navBtnWrap: { position: 'relative' },
  navBtnShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#FFB0C8', borderRadius: 16, opacity: 0.6,
  },
  navBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 18, fontWeight: '900', color: '#2D4A30' },

  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Avatar Card
  avatarCardWrap: { position: 'relative', marginBottom: 16 },
  avatarCardShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#FFD4E8', borderRadius: 32, opacity: 0.6,
  },
  avatarCard: {
    backgroundColor: '#FFF', borderRadius: 32, paddingVertical: 28, paddingHorizontal: 20,
    alignItems: 'center', overflow: 'hidden',
    shadowColor: '#FFD4E8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  avatarCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },
  avatarBubbleWrap: { position: 'relative', marginBottom: 16 },
  avatarBubbleShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#FFAAC0', borderRadius: 54, opacity: 0.6,
  },
  avatarBubble: {
    width: 110, height: 110, borderRadius: 55, backgroundColor: '#FFD4E8',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    shadowColor: '#FFAAC0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  avatarBubbleHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 50,
    backgroundColor: 'rgba(255,255,255,0.6)', borderTopLeftRadius: 55, borderTopRightRadius: 55,
  },
  avatarLetter: { fontSize: 46, fontWeight: '900', color: '#C04080' },
  avatarName: { fontSize: 24, fontWeight: '900', color: '#2D4A30', textAlign: 'center', marginBottom: 10 },

  rolePillWrap: { alignSelf: 'center', position: 'relative' },
  rolePillShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#6BCBA5', borderRadius: 16, opacity: 0.5,
  },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#A8E6CF', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 7,
    overflow: 'hidden',
  },
  rolePillHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 14,
    backgroundColor: 'rgba(255,255,255,0.6)', borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  roleText: { fontSize: 13, fontWeight: '800', color: '#2D8A5F' },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCardWrap: { flex: 1, position: 'relative' },
  statCardShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, borderRadius: 22, opacity: 0.7 },
  statCard: {
    borderRadius: 22, paddingVertical: 14, paddingHorizontal: 6,
    alignItems: 'center', gap: 4, overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  statCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 26,
    backgroundColor: 'rgba(255,255,255,0.6)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  statNum: { fontSize: 16, fontWeight: '900', color: '#2D4A30', marginTop: 2 },
  statLbl: { fontSize: 9, fontWeight: '800', color: '#5A7A60', textAlign: 'center' },

  // Info Card
  infoCardWrap: { position: 'relative', marginBottom: 16 },
  infoCardShadow: {
    position: 'absolute', top: 8, left: 8, right: -8, bottom: -8,
    backgroundColor: '#B0DEFF', borderRadius: 28, opacity: 0.5,
  },
  infoCard: {
    backgroundColor: '#FFF', borderRadius: 28, padding: 22, overflow: 'hidden',
    shadowColor: '#B0DEFF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  infoCardHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 50,
    backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  infoCardTitle: { fontSize: 15, fontWeight: '900', color: '#2D4A30', marginBottom: 18 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },

  infoIconWrap: { position: 'relative' },
  infoIconShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#6BCBA5', borderRadius: 16, opacity: 0.5,
  },
  infoIcon: {
    width: 40, height: 40, borderRadius: 16, backgroundColor: '#3DBF87',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  infoIconHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 18,
    backgroundColor: 'rgba(255,255,255,0.4)', borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  infoText: { flex: 1, marginLeft: 14 },
  infoLabel: { fontSize: 11, fontWeight: '700', color: '#8AB8A0', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '800', color: '#2D4A30' },
  infoDivider: { height: 2, backgroundColor: '#F0FAFF', marginLeft: 54, borderRadius: 1 },

  // Edit inputs
  editLabel: { fontSize: 12, fontWeight: '800', color: '#5A9A75', marginBottom: 8, marginTop: 4 },
  inputWrap: { position: 'relative', marginBottom: 14 },
  inputShadow: {
    position: 'absolute', top: 5, left: 5, right: -5, bottom: -5,
    backgroundColor: '#B0DEFF', borderRadius: 18, opacity: 0.5,
  },
  inputField: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F9FF', borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 13,
    shadowColor: '#B0DEFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  textInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#2D4A30', fontWeight: '600' },

  // Action button
  actionBtnWrap: { position: 'relative', marginTop: 10 },
  actionBtnShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#6BCBA5', borderRadius: 22, opacity: 0.6,
  },
  actionBtn: {
    backgroundColor: '#3DBF87', borderRadius: 22, paddingVertical: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, overflow: 'hidden',
    shadowColor: '#3DBF87', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  actionBtnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  actionBtnText: { fontSize: 16, fontWeight: '900', color: '#FFF', letterSpacing: 0.3 },

  cancelBtn: {
    paddingVertical: 14, marginTop: 12, alignItems: 'center', borderRadius: 18,
    backgroundColor: '#FFF0F0',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '800', color: '#D04040' },

  // Logout
  logoutBtnWrap: { position: 'relative', marginBottom: 10 },
  logoutBtnShadow: {
    position: 'absolute', top: 6, left: 6, right: -6, bottom: -6,
    backgroundColor: '#FFB0B8', borderRadius: 22, opacity: 0.6,
  },
  logoutBtn: {
    backgroundColor: '#FFF0F2', borderRadius: 22, paddingVertical: 17,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, overflow: 'hidden',
    shadowColor: '#FFB0B8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  logoutBtnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    backgroundColor: 'rgba(255,255,255,0.7)', borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },
  logoutBtnText: { fontSize: 16, fontWeight: '900', color: '#D04040' },

  // Toast
  toast: {
    position: 'absolute', bottom: 100, left: 30, right: 30,
    borderRadius: 20, paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  toastText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
