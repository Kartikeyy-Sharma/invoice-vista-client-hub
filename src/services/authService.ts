
import { User } from '../types';

// Mock database for users
const users = [
  { id: 1, username: 'client1', password: 'password1', clientId: 1 },
  { id: 2, username: 'client2', password: 'password2', clientId: 2 },
];

export const login = async (username: string, password: string): Promise<User | null> => {
  // In a real app, you would hash passwords and check against the database
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
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

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};
