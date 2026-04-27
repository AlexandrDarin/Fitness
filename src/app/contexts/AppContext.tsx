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
  // Data
  users: User[];
  memberships: Membership[];
  trainings: Training[];
  bookings: Booking[];
  visits: Visit[];
  purchases: Purchase[];
  trainers: Trainer[];
  promotions: Promotion[];
  
  // Booking actions
  createBooking: (userId: string, trainingId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  
  // Training actions
  updateTrainingStatus: (trainingId: string, status: Training['status']) => void;
  markAttendance: (bookingId: string, attended: boolean) => Promise<boolean>;
  
  // Membership actions
  purchaseMembership: (userId: string, type: Membership['type']) => Promise<boolean>;
  
  // User actions
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<string>;
  deleteUser: (userId: string) => Promise<boolean>;
  toggleUserStatus: (userId: string) => Promise<boolean>;
  
  // Trainer actions
  updateTrainer: (trainerId: string, updates: Partial<Trainer>) => void;
  
  // Promotion actions
  createPromotion: (promotion: Omit<Promotion, 'id'>) => void;
  updatePromotion: (promotionId: string, updates: Partial<Promotion>) => void;
  deletePromotion: (promotionId: string) => void;
  
  // Helper functions
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

  // Booking actions
  const createBooking = useCallback(async (userId: string, trainingId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const training = trainings.find(t => t.id === trainingId);
        
        if (!training) {
          toast.error('Тренировка не найдена');
          resolve(false);
          return;
        }

        // Check if training has available spots
        if (training.bookedSpots >= training.maxSpots) {
          toast.error('Нет свободных мест');
          resolve(false);
          return;
        }

        // Check if user has active membership
        const userMembership = memberships.find(
          m => m.userId === userId && m.status === 'active'
        );

        if (!userMembership) {
          toast.error('У вас нет активного абонемента', {
            description: 'Для записи на тренировку необходимо приобрести абонемент',
          });
          resolve(false);
          return;
        }

        // Check membership validity
        const today = new Date();
        const validUntil = new Date(userMembership.validUntil);
        
        if (validUntil < today) {
          toast.error('Ваш абонемент истёк', {
            description: 'Продлите абонемент для записи на тренировки',
          });
          resolve(false);
          return;
        }

        // Check if user already has a booking
        const existingBooking = bookings.find(
          b => b.userId === userId && b.trainingId === trainingId && b.status === 'confirmed'
        );

        if (existingBooking) {
          toast.error('Вы уже записаны на эту тренировку');
          resolve(false);
          return;
        }

        // Check visits left for basic membership
        if (userMembership.type === 'basic' && userMembership.visitsLeft !== 'unlimited') {
          if (userMembership.visitsLeft <= 0) {
            toast.error('У вас закончились посещения', {
              description: 'Продлите абонемент или приобретите новый',
            });
            resolve(false);
            return;
          }
        }

        const newBooking: Booking = {
          id: `booking_${Date.now()}`,
          userId,
          trainingId,
          status: 'confirmed',
          bookedAt: new Date().toISOString(),
        };

        setBookings(prev => [...prev, newBooking]);
        setTrainings(prev => prev.map(t => 
          t.id === trainingId 
            ? { ...t, bookedSpots: t.bookedSpots + 1 }
            : t
        ));

        // Decrease visits for basic membership
        if (userMembership.type === 'basic' && userMembership.visitsLeft !== 'unlimited') {
          setMemberships(prev => prev.map(m => 
            m.id === userMembership.id
              ? { ...m, visitsLeft: (m.visitsLeft as number) - 1 }
              : m
          ));
        }

        toast.success('Вы успешно записаны на тренировку!');
        resolve(true);
      }, 800);
    });
  }, [trainings, bookings, memberships]);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) {
          toast.error('Бронирование не найдено');
          resolve(false);
          return;
        }

        setBookings(prev => prev.map(b => 
          b.id === bookingId 
            ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : b
        ));

        setTrainings(prev => prev.map(t => 
          t.id === booking.trainingId 
            ? { ...t, bookedSpots: Math.max(0, t.bookedSpots - 1) }
            : t
        ));

        toast.success('Запись отменена');
        resolve(true);
      }, 600);
    });
  }, [bookings]);

  // Training actions
  const updateTrainingStatus = useCallback((trainingId: string, status: Training['status']) => {
    setTrainings(prev => prev.map(t => 
      t.id === trainingId ? { ...t, status } : t
    ));
    
    const statusMessages = {
      scheduled: 'Тренировка запланирована',
      ongoing: 'Тренировка началась',
      completed: 'Тренировка завершена',
      cancelled: 'Тренировка отменена',
    };
    
    toast.success(statusMessages[status]);
  }, []);

  const markAttendance = useCallback(async (bookingId: string, attended: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) {
          resolve(false);
          return;
        }

        const newStatus = attended ? 'completed' : 'missed';
        
        setBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));

        if (attended) {
          const training = trainings.find(t => t.id === booking.trainingId);
          if (training) {
            const newVisit: Visit = {
              id: `visit_${Date.now()}`,
              userId: booking.userId,
              trainingId: booking.trainingId,
              date: training.date,
              time: training.time,
              activity: training.title,
              checkInTime: training.time,
            };
            setVisits(prev => [...prev, newVisit]);
          }
        }

        toast.success(attended ? 'Посещение отмечено' : 'Отсутствие отмечено');
        resolve(true);
      }, 500);
    });
  }, [bookings, trainings]);

  // Membership actions
  const purchaseMembership = useCallback(async (userId: string, type: Membership['type']): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prices = { basic: 4990, premium: 7990, vip: 14990 };
        const validFrom = new Date();
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);

        const newMembership: Membership = {
          id: `membership_${Date.now()}`,
          userId,
          type,
          validFrom: validFrom.toISOString().split('T')[0],
          validUntil: validUntil.toISOString().split('T')[0],
          visitsLeft: type === 'basic' ? 20 : 'unlimited',
          status: 'active',
          price: prices[type],
        };

        setMemberships(prev => [...prev, newMembership]);

        const newPurchase: Purchase = {
          id: `purchase_${Date.now()}`,
          userId,
          type: 'membership',
          itemId: newMembership.id,
          amount: prices[type],
          date: new Date().toISOString().split('T')[0],
          status: 'paid',
          paymentMethod: 'Банковская карта',
        };

        setPurchases(prev => [...prev, newPurchase]);

        toast.success('Абонемент успешно приобретён!');
        resolve(true);
      }, 1000);
    });
  }, []);

  // User actions
  const updateUser = useCallback(async (userId: string, updates: Partial<User>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, ...updates } : u
        ));
        
        toast.success('Профиль обновлён');
        resolve(true);
      }, 600);
    });
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        
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
        setUsers(prev => prev.map(u => {
          if (u.id === userId) {
            const newStatus = u.status === 'active' ? 'blocked' : 'active';
            toast.success(newStatus === 'active' ? 'Пользователь разблокирован' : 'Пользователь заблокирован');
            return { ...u, status: newStatus };
          }
          return u;
        }));
        resolve(true);
      }, 500);
    });
  }, []);

  // Trainer actions
  const updateTrainer = useCallback((trainerId: string, updates: Partial<Trainer>) => {
    setTrainers(prev => prev.map(t => 
      t.id === trainerId ? { ...t, ...updates } : t
    ));
    toast.success('Данные тренера обновлены');
  }, []);

  // Promotion actions
  const createPromotion = useCallback((promotion: Omit<Promotion, 'id'>) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo_${Date.now()}`,
    };
    setPromotions(prev => [...prev, newPromotion]);
    toast.success('Акция создана');
  }, []);

  const updatePromotion = useCallback((promotionId: string, updates: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => 
      p.id === promotionId ? { ...p, ...updates } : p
    ));
    toast.success('Акция обновлена');
  }, []);

  const deletePromotion = useCallback((promotionId: string) => {
    setPromotions(prev => prev.filter(p => p.id !== promotionId));
    toast.success('Акция удалена');
  }, []);

  // Helper functions
  const getUserBookings = useCallback((userId: string) => {
    return bookings.filter(b => b.userId === userId);
  }, [bookings]);

  const getUserMembership = useCallback((userId: string) => {
    return memberships.find(m => m.userId === userId && m.status === 'active');
  }, [memberships]);

  const getTrainingBookings = useCallback((trainingId: string) => {
    return bookings.filter(b => b.trainingId === trainingId);
  }, [bookings]);

  const getUserVisits = useCallback((userId: string) => {
    return visits.filter(v => v.userId === userId);
  }, [visits]);

  return (
    <AppContext.Provider
      value={{
        users,
        memberships,
        trainings,
        bookings,
        visits,
        purchases,
        trainers,
        promotions,
        createBooking,
        cancelBooking,
        updateTrainingStatus,
        markAttendance,
        purchaseMembership,
        updateUser,
        createUser,
        deleteUser,
        toggleUserStatus,
        updateTrainer,
        createPromotion,
        updatePromotion,
        deletePromotion,
        getUserBookings,
        getUserMembership,
        getTrainingBookings,
        getUserVisits,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}