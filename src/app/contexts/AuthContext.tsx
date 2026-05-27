import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

type UserRole = 'client' | 'trainer' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  weight?: number; // 👇 Добавили вес
  height?: number; // 👇 Добавили рост
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name: string; email: string; phone: string; weight?: number; height?: number }) => Promise<boolean>; // 👇 Обновили метод
  deleteProfile: () => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5005/api/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fitness_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      parsedUser.role = null; 
      return parsedUser;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (password.length < 6) {
        toast.error('Пароль слишком короткий');
        return false;
      }

      const response = await axios.post(`${API_URL}/login`, { email, password });
      const realUser = response.data;
      realUser.role = null; 

      setUser(realUser);
      localStorage.setItem('fitness_user', JSON.stringify(realUser));
      toast.success(`Добро пожаловать, ${realUser.name}!`);
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Неверный email или пароль');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (password.length < 6) {
        toast.error('Пароль должен содержать минимум 6 символов');
        return false;
      }

      const response = await axios.post(`${API_URL}/register`, { 
        name, 
        email, 
        password, 
        phone,
        role: 'client' 
      });
      const newUser = response.data;
      newUser.role = null;

      setUser(newUser);
      localStorage.setItem('fitness_user', JSON.stringify(newUser));
      toast.success('Регистрация успешна!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка регистрации');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name: string; email: string; phone: string; weight?: number; height?: number }) => {
    if (!user) return false;
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_URL}/profile`, { ...data, id: user.id });
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('fitness_user', JSON.stringify(updatedUser));
      toast.success('Профиль успешно обновлен!');
      return true;
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfile = async () => {
    if (!user) return false;
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/profile/${user.id}`);
      logout();
      toast.success('Аккаунт успешно удален!');
      return true;
    } catch (error) {
      toast.error('Ошибка при удалении профиля');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitness_user');
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
        updateProfile,
        deleteProfile,
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
