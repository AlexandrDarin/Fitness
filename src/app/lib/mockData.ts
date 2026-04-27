// Моковые данные для всей платформы

export type UserRole = 'client' | 'trainer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole | null;
  avatar?: string;
  dateOfBirth?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'blocked';
}

export interface Membership {
  id: string;
  userId: string;
  type: 'basic' | 'premium' | 'vip';
  validFrom: string;
  validUntil: string;
  visitsLeft: number | 'unlimited';
  status: 'active' | 'expired' | 'frozen';
  price: number;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  date: string;
  time: string;
  duration: number; // в минутах
  location: string;
  type: 'group' | 'personal';
  category: string;
  maxSpots: number;
  bookedSpots: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  price?: number;
}

export interface Booking {
  id: string;
  userId: string;
  trainingId: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'missed';
  bookedAt: string;
  cancelledAt?: string;
  notes?: string;
}

export interface Visit {
  id: string;
  userId: string;
  trainingId?: string;
  date: string;
  time: string;
  activity: string;
  checkInTime: string;
  checkOutTime?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  type: 'membership' | 'personal_training' | 'group_training';
  itemId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  paymentMethod: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string[];
  experience: number;
  rating: number;
  avatar?: string;
  bio: string;
  status: 'active' | 'inactive';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  validFrom: string;
  validUntil: string;
  status: 'active' | 'expired';
  image?: string;
}

// Моковые пользователи
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 (495) 123-45-67',
    role: 'client',
    dateOfBirth: '1990-03-15',
    createdAt: '2025-01-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'Мария Петрова',
    email: 'maria@example.com',
    phone: '+7 (495) 234-56-78',
    role: 'trainer',
    createdAt: '2024-06-15',
    status: 'active',
  },
  {
    id: '3',
    name: 'Алексей Смирнов',
    email: 'alex@example.com',
    phone: '+7 (495) 345-67-89',
    role: 'trainer',
    createdAt: '2024-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Елена Волкова',
    email: 'elena@example.com',
    phone: '+7 (495) 456-78-90',
    role: 'trainer',
    createdAt: '2024-08-20',
    status: 'active',
  },
  {
    id: '5',
    name: 'Администратор Системы',
    email: 'admin@ecofitness.com',
    phone: '+7 (495) 100-00-00',
    role: 'admin',
    createdAt: '2024-01-01',
    status: 'active',
  },
  {
    id: '6',
    name: 'Анна Соколова',
    email: 'anna@example.com',
    phone: '+7 (495) 567-89-01',
    role: 'client',
    dateOfBirth: '1992-07-22',
    createdAt: '2025-02-15',
    status: 'active',
  },
];

// Моковые тренеры
export const mockTrainers: Trainer[] = [
  {
    id: '2',
    name: 'Мария Петрова',
    email: 'maria@example.com',
    phone: '+7 (495) 234-56-78',
    specialization: ['Функциональный тренинг', 'HIIT', 'Кроссфит'],
    experience: 8,
    rating: 4.9,
    bio: 'Мастер спорта по лёгкой атлетике. Специализируюсь на функциональном тренинге и высокоинтенсивных тренировках.',
    status: 'active',
  },
  {
    id: '3',
    name: 'Алексей Смирнов',
    email: 'alex@example.com',
    phone: '+7 (495) 345-67-89',
    specialization: ['Силовой тренинг', 'Бодибилдинг', 'Пауэрлифтинг'],
    experience: 12,
    rating: 4.8,
    bio: 'Кандидат в мастера спорта по пауэрлифтингу. Помогу достичь максимальных результатов в силовых тренировках.',
    status: 'active',
  },
  {
    id: '4',
    name: 'Елена Волкова',
    email: 'elena@example.com',
    phone: '+7 (495) 456-78-90',
    specialization: ['Йога', 'Пилатес', 'Растяжка'],
    experience: 10,
    rating: 5.0,
    bio: 'Сертифицированный инструктор по йоге и пилатесу. Практикую более 15 лет.',
    status: 'active',
  },
];

// Моковые абонементы
export const mockMemberships: Membership[] = [
  {
    id: '1',
    userId: '1',
    type: 'premium',
    validFrom: '2026-03-01',
    validUntil: '2026-05-31',
    visitsLeft: 'unlimited',
    status: 'active',
    price: 7990,
  },
  {
    id: '2',
    userId: '6',
    type: 'basic',
    validFrom: '2026-02-15',
    validUntil: '2026-04-15',
    visitsLeft: 20,
    status: 'active',
    price: 4990,
  },
];

