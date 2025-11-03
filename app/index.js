import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const userProfile = await AsyncStorage.getItem('userProfile');
      
      if (isLoggedIn === 'true' && userProfile) {
        // User is logged in, go directly to main app
        console.log('User is logged in, redirecting to tabs');
        setRoute('/(tabs)');
      } else {
        // User is not logged in, show splash screen
        console.log('User is not logged in, showing splash screen');
        setRoute('/splashscreen');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setRoute('/splashscreen');
    }
  };

  // Show loading state while checking
  if (route === null) {
    return null;
  }

  return <Redirect href={route} />;
}
