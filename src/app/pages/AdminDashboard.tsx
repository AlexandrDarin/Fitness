import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dumbbell,
  Users,
  TrendingUp,
  CreditCard,
  Calendar,
  Bell,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  DollarSign,
  UserCheck,
  Activity,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { ConfirmDialog } from "../components/modals/ConfirmDialog";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    users,
    trainings,
    memberships,
    bookings,
    visits,
    trainers,
    promotions,
    deleteUser,
    toggleUserStatus,
    createPromotion,
    updatePromotion,
    deletePromotion,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'block' | 'unblock' | null>(null);

  // Filter users based on search
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query))
    );
  });

  // Calculate metrics
  const totalClients = users.filter((u) => u.role === 'client').length;
  const activeMembers = memberships.filter((m) => m.status === 'active').length;
  const totalRevenue = memberships.reduce((sum, m) => sum + m.price, 0);
  const todayVisits = visits.filter(
    (v) => v.date === new Date().toISOString().split('T')[0]
  ).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUserAction = (userId: string, action: 'delete' | 'block' | 'unblock') => {
    setSelectedUserId(userId);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUserId || !actionType) return;

    if (actionType === 'delete') {
      await deleteUser(selectedUserId);
    } else {
      await toggleUserStatus(selectedUserId);
    }

    setConfirmDialogOpen(false);
    setSelectedUserId(null);
    setActionType(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-card-foreground">
                  ECO FITNESS
                </span>
                <span className="text-xs text-muted-foreground">
                  Панель администратора
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Панель управления
          </h1>
          <p className="text-muted-foreground">
            Управление клубом и аналитика
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="users">
              Пользователи
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {users.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="trainers">Тренеры</TabsTrigger>
            <TabsTrigger value="trainings">Тренировки</TabsTrigger>
            <TabsTrigger value="memberships">Абонементы</TabsTrigger>
            <TabsTrigger value="promotions">Акции</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-6 border-2 border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Всего клиентов
                  </h3>
                </div>
                <div className="text-3xl font-bold text-blue-500">
                  {totalClients}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Активных: {users.filter((u) => u.status === 'active').length}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-6 border-2 border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <UserCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Активные абонементы
                  </h3>
                </div>
                <div className="text-3xl font-bold text-green-500">
                  {activeMembers}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Всего: {memberships.length}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-6 border-2 border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Общий доход
                  </h3>
                </div>
                <div className="text-3xl font-bold text-purple-500">
                  {(totalRevenue / 1000).toFixed(0)}K ₽
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  За все время
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl p-6 border-2 border-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Посещений сегодня
                  </h3>
                </div>
                <div className="text-3xl font-bold text-orange-500">
                  {todayVisits}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Всего визитов: {visits.length}
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-card-foreground mb-4">
                  Статистика тренировок
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Всего тренировок</span>
                    <span className="font-semibold text-card-foreground">
                      {trainings.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Запланировано</span>
                    <span className="font-semibold text-card-foreground">
                      {trainings.filter((t) => t.status === 'scheduled').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Завершено</span>
                    <span className="font-semibold text-card-foreground">
                      {trainings.filter((t) => t.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Всего записей</span>
                    <span className="font-semibold text-card-foreground">
                      {bookings.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-card-foreground mb-4">
                  Тренерский состав
                </h3>
                <div className="space-y-3">
                  {trainers.map((trainer) => (
                    <div
                      key={trainer.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-card-foreground">
                          {trainer.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trainer.specialization.join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary">
                          ⭐ {trainer.rating}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {trainer.experience} лет опыта
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-card-foreground">
                  Управление пользователями
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">
                        Имя
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">
                        Телефон
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">
                        Роль
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">
                        Статус
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-card-foreground">
                        Регистрация
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-card-foreground">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-card-foreground">
                            {user.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.phone || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-card-foreground capitalize">
                            {user.role === 'client'
                              ? 'Клиент'
                              : user.role === 'trainer'
                              ? 'Тренер'
                              : user.role === 'admin'
                              ? 'Админ'
                              : '—'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {format(new Date(user.createdAt), "d MMM yyyy", {
                            locale: ru,
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {user.status === 'active' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'block')}
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, 'unblock')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'delete')}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <EmptyState
                  icon={Users}
                  title="Пользователи не найдены"
                  description="Попробуйте изменить параметры поиска"
                />
              )}
            </div>
          </TabsContent>

          {/* Trainers Tab */}
          <TabsContent value="trainers" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-card-foreground">
                  Тренерский состав
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="border border-border rounded-xl p-5 space-y-4"
                  >
                    <div>
                      <div className="font-semibold text-lg text-card-foreground mb-1">
                        {trainer.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trainer.email}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Специализация:</span>
                        <div className="font-semibold text-card-foreground">
                          {trainer.specialization.join(', ')}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Опыт:</span>
                        <span className="font-semibold text-card-foreground">
                          {trainer.experience} лет
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Рейтинг:</span>
                        <span className="font-semibold text-primary">
                          ⭐ {trainer.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Статус:</span>
                        <StatusBadge status={trainer.status} />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <div className="text-sm text-muted-foreground mb-2">
                        О тренере:
                      </div>
                      <div className="text-sm text-card-foreground">
                        {trainer.bio}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Trainings Tab */}
          <TabsContent value="trainings" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-card-foreground">
                  Все тренировки
                </h3>
              </div>

              <div className="space-y-4">
                {trainings.map((training) => (
                  <div
                    key={training.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-semibold text-card-foreground">
                          {training.title}
                        </div>
                        <StatusBadge status={training.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Тренер: {training.trainerName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(training.date), "d MMMM yyyy", {
                            locale: ru,
                          })}
                          , {training.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Записано: {training.bookedSpots} / {training.maxSpots}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Memberships Tab */}
          <TabsContent value="memberships" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-card-foreground">
                  Активные абонементы
                </h3>
              </div>

              <div className="space-y-4">
                {memberships.map((membership) => {
                  const memberUser = users.find((u) => u.id === membership.userId);

                  return (
                    <div
                      key={membership.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-card-foreground mb-2">
                          {memberUser?.name || 'Пользователь удалён'}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div>
                            Тип:{" "}
                            <span className="font-semibold text-card-foreground capitalize">
                              {membership.type === 'basic'
                                ? 'Базовый'
                                : membership.type === 'premium'
                                ? 'Премиум'
                                : 'VIP'}
                            </span>
                          </div>
                          <div>
                            Действителен до:{" "}
                            <span className="font-semibold text-card-foreground">
                              {format(new Date(membership.validUntil), "d MMMM yyyy", {
                                locale: ru,
                              })}
                            </span>
                          </div>
                          <div>
                            Стоимость:{" "}
                            <span className="font-semibold text-card-foreground">
                              {membership.price.toLocaleString()} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={membership.status} />
                    </div>
                  );
                })}
              </div>

              {memberships.length === 0 && (
                <EmptyState
                  icon={CreditCard}
                  title="Нет активных абонементов"
                  description="Абонементы будут отображаться здесь"
                />
              )}
            </div>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-card-foreground">
                  Акции и предложения
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="border border-border rounded-xl p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-card-foreground mb-1">
                          {promo.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {promo.description}
                        </div>
                      </div>
                      <StatusBadge status={promo.status} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Скидка:</span>
                      <span className="font-semibold text-primary text-lg">
                        {promo.discount}%
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Действует с{" "}
                      {format(new Date(promo.validFrom), "d MMMM", { locale: ru })}{" "}
                      по {format(new Date(promo.validUntil), "d MMMM yyyy", { locale: ru })}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {}}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Изменить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deletePromotion(promo.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {promotions.length === 0 && (
                <EmptyState
                  icon={TrendingUp}
                  title="Нет активных акций"
                  description="Создайте акцию для привлечения клиентов"
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={
          actionType === 'delete'
            ? 'Удалить пользователя?'
            : actionType === 'block'
            ? 'Заблокировать пользователя?'
            : 'Разблокировать пользователя?'
        }
        description={
          actionType === 'delete'
            ? 'Пользователь и все его данные будут удалены. Это действие нельзя отменить.'
            : actionType === 'block'
            ? 'Пользователь не сможет войти в систему.'
            : 'Пользователь снова сможет войти в систему.'
        }
        confirmLabel={
          actionType === 'delete'
            ? 'Удалить'
            : actionType === 'block'
            ? 'Заблокировать'
            : 'Разблокировать'
        }
        cancelLabel="Отмена"
        variant={actionType === 'delete' ? 'destructive' : 'default'}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
