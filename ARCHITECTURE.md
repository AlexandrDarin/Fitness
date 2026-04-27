# ECO FITNESS - Архитектура системы

## Обзор

Полнофункциональная SPA для управления премиальным фитнес-клубом с тремя ролями пользователей.

## Технологический стек

- **React 18.3.1** - UI библиотека
- **TypeScript** - типизация
- **React Router 7** - маршрутизация с защитой по ролям
- **Tailwind CSS v4** - стилизация
- **Radix UI** - компоненты UI
- **date-fns** - работа с датами
- **Lucide React** - иконки
- **Sonner** - toast уведомления

## Структура проекта

```
src/app/
├── components/
│   ├── modals/              # Модальные окна
│   │   ├── BookingModal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── EditProfileModal.tsx
│   │   └── PurchaseMembershipModal.tsx
│   ├── shared/              # Общие компоненты
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   └── StatusBadge.tsx
│   ├── ui/                  # UI компоненты (Radix + Tailwind)
│   ├── Header.tsx           # Главный хедер
│   ├── Footer.tsx
│   └── ProtectedRoute.tsx   # HOC для защиты маршрутов
├── contexts/
│   ├── AuthContext.tsx      # Аутентификация и авторизация
│   └── AppContext.tsx       # Глобальное состояние и бизнес-логика
├── lib/
│   └── mockData.ts          # Моковые данные
├── pages/
│   ├── Home.tsx             # Главная страница
│   ├── Login.tsx            # Вход
│   ├── Register.tsx         # Регистрация
│   ├── RoleSelect.tsx       # Выбор роли
│   ├── ClientDashboard.tsx  # Кабинет клиента
│   ├── TrainerDashboard.tsx # Кабинет тренера
│   └── AdminDashboard.tsx   # Админ панель
├── App.tsx                  # Корневой компонент
└── routes.tsx               # Конфигурация маршрутов
```

## Контексты

### AuthContext

**Назначение:** Управление аутентификацией и авторизацией

**Состояние:**
- `user` - текущий пользователь
- `isAuthenticated` - статус авторизации
- `isLoading` - состояние загрузки

**Методы:**
- `login(email, password)` - вход в систему
- `register(name, email, password)` - регистрация
- `logout()` - выход
- `setUser(user)` - установка пользователя и роли

**Валидация:**
- Проверка email в базе пользователей
- Минимум 6 символов в пароле
- Проверка на дубликаты при регистрации

### AppContext

**Назначение:** Глобальное управление данными и бизнес-логикой

**Состояние:**
- `users` - все пользователи
- `trainings` - все тренировки
- `bookings` - все бронирования
- `memberships` - все абонементы
- `visits` - история посещений
- `trainers` - тренерский состав
- `promotions` - акции

**Методы:**

*Бронирование:*
- `createBooking(userId, trainingId)` - создание записи
- `cancelBooking(bookingId)` - отмена записи

*Тренировки:*
- `updateTrainingStatus(trainingId, status)` - изменение статуса
- `markAttendance(bookingId, attended)` - отметка посещения

*Абонементы:*
- `purchaseMembership(userId, type)` - покупка

*Пользователи:*
- `updateUser(userId, updates)` - обновление
- `createUser(userData)` - создание
- `deleteUser(userId)` - удаление
- `toggleUserStatus(userId)` - блокировка/разблокировка

*Helper функции:*
- `getUserBookings(userId)` - записи пользователя
- `getUserMembership(userId)` - активный абонемент
- `getTrainingBookings(trainingId)` - участники тренировки
- `getUserVisits(userId)` - история посещений

## Бизнес-логика

### Валидация записи на тренировку

```typescript
1. Проверка существования тренировки
2. Проверка свободных мест
3. Проверка активного абонемента
4. Проверка срока действия абонемента
5. Проверка на дубли (повторная запись)
6. Проверка посещений (для базового абонемента)
7. Создание записи
8. Уменьшение мест и посещений
```

### Отмена записи

```typescript
1. Проверка существования записи
2. Изменение статуса на 'cancelled'
3. Освобождение места
4. Уведомление пользователя
```

### Покупка абонемента

```typescript
1. Создание абонемента
2. Создание платёжной записи
3. Активация абонемента
4. Уведомление
```

### Отметка посещения

```typescript
1. Изменение статуса записи (completed/missed)
2. Создание записи в истории визитов (если attended)
3. Уведомление
```

## Роли и права доступа

