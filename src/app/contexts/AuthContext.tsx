import { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from '../lib/mockData';
import { toast } from 'sonner';

type UserRole = 'client' | 'trainer' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find user in mock data
        const foundUser = mockUsers.find(u => u.email === email);
        
        if (!foundUser) {
          toast.error('Неверный email или пароль');
          setIsLoading(false);
          resolve(false);
          return;
        }

        // Mock password validation (in real app, this would be handled by backend)
        if (password.length < 6) {
          toast.error('Неверный email или пароль');
          setIsLoading(false);
          resolve(false);
          return;
        }

        const mockUser: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: null, // Role will be selected later
          phone: foundUser.phone,
        };
        
        setUser(mockUser);
        setIsLoading(false);
        toast.success(`Добро пожаловать, ${foundUser.name}!`);
        resolve(true);
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
          toast.error('Пользователь с таким email уже существует');
          setIsLoading(false);
          resolve(false);
          return;
        }

        // Validate password
        if (password.length < 6) {
          toast.error('Пароль должен содержать минимум 6 символов');
          setIsLoading(false);
          resolve(false);
          return;
        }

        const newUser: User = {
          id: `user_${Date.now()}`,
          name,
          email,
          role: null,
        };
        
        setUser(newUser);
        setIsLoading(false);
        toast.success('Регистрация успешна!');
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    toast.success('Вы вышли из системы');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}