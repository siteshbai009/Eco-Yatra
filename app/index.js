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
      setRoute('/welcome');
    } catch (error) {
      console.error('Error:', error);
      setRoute('/welcome');
    }
  };

  if (route === null) {
    return null;
  }

  return <Redirect href={route} />;
}