### Client (Клиент)
- ✅ Просмотр расписания
- ✅ Запись на тренировки
- ✅ Отмена записей
- ✅ Покупка абонементов
- ✅ Редактирование профиля
- ✅ Просмотр истории
- ❌ Управление тренировками
- ❌ Управление пользователями

### Trainer (Тренер)
- ✅ Просмотр своих тренировок
- ✅ Управление статусами тренировок
- ✅ Отметка посещений
- ✅ Просмотр клиентов
- ❌ Запись клиентов
- ❌ Управление пользователями

### Admin (Администратор)
- ✅ Полный доступ ко всем данным
- ✅ Управление пользователями
- ✅ Управление тренировками
- ✅ Управление абонементами
- ✅ Управление акциями
- ✅ Просмотр статистики
- ✅ Блокировка/удаление пользователей

## Защита маршрутов

```typescript
// routes.tsx
{
  path: "/client",
  element: (
    <ProtectedRoute requiredRole="client">
      <ClientDashboard />
    </ProtectedRoute>
  ),
}
```

**ProtectedRoute** проверяет:
1. Авторизацию (`isAuthenticated`)
2. Наличие роли (`user.role`)
3. Соответствие роли требуемой

При несоответствии:
- Нет авторизации → `/login`
- Нет роли → `/role-select`
- Не та роль → `/{user.role}`

## Состояния UI

### Loading States
Все асинхронные действия имеют состояние загрузки с индикатором (Loader2).

### Empty States
Компонент `EmptyState` для пустых списков с иконкой, заголовком, описанием и действием.

### Success/Error States
Toast уведомления через `sonner`:
- Успех: зелёные
- Ошибки: красные
- Информация: синие

### Status Badges
Компонент `StatusBadge` для отображения статусов:
- active/scheduled - синий
- ongoing - жёлтый
- completed - зелёный
- cancelled/blocked - красный
- expired - серый

## Модальные окна

Все критичные действия подтверждаются через модалки:

1. **BookingModal** - подтверждение записи
2. **ConfirmDialog** - подтверждение удаления/отмены
3. **PurchaseMembershipModal** - покупка абонемента
4. **EditProfileModal** - редактирование профиля

## Моковые данные

Типы данных в `/src/app/lib/mockData.ts`:

```typescript
User - пользователи (6)
Trainer - тренеры (3)
Training - тренировки (7)
Booking - записи (4)
Membership - абонементы (2)
Visit - посещения (5)
Purchase - покупки (2)
Promotion - акции (2)
```

## Особенности реализации

### Даты
- Все даты в формате ISO: `YYYY-MM-DD`
- Форматирование через `date-fns` с локалью `ru`
- Сравнение через `new Date()`

### Цены
- Хранятся в рублях (number)
- Форматирование через `.toLocaleString()`

### ID
- Генерация через `${prefix}_${Date.now()}`
- Уникальность гарантируется временной меткой

### Состояния
- Все состояния хранятся в React state
- Изменения через иммутабельные операции
- Обновления через `map`, `filter`

## Расширение функциональности

### Для добавления backend:

1. **Создайте API слой:**
```typescript
// api/client.ts
export const api = {
  login: (email, password) => fetch('/api/auth/login', ...),
  createBooking: (data) => fetch('/api/bookings', ...),
  // ...
}
```

2. **Обновите контексты:**
```typescript
const login = async (email, password) => {
  const response = await api.login(email, password);
  const user = await response.json();
  setUser(user);
}
```

3. **Добавьте обработку ошибок:**
```typescript
try {
  await api.createBooking(data);
} catch (error) {
  toast.error(error.message);
}
```

### Для добавления новой роли:

1. Обновите типы в `AuthContext` и `mockData`
2. Создайте новый Dashboard
3. Добавьте маршрут в `routes.tsx`
4. Добавьте кейс в `RoleSelect`

## Performance

- Используются `useCallback` для мемоизации функций
- Условный рендеринг для больших списков
- Lazy loading для модалок
- Debounce для поиска (можно добавить)

## Доступность

- Семантичные HTML элементы
- ARIA атрибуты в UI компонентах
- Keyboard navigation через Radix UI
- Focus states на всех интерактивных элементах

## Безопасность

- Protected routes по ролям
- Валидация на клиенте
- Проверка прав доступа перед действиями
- Подтверждение критичных операций

## Следующие шаги

1. Интеграция с backend API
2. JWT токены и refresh
3. Реальная база данных
4. File upload для аватаров
5. Email уведомления
6. Push уведомления
7. Платёжная интеграция
8. Экспорт отчётов
9. Многоязычность (i18n)
10. Темная/светлая тема
