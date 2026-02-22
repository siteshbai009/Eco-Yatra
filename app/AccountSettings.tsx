import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AccountSettings() {
  const router = useRouter();
  const [isProfilePublic, setIsProfilePublic] = useState(false);

  const handleSave = () => {
    Alert.alert(
      'Settings Saved',
      isProfilePublic
        ? 'Your profile is now public to institution members.'
        : 'Your profile is now private.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FF" />
      
      {/* Background blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {/* Header */}
      <View style={styles.headerArea}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.backBtnWrap}>
            <View style={styles.backBtnShadow} />
            <View style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#2D8A5F" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardWrap}>
          <View style={styles.cardShadow} />
          <View style={styles.card}>
            <View style={styles.cardHighlight} />
            
            <Text style={styles.sectionTitle}>🔒 Privacy Controls</Text>
            
            <View style={styles.rowWrap}>
               <View style={styles.rowShadow} />
               <View style={styles.row}>
                  <View style={styles.labelCol}>
                    <Text style={styles.label}>Profile Visibility</Text>
                    <Text style={styles.subtext}>
                      {isProfilePublic ? 'Visible to others' : 'Only visible to you'}
                    </Text>
                  </View>
                  <Switch
                    value={isProfilePublic}
                    onValueChange={setIsProfilePublic}
                    thumbColor={isProfilePublic ? '#3DBF87' : '#FFD4E8'}
                    trackColor={{ false: '#EEF2F5', true: '#A8D8FF' }}
                  />
               </View>
            </View>

            <View style={styles.infoBubbleWrap}>
              <View style={styles.infoBubbleShadow} />
              <View style={styles.infoBubble}>
                <Feather name="info" size={16} color="#6B9A80" />
                <Text style={styles.note}>
                  {isProfilePublic
                    ? 'Your stats and trips will be visible on the leaderboard to other members.'
                    : 'Your identity stays hidden. You won\'t appear on global rankings.'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtnWrap} onPress={handleSave}>
          <View style={styles.saveBtnShadow} />
          <View style={styles.saveBtn}>
            <View style={styles.saveBtnHighlight} />
            <Text style={styles.saveBtnText}>Apply Settings ✅</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F4FF' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  blob1: { width: 250, height: 250, backgroundColor: '#D4C8F5', top: -100, left: -100 },
  blob2: { width: 200, height: 200, backgroundColor: '#C8EDDA', bottom: 100, right: -100 },

  headerArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, marginBottom: 10 },
  backBtnWrap: { position: 'relative' },
  backBtnShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#A8E6CF', borderRadius: 16, opacity: 0.6 },
  backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#2D4A30' },

  container: { padding: 24 },
  
  cardWrap: { position: 'relative', marginBottom: 28 },
  cardShadow: { position: 'absolute', top: 10, left: 10, right: -10, bottom: -10, backgroundColor: '#A8D8FF', borderRadius: 32, opacity: 0.5 },
  card: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, overflow: 'hidden' },
  cardHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(255,255,255,0.8)', borderTopLeftRadius: 32, borderTopRightRadius: 32 },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#2D4A30', marginBottom: 20 },
  
  rowWrap: { position: 'relative', marginBottom: 20 },
  rowShadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: '#F0FAFF', borderRadius: 20, opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FCFF', padding: 18, borderRadius: 20 },
  labelCol: { flex: 1 },
  label: { fontSize: 16, fontWeight: '800', color: '#2D4A30' },
  subtext: { fontSize: 12, color: '#8AB8A0', marginTop: 2, fontWeight: '700' },

  infoBubbleWrap: { position: 'relative' },
  infoBubbleShadow: { position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, backgroundColor: '#C8EDDA', borderRadius: 16, opacity: 0.5 },
  infoBubble: { flexDirection: 'row', gap: 10, backgroundColor: '#F0FAF5', padding: 16, borderRadius: 16 },
  note: { flex: 1, color: '#5A7A60', fontSize: 13, fontWeight: '600', lineHeight: 18 },

  saveBtnWrap: { position: 'relative' },
  saveBtnShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: '#6BCBA5', borderRadius: 22, opacity: 0.6 },
  saveBtn: { backgroundColor: '#3DBF87', paddingVertical: 18, alignItems: 'center', borderRadius: 22, overflow: 'hidden' },
  saveBtnHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 26, backgroundColor: 'rgba(255,255,255,0.3)', borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '900' },
});
