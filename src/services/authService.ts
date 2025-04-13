
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    // First, we need to find the user's email by username from our profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, client_id')
      .eq('username', username)
      .single();
    
    if (profileError || !profileData) {
      console.error('Error fetching profile:', profileError);
      return null;
    }
    
    return {
      id: parseInt(profileData.id.toString().substring(0, 8), 16), // Convert UUID to a number for compatibility
      username: profileData.username,
      clientId: profileData.client_id
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('currentUser');
};
