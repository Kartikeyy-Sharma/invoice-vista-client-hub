
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    // Since the table might not exist yet, we'll mock a response
    console.log(`Attempted login with username: ${username}`);
    
    // Mock a user for demonstration purposes
    if (username === 'demo' && password === 'password') {
      const user: User = {
        id: 1001,
        username: 'demo',
        clientId: 1
      };
      
      // Store user in localStorage
      setCurrentUser(user);
      return user;
    }
    
    return null;
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
