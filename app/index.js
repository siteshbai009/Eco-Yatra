import { Redirect } from 'expo-router';

export default function Index() {
  // Always redirect to tabs for now - we'll handle auth in individual screens
  return <Redirect href="/(tabs)" />;
}

