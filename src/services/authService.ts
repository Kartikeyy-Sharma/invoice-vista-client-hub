
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, client_id')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      console.error('Login error:', error);
      return null;
    }

    const user: User = {
      id: data.id,
      username: data.username,
      clientId: data.client_id
    };
    
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username);

    if (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
    
    // Username is available if no records found
    return data.length === 0;
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  }
  return null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('currentUser');
};
