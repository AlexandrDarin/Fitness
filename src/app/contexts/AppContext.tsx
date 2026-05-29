import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import {
  User,
  Membership,
  Training,
  Booking,
  Visit,
  Purchase,
  Trainer,
  Promotion,
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

const API_AUTH_URL = 'http://localhost:5005/api/auth';
const API_FITNESS_URL = 'http://localhost:5005/api/fitness';

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  
  // 👇 Список клиентов текущего тренера, загружаемый из БД
  const [trainerClientsList, setTrainerClientsList] = useState<User[]>([]);

  const formatDate = (dateVal: any) => {
    if (!dateVal) return '';
    try {
      return new Date(dateVal).toISOString().split('T')[0];
    } catch (e) {
      return String(dateVal).split('T')[0];
    }
  };

  // Загрузка пользователей
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_AUTH_URL}/users`);
      setUsers(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Загрузка тренеров
  const fetchTrainers = async () => {
    try {
      const response = await axios.get(`${API_FITNESS_URL}/trainers`);
      setTrainers(response.data.map((t: any) => ({
        id: String(t.id),
        name: t.name,
        email: t.email,
        phone: t.phone,
        specialization: t.specialization,
        experience: Number(t.experience),
        rating: Number(t.rating),
        bio: t.bio,
        status: t.status
      })));
    } catch (e) {
      console.error(e);
    }
  };

  // Загрузка акций
  const fetchPromotions = async () => {
    try {
      const response = await axios.get(`${API_FITNESS_URL}/promotions`);
      setPromotions(response.data.map((p: any) => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        discount: Number(p.discount),
        validFrom: formatDate(p.valid_from),
        validUntil: formatDate(p.valid_until),
        status: p.status
      })));
    } catch (e) {
      console.error(e);
    }
  };

  // Загрузка расписания
  const fetchTrainings = async () => {
    try {
      const res = await axios.get(`${API_FITNESS_URL}/trainings`);
      const formatted = res.data.map((t: any) => ({
        id: String(t.id),
        title: t.title,
        description: t.description,
        trainerId: String(t.trainer_id), // Убрали дефолтный 2, теперь ID полностью реальный
        trainerName: t.trainer_name,
        date: formatDate(t.date),
        time: t.time,
        duration: Number(t.duration),
        location: t.location,
        type: t.type,
        category: t.category,
        maxSpots: Number(t.max_spots),
        bookedSpots: Number(t.booked_spots),
        status: t.status,
        price: t.price ? Number(t.price) : undefined
      }));
      setTrainings(formatted);
    } catch (e) {
      console.error(e);
    }
  };

  // Загрузка клиентов конкретного тренера из БД
  const fetchTrainerClients = useCallback(async (trainerId: string) => {
    try {
      const response = await axios.get(`${API_FITNESS_URL}/trainers/${trainerId}/clients`);
      setTrainerClientsList(response.data);
    } catch (e) {
      console.error("Ошибка загрузки клиентов тренера", e);
    }
  }, []);

  // Загрузка данных активного юзера
  const loadUserData = useCallback(async () => {
    if (!user) return;
    try {
      // 1. Абонемент
      const mRes = await axios.get(`${API_FITNESS_URL}/membership?userId=${user.id}`);
      if (mRes.data) {
        const m = mRes.data;
        setMemberships([{
          id: String(m.id),
          userId: String(m.user_id),
          type: m.type,
          validFrom: formatDate(m.valid_from),
          validUntil: formatDate(m.valid_until),
          visitsLeft: m.visits_left === 'unlimited' ? 'unlimited' : Number(m.visits_left),
          status: m.status,
          price: Number(m.price)
        }]);
      } else {
        setMemberships([]);
      }

      // 2. Бронирования
      const bRes = await axios.get(`${API_FITNESS_URL}/bookings?userId=${user.id}`);
      setBookings(bRes.data.map((b: any) => ({
        id: String(b.id),
        userId: String(b.user_id),
        trainingId: String(b.training_id),
        status: b.status,
        bookedAt: b.booked_at
      })));

      // 3. Визиты (История)
      const vRes = await axios.get(`${API_FITNESS_URL}/visits?userId=${user.id}`);
      setVisits(vRes.data.map((v: any) => ({
        id: String(v.id),
        userId: String(v.user_id),
        trainingId: String(v.training_id),
        date: formatDate(v.date),
        time: v.time,
        activity: v.activity,
        checkInTime: v.check_in_time,
        checkOutTime: v.check_out_time
      })));

      // 4. Покупки
      const pRes = await axios.get(`${API_FITNESS_URL}/purchases?userId=${user.id}`);
      setPurchases(pRes.data.map((p: any) => ({
        id: String(p.id),
        userId: String(p.user_id),
        type: p.type,
        itemId: String(p.item_id),
        amount: Number(p.amount),
        date: formatDate(p.date),
        status: p.status,
        paymentMethod: p.payment_method
      })));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
    fetchTrainers();
    fetchPromotions();
    fetchTrainings();
  }, []);

  useEffect(() => {
    loadUserData();
    if (user && user.role === 'trainer') {
      fetchTrainerClients(user.id);
    }
  }, [user, loadUserData, fetchTrainerClients]);

  // Запись на занятие
  const createBooking = useCallback(async (userId: string, trainingId: string): Promise<boolean> => {
    try {
      await axios.post(`${API_FITNESS_URL}/bookings`, { userId, trainingId });
      toast.success('Вы записаны на тренировку!');
      fetchTrainings();
      loadUserData();
      return true;
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Ошибка записи');
      return false;
    }
  }, [loadUserData]);

  // Отмена записи
  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_FITNESS_URL}/bookings/${bookingId}`);
      toast.success('Запись успешно отменена');
      fetchTrainings();
      loadUserData();
      return true;
    } catch (e: any) {
      toast.error('Не удалось отменить запись');
      return false;
    }
  }, [loadUserData]);

  const updateTrainingStatus = useCallback((trainingId: string, status: Training['status']) => {
    setTrainings(prev => prev.map(t => t.id === trainingId ? { ...t, status } : t));
    const messages = { scheduled: 'Запланирована', ongoing: 'Началась', completed: 'Завершена', cancelled: 'Отменена' };
    toast.success(`Тренировка ${messages[status]}`);
  }, []);

  // Отметить посещение
  const markAttendance = useCallback(async (bookingId: string, attended: boolean): Promise<boolean> => {
    try {
      await axios.put(`${API_FITNESS_URL}/attendance`, { bookingId, attended });
      toast.success(attended ? 'Посещение успешно отмечено!' : 'Отсутствие успешно отмечено!');
      loadUserData();
      return true;
    } catch (e) {
      toast.error('Ошибка сохранения посещения');
      return false;
    }
  }, [loadUserData]);

  // Покупка абонемента
  const purchaseMembership = useCallback(async (userId: string, type: Membership['type']): Promise<boolean> => {
    try {
      await axios.post(`${API_FITNESS_URL}/membership`, { userId, type });
      toast.success('Абонемент успешно оформлен!');
      loadUserData();
      return true;
    } catch (e) {
      toast.error('Ошибка при покупке абонемента');
      return false;
    }
  }, [loadUserData]);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>): Promise<boolean> => {
    return new Promise(async (resolve) => {
      try {
        await axios.put(`${API_AUTH_URL}/profile`, { id: userId, ...updates });
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
        toast.success('Профиль обновлён');
        resolve(true);
      } catch (e) {
        toast.error('Ошибка при обновлении профиля');
        resolve(false);
      }
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

  // Удаление пользователя из БД администратором
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      try {
        await axios.delete(`${API_AUTH_URL}/profile/${userId}`);
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('Пользователь успешно удалён!');
        resolve(true);
      } catch (e) {
        toast.error('Ошибка при удалении');
        resolve(false);
      }
    });
  }, []);

  // Изменение статуса (блокировка) в БД администратором
  const toggleUserStatus = useCallback(async (userId: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      try {
        const res = await axios.put(`${API_AUTH_URL}/status`, { id: userId });
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: res.data.status } : u));
        toast.success('Статус пользователя успешно изменен!');
        resolve(true);
      } catch (e) {
        toast.error('Ошибка изменения статуса');
        resolve(false);
      }
    });
  }, []);

  // Добавление тренера
  const addTrainer = useCallback(async (trainerData: Omit<Trainer, 'id'>): Promise<string> => {
    try {
      const res = await axios.post(`${API_FITNESS_URL}/trainers`, trainerData);
      fetchTrainers();
      toast.success('Тренер успешно добавлен!');
      return String(res.data.id);
    } catch (e) {
      toast.error('Ошибка добавления тренера');
      return '';
    }
  }, []);

  const updateTrainer = useCallback(async (trainerId: string, updates: Partial<Trainer>): Promise<boolean> => {
    try {
      await axios.put(`${API_FITNESS_URL}/trainers/${trainerId}`, updates);
      fetchTrainers();
      toast.success('Данные тренера успешно обновлены!');
      return true;
    } catch (e) {
      toast.error('Ошибка редактирования');
      return false;
    }
  }, []);

  const deleteTrainer = useCallback(async (trainerId: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_FITNESS_URL}/trainers/${trainerId}`);
      fetchTrainers();
      toast.success('Тренер успешно удален!');
      return true;
    } catch (e) {
      toast.error('Ошибка удаления тренера');
      return false;
    }
  }, []);

  // Назначение клиента тренеру через БД
  const assignClientToTrainer = useCallback(async (trainerId: string, clientId: string): Promise<boolean> => {
    try {
      await axios.post(`${API_FITNESS_URL}/trainers/assign`, { trainerId, clientId });
      if (user && String(user.id) === String(trainerId)) {
        fetchTrainerClients(trainerId);
      }
      toast.success('Клиент успешно назначен тренеру!');
      return true;
    } catch (e) {
      toast.error('Ошибка назначения клиента');
      return false;
    }
  }, [user, fetchTrainerClients]);

  const getTrainerClients = useCallback((trainerId: string): User[] => {
    return trainerClientsList;
  }, [trainerClientsList]);

  const getClientTrainer = useCallback((clientId: string): Trainer | undefined => {
    return undefined; // Пока нет связи обратно
  }, []);

  // Создание тренировки через БД
  const addTraining = useCallback(async (trainingData: Omit<Training, 'id' | 'bookedSpots' | 'status'>): Promise<string> => {
    try {
      const res = await axios.post(`${API_FITNESS_URL}/trainings`, {
        title: trainingData.title,
        description: trainingData.description,
        trainerId: Number(trainingData.trainerId),
        trainerName: trainingData.trainerName,
        date: trainingData.date,
        time: trainingData.time,
        duration: trainingData.duration,
        location: trainingData.location,
        category: trainingData.category,
        maxSpots: trainingData.maxSpots
      });
      fetchTrainings();
      toast.success('Тренировка успешно создана!');
      return String(res.data.id);
    } catch (e) {
      toast.error('Ошибка создания тренировки');
      return '';
    }
  }, []);

  const updateTraining = useCallback(async (trainingId: string, updates: Partial<Training>): Promise<boolean> => {
    try {
      await axios.put(`${API_FITNESS_URL}/trainings/${trainingId}`, updates);
      fetchTrainings();
      toast.success('Данные тренировки успешно изменены!');
      return true;
    } catch (e) {
      toast.error('Ошибка изменения тренировки');
      return false;
    }
  }, []);

  const deleteTraining = useCallback(async (trainingId: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_FITNESS_URL}/trainings/${trainingId}`);
      fetchTrainings();
      toast.success('Тренировка успешно удалена!');
      return true;
    } catch (e) {
      toast.error('Ошибка удаления тренировки');
      return false;
    }
  }, []);

  const getTrainerTrainings = useCallback((trainerId: string): Training[] => {
    return trainings.filter(t => String(t.trainerId) === String(trainerId));
  }, [trainings]);

  // Создание акции
  const createPromotion = useCallback(async (promotion: Omit<Promotion, 'id'>) => {
    try {
      await axios.post(`${API_FITNESS_URL}/promotions`, {
        title: promotion.title,
        description: promotion.description,
        discount: promotion.discount,
        validFrom: promotion.validFrom,
        validUntil: promotion.validUntil
      });
      fetchPromotions();
      toast.success('Спецпредложение успешно добавлено!');
    } catch (e) {
      toast.error('Ошибка создания акции');
    }
  }, []);

  const updatePromotion = useCallback(async (promotionId: string, updates: Partial<Promotion>) => {
    try {
      await axios.put(`${API_FITNESS_URL}/promotions/${promotionId}`, {
        title: updates.title,
        description: updates.description,
        discount: updates.discount,
        validFrom: updates.validFrom,
        validUntil: updates.validUntil,
        status: updates.status
      });
      fetchPromotions();
      toast.success('Параметры акции успешно изменены!');
    } catch (e) {
      toast.error('Ошибка изменения акции');
    }
  }, []);

  const deletePromotion = useCallback(async (promotionId: string) => {
    try {
      await axios.delete(`${API_FITNESS_URL}/promotions/${promotionId}`);
      fetchPromotions();
      toast.success('Акция успешно удалена!');
    } catch (e) {
      toast.error('Ошибка удаления акции');
    }
  }, []);

  const getUserBookings = useCallback((userId: string) => bookings.filter(b => String(b.userId) === String(userId)), [bookings]);
  const getUserMembership = useCallback((userId: string) => memberships.find(m => String(m.userId) === String(userId) && m.status === 'active'), [memberships]);
  const getTrainingBookings = useCallback((trainingId: string) => bookings.filter(b => String(b.trainingId) === String(trainingId)), [bookings]);
  const getUserVisits = useCallback((userId: string) => visits.filter(v => String(v.userId) === String(userId)), [visits]);

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
