import React from 'react';
import { View, Text, SafeAreaView, StatusBar, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function HelpSupport() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Help & Support</Text>
        <Text style={styles.subTitle}>Frequently Asked Questions (FAQs)</Text>

        {/* General FAQs */}
        <Text style={styles.sectionHeader}>General</Text>
        <Text style={styles.itemTitle}>What is the Grievance Redressal Portal?</Text>
        <Text style={styles.itemDesc}>It’s an online platform where students, faculty, and staff can raise issues, complaints, or feedback and get them resolved efficiently.</Text>

        <Text style={styles.itemTitle}>Who can use this portal?</Text>
        <Text style={styles.itemDesc}>The portal is open to all students, faculty, and staff members of the institution.</Text>

        <Text style={styles.itemTitle}>Is my complaint confidential?</Text>
        <Text style={styles.itemDesc}>Yes, all grievances are kept strictly confidential and accessible only to authorized officials.</Text>

        <Text style={styles.itemTitle}>Can I submit a grievance anonymously?</Text>
        <Text style={styles.itemDesc}>Yes, users can choose to submit grievances anonymously. However, anonymous complaints may take longer to verify.</Text>

        <Text style={styles.itemTitle}>What types of grievances can I report?</Text>
        <Text style={styles.itemDesc}>You can report issues related to academics, administration, infrastructure, staff behavior, harassment, or any other institutional concern.</Text>

        {/* Process-Related FAQs */}
        <Text style={styles.sectionHeader}>Process</Text>
        <Text style={styles.itemTitle}>How do I submit a grievance?</Text>
        <Text style={styles.itemDesc}>Log in to the portal, click “Submit Grievance,” fill in the details, and submit.</Text>

        <Text style={styles.itemTitle}>Can I track the status of my grievance?</Text>
        <Text style={styles.itemDesc}>Yes, once submitted, you can view your grievance status and updates on your dashboard.</Text>

        <Text style={styles.itemTitle}>How long does it take to resolve a grievance?</Text>
        <Text style={styles.itemDesc}>The time varies based on the type and severity of the issue, but every grievance is addressed as soon as possible.</Text>

        <Text style={styles.itemTitle}>What happens after I submit my grievance?</Text>
        <Text style={styles.itemDesc}>It is forwarded to the concerned authority or department for review and resolution. You’ll be notified when there’s an update.</Text>

        <Text style={styles.itemTitle}>Can I edit or withdraw my grievance after submission?</Text>
        <Text style={styles.itemDesc}>You can withdraw it if it hasn’t been processed yet. Editing depends on admin permissions.</Text>

        {/* Technical FAQs */}
        <Text style={styles.sectionHeader}>Technical</Text>
        <Text style={styles.itemTitle}>I can’t log in or forgot my password — what should I do?</Text>
        <Text style={styles.itemDesc}>Use the “Forgot Password” option or contact the portal admin for help.</Text>

        <Text style={styles.itemTitle}>Why am I not receiving status updates?</Text>
        <Text style={styles.itemDesc}>Ensure notifications are enabled and your email ID or phone number is correct in your profile.</Text>

        <Text style={styles.itemTitle}>Which browsers or devices are supported?</Text>
        <Text style={styles.itemDesc}>The portal works best on modern browsers like Chrome, Edge, and Safari on both desktop and mobile.</Text>

        {/* Feedback & Support FAQs */}
        <Text style={styles.sectionHeader}>Feedback & Support</Text>
        <Text style={styles.itemTitle}>Can I give feedback or suggestions about the portal?</Text>
        <Text style={styles.itemDesc}>Yes, you can share feedback using the “Feedback” option on the home page.</Text>

        <Text style={styles.itemTitle}>Whom should I contact for help?</Text>
        <Text style={styles.itemDesc}>
          You can reach the support team via the “Contact Us” section or email the grievance cell directly.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@email.com')}>
          <Text style={styles.emailLink}>Email support@email.com</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  subTitle: { fontSize: 16, color: '#6366F1', marginBottom: 16, fontWeight: 'bold' },
  sectionHeader: { fontSize: 17, fontWeight: '700', color: '#6366F1', marginTop: 18, marginBottom: 10 },
  itemTitle: { fontWeight: '600', fontSize: 15, color: '#1E293B', marginTop: 10 },
  itemDesc: { color: '#64748B', fontSize: 14, marginTop: 2 },
  emailLink: { color: '#10B981', fontSize: 14, marginTop: 2, marginBottom: 12, fontWeight: 'bold' },
});
