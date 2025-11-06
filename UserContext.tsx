import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

interface User {
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  updateUser: (userData: Partial<User>) => void;
  greeting: string;
  logout: () => Promise<void>;
}

const defaultUser: User = {
  name: 'Student Name',
  email: 'student@giet.edu',
  role: 'Student',
  department: 'Computer Science',
  avatar: 'SN'
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  updateUser: () => {},
  greeting: 'Good Morning',
  logout: async () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  const updateUser = (userData: Partial<User>): void => {
    const newUser = { ...user, ...userData };
    setUser(newUser);
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('userProfile');
      await AsyncStorage.removeItem('isLoggedIn');
      setUser(defaultUser);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  };

  const updateGreeting = (): void => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userWithInitials = {
    ...user,
    avatar: getInitials(user.name)
  };

  return (
    <UserContext.Provider value={{ 
      user: userWithInitials, 
      updateUser, 
      greeting, 
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};
