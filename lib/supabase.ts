import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfgvinaslrmofqkeixxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZ3ZpbmFzbHJtb2Zxa2VpeHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTY5ODYsImV4cCI6MjA3Nzg5Mjk4Nn0.DqkDmXligsrXhf16iWJBjSqmIvN1X2SdJCUj0iBjLgE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
