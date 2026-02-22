import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://oidhhoakywgkwtqckroe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZGhob2FreXdna3d0cWNrcm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzIzMDYsImV4cCI6MjA3ODA0ODMwNn0.dxUr-r_8yjh-t74c3M0QW8EoFQGeIBY-YsdtOyzUDR4';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

// Export a mock object to prevent crashes if I missed any imports
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
        order: async () => ({ data: [], error: null }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ error: null }),
    }),
  }),
} as any;
