import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    clearAndCheck();
  }, []);

  // TEMPORARY - Remove this after testing
  const clearAndCheck = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('userProfile');
      console.log('Storage cleared for testing');
      setRoute('/splashscreen');  // Changed from '/welcome' to '/splashscreen'
    } catch (error) {
      console.error('Error:', error);
      setRoute('/splashscreen');  // Changed from '/welcome' to '/splashscreen'
    }
  };

  if (route === null) {
    return null;
  }

  return <Redirect href={route} />;
}
