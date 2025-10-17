import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function AccountSettings() {
  const [isProfilePublic, setIsProfilePublic] = useState(false);

  const handleSave = () => {
    // TODO: Connect this to your app's state/backend if needed
    Alert.alert(
      'Settings Saved',
      isProfilePublic
        ? 'Your profile is now public to institution members.'
        : 'Your profile is now private.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Account Settings</Text>

        {/* Privacy setting only */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Profile Visibility</Text>
            <Switch
              value={isProfilePublic}
              onValueChange={setIsProfilePublic}
              thumbColor={isProfilePublic ? '#6366F1' : '#A7F3D0'}
              trackColor={{ false: '#E2E8F0', true: '#94A3B8' }}
            />
          </View>
          <Text style={styles.note}>
            {isProfilePublic
              ? 'Your profile is visible to institution members.'
              : 'Your profile is private to you and authorized staff.'}
          </Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  section: { marginBottom: 24, backgroundColor: '#fff', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  sectionTitle: { fontWeight: '700', fontSize: 17, color: '#6366F1', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 15, color: '#1E293B' },
  note: { marginTop: 5, color: '#94A3B8', fontSize: 12 },
  saveBtn: { marginTop: 28, backgroundColor: '#6366F1', borderRadius: 12, paddingVertical: 14, alignItems: 'center', elevation: 3 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
