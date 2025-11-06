import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../../UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function ProfileScreen() {
  const { user, updateUser } = useUser();
  const router = useRouter();

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    department: user.department || '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setEditForm(profileData);
          updateUser(profileData);
        }
      } catch (error) {
        console.log('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleLogoutPress = () => {
    if (Platform.OS === 'web') {
      setLogoutModalVisible(true);
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: performLogout },
      ]);
    }
  };

  const performLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userProfile', 'isLoggedIn']);
      updateUser({
        name: 'Student Name',
        email: 'student@giet.edu',
        role: 'Student',
        department: 'Computer Science',
        avatar: 'SN',
      });
      setLogoutModalVisible(false);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const updatedProfile = { ...user, ...editForm };
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      updateUser(editForm);
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#06B6D4" />

      {/* Header */}
      <LinearGradient
        colors={['#06B6D4cc', '#0EA5E9cc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account & preferences</Text>
      </LinearGradient>

      <ScrollView style={styles.background}>
        {/* Profile Card */}
        <View style={styles.userCard}>
          <LinearGradient colors={['#06B6D4', '#0EA5E9']} style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() ?? 'U'}</Text>
          </LinearGradient>
          <Text style={styles.userName}>{user.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user.email || 'email@example.com'}</Text>
          <Text style={styles.userRole}>
            {user.role || 'Student'} • {user.department || 'General'}
          </Text>

          <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
            <Feather name="edit-3" size={18} color="#06B6D4" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ & Contact Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Help & Support</Text>

          <View style={styles.glassCard}>
            <LinearGradient colors={['#E0F2FE', '#F0FDFA']} style={styles.iconBox}>
              <Feather name="help-circle" size={22} color="#06B6D4" />
            </LinearGradient>
            <View style={styles.glassContent}>
              <Text style={styles.glassTitle}>Frequently Asked Questions</Text>
              <Text style={styles.glassSubtitle}>
                Learn how to use the app and find quick answers.
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#06B6D4" />
          </View>

          <View style={styles.glassCard}>
            <LinearGradient colors={['#E0F2FE', '#F0FDFA']} style={styles.iconBox}>
              <Feather name="mail" size={22} color="#06B6D4" />
            </LinearGradient>
            <View style={styles.glassContent}>
              <Text style={styles.glassTitle}>Contact Support</Text>
              <Text style={styles.glassSubtitle}>
                Reach your department coordinator for help.
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleLogoutPress}>
          <LinearGradient
            colors={['#FCA5A5', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutButton}
          >
            <Feather name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={90} tint="light" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              {['name', 'email', 'role', 'department'].map((field) => (
                <View key={field} style={styles.inputSection}>
                  <Text style={styles.inputLabel}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                    {field === 'name' || field === 'email' ? '*' : ''}
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm[field as keyof typeof editForm]}
                    onChangeText={(text) =>
                      setEditForm((prev) => ({ ...prev, [field]: text }))
                    }
                    placeholder={`Enter your ${field}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType={field === 'email' ? 'email-address' : 'default'}
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Feather name="save" size={18} color="#fff" />
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </BlurView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    padding: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: 'white', marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: '#E0F2FE' },

  userCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  userEmail: { fontSize: 16, color: '#64748B', marginBottom: 4 },
  userRole: { fontSize: 14, color: '#94A3B8' },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#06B6D4',
    borderRadius: 12,
    backgroundColor: '#ECFEFF',
  },
  editButtonText: { fontSize: 14, fontWeight: '600', color: '#06B6D4', marginLeft: 8 },

  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A5F3FC',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#06B6D4',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  glassContent: { flex: 1 },
  glassTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  glassSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 80,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: '#A5F3FC',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0E7490' },
  modalForm: { padding: 20 },
  inputSection: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 6 },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06B6D4',
    borderRadius: 12,
    marginTop: 20,
    paddingVertical: 12,
    shadowColor: '#06B6D4',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  saveText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
