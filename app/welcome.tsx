import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E6FD9" />
      
      {/* Blue Header Background */}
      <View style={styles.headerBackground} />
      
      <View style={styles.content}>
        {/* White Card Container */}
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Content */}
          <Text style={styles.title}>Welcome to GIET{'\n'}Grievance</Text>
          <Text style={styles.description}>
            Your official platform to voice concerns, report issues, and contribute to a better campus environment. Your feedback is valuable.
          </Text>

          {/* Illustration placeholder */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationBox}>
              <Text style={styles.illustrationEmoji}>📢</Text>
              <Text style={styles.illustrationText}>
                Submit • Track • Resolve
              </Text>
            </View>
          </View>
        </View>

        {/* Get Started Button - Outside the card */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E6FD9',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#1E6FD9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  illustrationBox: {
    width: '100%',
    paddingVertical: 32,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
  },
  illustrationEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  illustrationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0284C7',
    letterSpacing: 1,
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedButtonText: {
    color: '#1E6FD9',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
