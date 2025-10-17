import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../UserContext';

export default function ProfileScreen() {
  const { user, updateUser } = useUser();
  const router = useRouter();

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  });

  // Load saved profile from AsyncStorage on app start
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

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', onPress: () => console.log('User logged out') },
    ]);
  };

  const handleEditProfile = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    if (!editForm.email.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }
    
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(editForm));
      // Update context
      updateUser(editForm);
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleSettings = () => {
    router.push('/AccountSettings');
  };
  const handleHelp = () => {
    router.push('/HelpSupport');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userRole}>
              {user.role} • {user.department}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Feather name="edit-3" size={20} color="#6366F1" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.sectionCard}>
              <TouchableOpacity style={styles.optionCard} onPress={handleSettings}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: '#C7D2FE' }]}>
                    <Feather name="settings" size={20} color="#6366F1" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Account Settings</Text>
                    <Text style={styles.optionSubtitle}>Privacy, security, etc.</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.optionDivider} />
              <TouchableOpacity style={styles.optionCard} onPress={handleHelp}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: '#BBF7D0' }]}>
                    <Feather name="help-circle" size={20} color="#22C55E" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Help & Support</Text>
                    <Text style={styles.optionSubtitle}>FAQs, contact support</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.sectionCard, { backgroundColor: '#FEF2F2' }]}
            onPress={handleLogout}
          >
            <View style={styles.optionCard}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: '#FECACA' }]}>
                  <Feather name="log-out" size={20} color="#EF4444" />
                </View>
                <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Log Out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Feather name="x" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
              <View style={styles.modalForm}>
                {/* Name */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={editForm.name}
                      onChangeText={text => setEditForm({ ...editForm, name: text })}
                      placeholder="Enter your full name"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
                {/* Email */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Email Address *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={editForm.email}
                      onChangeText={text => setEditForm({ ...editForm, email: text })}
                      placeholder="Enter your email"
                      placeholderTextColor="#94A3B8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                {/* Role */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Role</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={editForm.role}
                      onChangeText={text => setEditForm({ ...editForm, role: text })}
                      placeholder="e.g., Student, Faculty, Staff"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
                {/* Department */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Department</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={editForm.department}
                      onChangeText={text => setEditForm({ ...editForm, department: text })}
                      placeholder="e.g., Computer Science, Mechanical"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>
                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <View style={styles.saveContent}>
                    <Feather name="save" size={20} color="#FFF" />
                    <Text style={styles.saveText}>Save Changes</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#94A3B8',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 72,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalForm: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