// Моковые тренировки
export const mockTrainings: Training[] = [
  {
    id: '1',
    title: 'Функциональный тренинг',
    description: 'Комплексная тренировка для развития силы, выносливости и координации.',
    trainerId: '2',
    trainerName: 'Мария Петрова',
    date: '2026-04-02',
    time: '18:00',
    duration: 60,
    location: 'Групповой зал',
    type: 'group',
    category: 'Функциональный тренинг',
    maxSpots: 15,
    bookedSpots: 12,
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Персональная тренировка',
    description: 'Индивидуальная работа с тренером по вашим целям.',
    trainerId: '3',
    trainerName: 'Алексей Смирнов',
    date: '2026-04-02',
    time: '10:00',
    duration: 60,
    location: 'Тренажёрный зал',
    type: 'personal',
    category: 'Силовой тренинг',
    maxSpots: 1,
    bookedSpots: 1,
    status: 'scheduled',
    price: 3000,
  },
  {
    id: '3',
    title: 'Йога',
    description: 'Практика асан для гибкости, баланса и внутренней гармонии.',
    trainerId: '4',
    trainerName: 'Елена Волкова',
    date: '2026-04-03',
    time: '19:00',
    duration: 90,
    location: 'Зал йоги',
    type: 'group',
    category: 'Йога',
    maxSpots: 20,
    bookedSpots: 16,
    status: 'scheduled',
  },
  {
    id: '4',
    title: 'HIIT тренировка',
    description: 'Высокоинтенсивная интервальная тренировка для жиросжигания.',
    trainerId: '2',
    trainerName: 'Мария Петрова',
    date: '2026-04-04',
    time: '17:00',
    duration: 45,
    location: 'Групповой зал',
    type: 'group',
    category: 'HIIT',
    maxSpots: 15,
    bookedSpots: 13,
    status: 'scheduled',
  },
  {
    id: '5',
    title: 'Утренняя йога',
    description: 'Мягкая практика для бодрого начала дня.',
    trainerId: '4',
    trainerName: 'Елена Волкова',
    date: '2026-04-03',
    time: '07:00',
    duration: 60,
    location: 'Зал йоги',
    type: 'group',
    category: 'Йога',
    maxSpots: 12,
    bookedSpots: 7,
    status: 'scheduled',
  },
  {
    id: '6',
    title: 'Силовая тренировка',
    description: 'Работа с большими весами для набора мышечной массы.',
    trainerId: '3',
    trainerName: 'Алексей Смирнов',
    date: '2026-04-03',
    time: '11:00',
    duration: 90,
    location: 'Тренажёрный зал',
    type: 'group',
    category: 'Силовой тренинг',
    maxSpots: 10,
    bookedSpots: 7,
    status: 'scheduled',
  },
  {
    id: '7',
    title: 'Вечерняя растяжка',
    description: 'Расслабляющая растяжка после рабочего дня.',
    trainerId: '4',
    trainerName: 'Елена Волкова',
    date: '2026-04-03',
    time: '20:00',
    duration: 60,
    location: 'Зал йоги',
    type: 'group',
    category: 'Растяжка',
    maxSpots: 15,
    bookedSpots: 11,
    status: 'scheduled',
  },
];

// Моковые бронирования
export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    trainingId: '1',
    status: 'confirmed',
    bookedAt: '2026-03-25T10:00:00',
  },
  {
    id: '2',
    userId: '1',
    trainingId: '2',
    status: 'confirmed',
    bookedAt: '2026-03-26T14:30:00',
  },
  {
    id: '3',
    userId: '1',
    trainingId: '3',
    status: 'confirmed',
    bookedAt: '2026-03-27T09:15:00',
  },
  {
    id: '4',
    userId: '1',
    trainingId: '4',
    status: 'confirmed',
    bookedAt: '2026-03-28T11:45:00',
  },
];

// Моковые посещения
export const mockVisits: Visit[] = [
  {
    id: '1',
    userId: '1',
    date: '2026-03-31',
    time: '18:00',
    activity: 'Функциональный тренинг',
    checkInTime: '17:55',
    checkOutTime: '19:10',
  },
  {
    id: '2',
    userId: '1',
    date: '2026-03-30',
    time: '10:30',
    activity: 'Тренажёрный зал',
    checkInTime: '10:25',
    checkOutTime: '12:00',
  },
  {
    id: '3',
    userId: '1',
    date: '2026-03-29',
    time: '19:00',
    activity: 'Йога',
    checkInTime: '18:55',
    checkOutTime: '20:30',
  },
  {
    id: '4',
    userId: '1',
    date: '2026-03-28',
    time: '17:00',
    activity: 'HIIT тренировка',
    checkInTime: '16:58',
    checkOutTime: '18:00',
  },
  {
    id: '5',
    userId: '1',
    date: '2026-03-27',
    time: '20:00',
    activity: 'Бассейн',
    checkInTime: '20:05',
    checkOutTime: '21:15',
  },
];

// Моковые покупки
export const mockPurchases: Purchase[] = [
  {
    id: '1',
    userId: '1',
    type: 'membership',
    itemId: '1',
    amount: 7990,
    date: '2026-03-01',
    status: 'paid',
    paymentMethod: 'Банковская карта',
  },
  {
    id: '2',
    userId: '1',
    type: 'personal_training',
    itemId: '2',
    amount: 12000,
    date: '2026-02-15',
    status: 'paid',
    paymentMethod: 'Банковская карта',
  },
];

// Моковые акции
export const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Весенняя скидка 20%',
    description: 'Скидка 20% на все абонементы при покупке до конца апреля',
    discount: 20,
    validFrom: '2026-04-01',
    validUntil: '2026-04-30',
    status: 'active',
  },
  {
    id: '2',
    title: 'Приведи друга',
    description: 'Приведи друга и получите оба скидку 15% на следующий месяц',
    discount: 15,
    validFrom: '2026-04-01',
    validUntil: '2026-12-31',
    status: 'active',
  },
];

// Типы абонементов
export const membershipTypes = [
  {
    type: 'basic',
    name: 'Базовый',
    price: 4990,
    duration: 30,
    features: [
      'Тренажёрный зал',
      'Групповые занятия (8 в месяц)',
      'Раздевалки и душевые',
    ],
  },
  {
    type: 'premium',
    name: 'Премиум',
    price: 7990,
    duration: 30,
    features: [
      'Тренажёрный зал (безлимит)',
      'Групповые занятия (безлимит)',
      'Бассейн',
      'Сауна',
      'Скидка 10% на персональные тренировки',
    ],
  },
  {
    type: 'vip',
    name: 'VIP',
    price: 14990,
    duration: 30,
    features: [
      'Все возможности Премиум',
      '4 персональные тренировки в месяц',
      'Индивидуальная программа питания',
      'Приоритетная запись',
      'Персональный шкафчик',
      'Гостевые визиты (2 в месяц)',
    ],
  },
];
