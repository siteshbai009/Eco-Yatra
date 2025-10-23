import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    console.log('Signup button pressed'); // Debug log
    
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill Name, Email and Password');
      return;
    }

    setLoading(true);
    console.log('Form data:', formData); // Debug log
    
    try {
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        role: formData.role || 'Student',
        department: formData.department || 'General',
        password: formData.password,
      };
      
      console.log('Saving user data:', userData); // Debug log
      
      await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');
      
      console.log('Data saved successfully'); // Debug log
      
      Alert.alert('Success', 'Account created successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            console.log('Navigating to tabs'); // Debug log
            router.replace('/(tabs)');
          } 
        }
      ]);
    } catch (error) {
      console.log('Signup error:', error); // Debug log
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join GIET Grievance Portal</Text>

        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#64748B" />
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#64748B" />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="briefcase" size={20} color="#64748B" />
          <TextInput
            style={styles.input}
            placeholder="Role (Student/Faculty/Staff)"
            value={formData.role}
            onChangeText={(text) => setFormData({...formData, role: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="home" size={20} color="#64748B" />
          <TextInput
            style={styles.input}
            placeholder="Department"
            value={formData.department}
            onChangeText={(text) => setFormData({...formData, department: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#64748B" />
          <TextInput
            style={styles.input}
            placeholder="Password *"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.signupButton, loading && styles.buttonDisabled]} 
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  signupButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 30,
  },
});
