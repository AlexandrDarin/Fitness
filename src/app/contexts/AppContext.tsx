import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  User,
  Membership,
  Training,
  Booking,
  Visit,
  Purchase,
  Trainer,
  Promotion,
  mockUsers,
  mockMemberships,
  mockTrainings,
  mockBookings,
  mockVisits,
  mockPurchases,
  mockTrainers,
  mockPromotions,
} from '../lib/mockData';
import { toast } from 'sonner';

interface AppContextType {
  users: User[];
  memberships: Membership[];
  trainings: Training[];
  bookings: Booking[];
  visits: Visit[];
  purchases: Purchase[];
  trainers: Trainer[];
  promotions: Promotion[];
  
  createBooking: (userId: string, trainingId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  updateTrainingStatus: (trainingId: string, status: Training['status']) => void;
  markAttendance: (bookingId: string, attended: boolean) => Promise<boolean>;
  purchaseMembership: (userId: string, type: Membership['type']) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<string>;
  deleteUser: (userId: string) => Promise<boolean>;
  toggleUserStatus: (userId: string) => Promise<boolean>;
  
  addTrainer: (trainerData: Omit<Trainer, 'id'>) => Promise<string>;
  updateTrainer: (trainerId: string, updates: Partial<Trainer>) => Promise<boolean>;
  deleteTrainer: (trainerId: string) => Promise<boolean>;
  assignClientToTrainer: (trainerId: string, clientId: string) => Promise<boolean>;
  getTrainerClients: (trainerId: string) => User[];
  getClientTrainer: (clientId: string) => Trainer | undefined;
  
  addTraining: (trainingData: Omit<Training, 'id' | 'bookedSpots' | 'status'>) => Promise<string>;
  updateTraining: (trainingId: string, updates: Partial<Training>) => Promise<boolean>;
  deleteTraining: (trainingId: string) => Promise<boolean>;
  getTrainerTrainings: (trainerId: string) => Training[];
  
  createPromotion: (promotion: Omit<Promotion, 'id'>) => void;
  updatePromotion: (promotionId: string, updates: Partial<Promotion>) => void;
  deletePromotion: (promotionId: string) => void;
  
  getUserBookings: (userId: string) => Booking[];
  getUserMembership: (userId: string) => Membership | undefined;
  getTrainingBookings: (trainingId: string) => Booking[];
  getUserVisits: (userId: string) => Visit[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);
  const [trainings, setTrainings] = useState<Training[]>(mockTrainings);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  
  const [trainerClients, setTrainerClients] = useState<Record<string, string[]>>({
    '2': ['1', '6'],
    '3': ['1'],
    '4': ['6'],
  });

  const createBooking = useCallback(async (userId: string, trainingId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const training = trainings.find(t => t.id === trainingId);
        if (!training) { toast.error('Тренировка не найдена'); resolve(false); return; }
        if (training.bookedSpots >= training.maxSpots) { toast.error('Нет свободных мест'); resolve(false); return; }
        const userMembership = memberships.find(m => m.userId === userId && m.status === 'active');
        if (!userMembership) { toast.error('У вас нет активного абонемента'); resolve(false); return; }
        const existingBooking = bookings.find(b => b.userId === userId && b.trainingId === trainingId && b.status === 'confirmed');
        if (existingBooking) { toast.error('Вы уже записаны'); resolve(false); return; }
        const newBooking: Booking = { id: `booking_${Date.now()}`, userId, trainingId, status: 'confirmed', bookedAt: new Date().toISOString() };
        setBookings(prev => [...prev, newBooking]);
        setTrainings(prev => prev.map(t => t.id === trainingId ? { ...t, bookedSpots: t.bookedSpots + 1 } : t));
        toast.success('Вы записаны на тренировку!');
        resolve(true);
      }, 800);
    });
  }, [trainings, bookings, memberships]);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) { toast.error('Бронирование не найдено'); resolve(false); return; }
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } : b));
        setTrainings(prev => prev.map(t => t.id === booking.trainingId ? { ...t, bookedSpots: Math.max(0, t.bookedSpots - 1) } : t));
        toast.success('Запись отменена');
        resolve(true);
      }, 600);
    });
  }, [bookings]);

  const updateTrainingStatus = useCallback((trainingId: string, status: Training['status']) => {
    setTrainings(prev => prev.map(t => t.id === trainingId ? { ...t, status } : t));
    const messages = { scheduled: 'Запланирована', ongoing: 'Началась', completed: 'Завершена', cancelled: 'Отменена' };
    toast.success(`Тренировка ${messages[status]}`);
  }, []);

  const markAttendance = useCallback(async (bookingId: string, attended: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) { resolve(false); return; }
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: attended ? 'completed' : 'missed' } : b));
        if (attended) {
          const training = trainings.find(t => t.id === booking.trainingId);
          if (training) {
            const newVisit: Visit = { id: `visit_${Date.now()}`, userId: booking.userId, trainingId: booking.trainingId, date: training.date, time: training.time, activity: training.title, checkInTime: training.time };
            setVisits(prev => [...prev, newVisit]);
          }
        }
        toast.success(attended ? 'Посещение отмечено' : 'Отсутствие отмечено');
        resolve(true);
      }, 500);
    });
  }, [bookings, trainings]);

  const purchaseMembership = useCallback(async (userId: string, type: Membership['type']): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prices = { basic: 4990, premium: 7990, vip: 14990 };
        const validFrom = new Date();
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);
        const newMembership: Membership = { id: `membership_${Date.now()}`, userId, type, validFrom: validFrom.toISOString().split('T')[0], validUntil: validUntil.toISOString().split('T')[0], visitsLeft: type === 'basic' ? 20 : 'unlimited', status: 'active', price: prices[type] };
        setMemberships(prev => [...prev, newMembership]);
        toast.success('Абонемент приобретён!');
        resolve(true);
      }, 1000);
    });
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
        toast.success('Профиль обновлён');
        resolve(true);
      }, 600);
    });
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = { ...userData, id: `user_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
        setUsers(prev => [...prev, newUser]);
        toast.success('Пользователь создан');
        resolve(newUser.id);
      }, 700);
    });
  }, []);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('Пользователь удалён');
        resolve(true);
      }, 500);
    });
  }, []);

  const toggleUserStatus = useCallback(async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
        toast.success('Статус изменён');
        resolve(true);
      }, 500);
    });
  }, []);

  const addTrainer = useCallback(async (trainerData: Omit<Trainer, 'id'>): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrainer: Trainer = { ...trainerData, id: `trainer_${Date.now()}` };
        setTrainers(prev => [...prev, newTrainer]);
        toast.success('Тренер добавлен');
        resolve(newTrainer.id);
      }, 500);
    });
  }, []);

  const updateTrainer = useCallback(async (trainerId: string, updates: Partial<Trainer>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTrainers(prev => prev.map(t => t.id === trainerId ? { ...t, ...updates } : t));
        toast.success('Данные тренера обновлены');
        resolve(true);
      }, 500);
    });
  }, []);

  const deleteTrainer = useCallback(async (trainerId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTrainers(prev => prev.filter(t => t.id !== trainerId));
        toast.success('Тренер удалён');
        resolve(true);
      }, 500);
    });
  }, []);

  const assignClientToTrainer = useCallback(async (trainerId: string, clientId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTrainerClients(prev => ({ ...prev, [trainerId]: [...(prev[trainerId] || []), clientId] }));
        toast.success('Клиент назначен тренеру');
        resolve(true);
      }, 500);
    });
  }, []);

  const getTrainerClients = useCallback((trainerId: string): User[] => {
    const clientIds = trainerClients[trainerId] || [];
    return users.filter(u => clientIds.includes(u.id) && u.role === 'client');
  }, [users, trainerClients]);

  const getClientTrainer = useCallback((clientId: string): Trainer | undefined => {
    const trainerEntry = Object.entries(trainerClients).find(([_, clients]) => clients.includes(clientId));
    return trainerEntry ? trainers.find(t => t.id === trainerEntry[0]) : undefined;
  }, [trainerClients, trainers]);

  const addTraining = useCallback(async (trainingData: Omit<Training, 'id' | 'bookedSpots' | 'status'>): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTraining: Training = { ...trainingData, id: `training_${Date.now()}`, bookedSpots: 0, status: 'scheduled' };
        setTrainings(prev => [...prev, newTraining]);
        toast.success('Тренировка создана');
        resolve(newTraining.id);
      }, 500);
    });
  }, []);

  const updateTraining = useCallback(async (trainingId: string, updates: Partial<Training>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTrainings(prev => prev.map(t => t.id === trainingId ? { ...t, ...updates } : t));
        toast.success('Тренировка обновлена');
        resolve(true);
      }, 500);
    });
  }, []);

  const deleteTraining = useCallback(async (trainingId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTrainings(prev => prev.filter(t => t.id !== trainingId));
        toast.success('Тренировка удалена');
        resolve(true);
      }, 500);
    });
  }, []);

  const getTrainerTrainings = useCallback((trainerId: string): Training[] => {
    return trainings.filter(t => t.trainerId === trainerId);
  }, [trainings]);

  const createPromotion = useCallback((promotion: Omit<Promotion, 'id'>) => {
    const newPromotion: Promotion = { ...promotion, id: `promo_${Date.now()}` };
    setPromotions(prev => [...prev, newPromotion]);
    toast.success('Акция создана');
  }, []);

  const updatePromotion = useCallback((promotionId: string, updates: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === promotionId ? { ...p, ...updates } : p));
    toast.success('Акция обновлена');
  }, []);

  const deletePromotion = useCallback((promotionId: string) => {
    setPromotions(prev => prev.filter(p => p.id !== promotionId));
    toast.success('Акция удалена');
  }, []);

  const getUserBookings = useCallback((userId: string) => bookings.filter(b => b.userId === userId), [bookings]);
  const getUserMembership = useCallback((userId: string) => memberships.find(m => m.userId === userId && m.status === 'active'), [memberships]);
  const getTrainingBookings = useCallback((trainingId: string) => bookings.filter(b => b.trainingId === trainingId), [bookings]);
  const getUserVisits = useCallback((userId: string) => visits.filter(v => v.userId === userId), [visits]);

  return (
    <AppContext.Provider value={{
      users, memberships, trainings, bookings, visits, purchases, trainers, promotions,
      createBooking, cancelBooking, updateTrainingStatus, markAttendance, purchaseMembership,
      updateUser, createUser, deleteUser, toggleUserStatus,
      addTrainer, updateTrainer, deleteTrainer, assignClientToTrainer, getTrainerClients, getClientTrainer,
      addTraining, updateTraining, deleteTraining, getTrainerTrainings,
      createPromotion, updatePromotion, deletePromotion,
      getUserBookings, getUserMembership, getTrainingBookings, getUserVisits,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}