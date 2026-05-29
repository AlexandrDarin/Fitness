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
  DollarSign,
  UserCheck,
  Activity,
  Ban,
  CheckCircle,
  Star,
  Clock,
  MapPin,
  Phone,
  X,
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
    addTrainer,
    updateTrainer,
    deleteTrainer,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'block' | 'unblock' | null>(null);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [promoForm, setPromoForm] = useState({
    title: "",
    description: "",
    discount: 0,
    validFrom: "",
    validUntil: "",
    status: "active" as "active" | "expired",
  });
  
  // Trainer management
  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<any>(null);
  const [trainerForm, setTrainerForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: 0,
    bio: "",
  });

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query))
    );
  });

  const totalClients = users.filter((u) => u.role === 'client').length;
  const activeMembers = memberships.filter((m) => m.status === 'active').length;
  const totalRevenue = memberships.reduce((sum, m) => sum + m.price, 0);
  const todayVisits = visits.filter((v) => v.date === new Date().toISOString().split('T')[0]).length;
  const pendingBookings = bookings.filter((b) => b.status === 'confirmed').length;

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

  const handleAddPromotion = () => {
    setEditingPromo(null);
    setPromoForm({
      title: "",
      description: "",
      discount: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: "active",
    });
    setPromoDialogOpen(true);
  };

  const handleEditPromotion = (promo: any) => {
    setEditingPromo(promo);
    setPromoForm({
      title: promo.title,
      description: promo.description,
      discount: promo.discount,
      validFrom: promo.validFrom,
      validUntil: promo.validUntil,
      status: promo.status || "active",
    });
    setPromoDialogOpen(true);
  };

  const handleSavePromotion = async () => {
    if (editingPromo) {
      await updatePromotion(editingPromo.id, promoForm);
    } else {
      await createPromotion(promoForm);
    }
    setPromoDialogOpen(false);
    setEditingPromo(null);
    setPromoForm({
      title: "",
      description: "",
      discount: 0,
      validFrom: "",
      validUntil: "",
      status: "active",
    });
  };

  // Trainer handlers
  const handleAddTrainer = () => {
    setEditingTrainer(null);
    setTrainerForm({ name: "", email: "", phone: "", specialization: "", experience: 0, bio: "" });
    setTrainerDialogOpen(true);
  };

  const handleEditTrainer = (trainer: any) => {
    setEditingTrainer(trainer);
    setTrainerForm({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone || "",
      specialization: trainer.specialization.join(", "),
      experience: trainer.experience,
      bio: trainer.bio,
    });
    setTrainerDialogOpen(true);
  };

  const handleSaveTrainer = async () => {
    if (editingTrainer) {
      await updateTrainer(editingTrainer.id, {
        name: trainerForm.name,
        email: trainerForm.email,
        phone: trainerForm.phone,
        specialization: trainerForm.specialization.split(",").map(s => s.trim()),
        experience: trainerForm.experience,
        bio: trainerForm.bio,
      });
    } else {
      await addTrainer({
        name: trainerForm.name,
        email: trainerForm.email,
        phone: trainerForm.phone,
        specialization: trainerForm.specialization.split(",").map(s => s.trim()),
        experience: trainerForm.experience,
        rating: 5.0,
        bio: trainerForm.bio,
        status: "active",
      });
    }
    setTrainerDialogOpen(false);
    setEditingTrainer(null);
  };

  const handleDeleteTrainer = async (trainerId: string) => {
    if (confirm("Удалить тренера? Это действие нельзя отменить.")) {
      await deleteTrainer(trainerId);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-green-400">Wire Fitness</span>
                <span className="text-xs text-green-400">Панель администратора</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-red-400"><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" onClick={handleLogout} className="text-red-400"><LogOut className="w-4 h-4 mr-2" />Выйти</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-400 mb-2">Панель управления</h1>
          <p className="text-red-400">Управление клубом и аналитика</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-secondary flex flex-wrap gap-1">
            <TabsTrigger value="overview" className="text-red-400 data-[state=active]:bg-primary data-[state=active]:text-white">Обзор</TabsTrigger>
            <TabsTrigger value="users" className="text-red-400 data-[state=active]:bg-primary data-[state=active]:text-white">Пользователи<span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">{users.length}</span></TabsTrigger>
            <TabsTrigger value="trainers" className="text-red-400 data-[state=active]:bg-primary data-[state=active]:text-white">Тренеры</TabsTrigger>
            <TabsTrigger value="trainings" className="text-red-400 data-[state=active]:bg-primary data-[state=active]:text-white">Тренировки</TabsTrigger>
            <TabsTrigger value="memberships" className="text-red-400 data-[state=active]:bg-primary data-[state=active]:text-white">Абонементы</TabsTrigger>
            <TabsTrigger value="promotions" className="text-red-400 data-[state=active]:bg-primary data-[state=active]:text-white">Акции</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-6 border-2 border-blue-500/20">
                <div className="flex items-center gap-3 mb-4"><div className="bg-blue-500/20 p-2 rounded-lg"><Users className="w-5 h-5 text-blue-500" /></div><h3 className="font-semibold text-red-400">Всего клиентов</h3></div>
                <div className="text-3xl font-bold text-blue-500">{totalClients}</div>
                <div className="text-sm text-red-400 mt-2">Активных: {users.filter((u) => u.status === 'active').length}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-6 border-2 border-green-500/20">
                <div className="flex items-center gap-3 mb-4"><div className="bg-green-500/20 p-2 rounded-lg"><UserCheck className="w-5 h-5 text-green-500" /></div><h3 className="font-semibold text-red-400">Активные абонементы</h3></div>
                <div className="text-3xl font-bold text-green-500">{activeMembers}</div>
                <div className="text-sm text-red-400 mt-2">Всего: {memberships.length}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-6 border-2 border-purple-500/20">
                <div className="flex items-center gap-3 mb-4"><div className="bg-purple-500/20 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-purple-500" /></div><h3 className="font-semibold text-red-400">Общий доход</h3></div>
                <div className="text-3xl font-bold text-purple-500">{(totalRevenue / 1000).toFixed(0)}K ₽</div>
                <div className="text-sm text-red-400 mt-2">За все время</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl p-6 border-2 border-orange-500/20">
                <div className="flex items-center gap-3 mb-4"><div className="bg-orange-500/20 p-2 rounded-lg"><Activity className="w-5 h-5 text-orange-500" /></div><h3 className="font-semibold text-red-400">Посещений сегодня</h3></div>
                <div className="text-3xl font-bold text-orange-500">{todayVisits}</div>
                <div className="text-sm text-red-400 mt-2">Всего визитов: {visits.length}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-red-400 mb-4">Статистика тренировок</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-red-400">Всего тренировок</span><span className="font-semibold text-red-400">{trainings.length}</span></div>
                  <div className="flex items-center justify-between"><span className="text-red-400">Запланировано</span><span className="font-semibold text-red-400">{trainings.filter((t) => t.status === 'scheduled').length}</span></div>
                  <div className="flex items-center justify-between"><span className="text-red-400">Завершено</span><span className="font-semibold text-red-400">{trainings.filter((t) => t.status === 'completed').length}</span></div>
                  <div className="flex items-center justify-between"><span className="text-red-400">Всего записей</span><span className="font-semibold text-red-400">{bookings.length}</span></div>
                  <div className="flex items-center justify-between"><span className="text-red-400">Подтвержденных записей</span><span className="font-semibold text-red-400">{pendingBookings}</span></div>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-red-400">Тренерский состав</h3><Button variant="ghost" size="sm" onClick={() => setActiveTab("trainers")} className="text-primary">Все тренеры →</Button></div>
                <div className="space-y-3">
                  {trainers.slice(0, 3).map((trainer) => (
                    <div key={trainer.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div><div className="font-semibold text-red-400">{trainer.name}</div><div className="text-sm text-red-400">{trainer.specialization.slice(0, 2).join(', ')}</div></div>
                      <div className="text-right"><div className="text-sm font-semibold text-primary flex items-center gap-1"><Star className="w-4 h-4" /> {trainer.rating}</div><div className="text-xs text-red-400">{trainer.experience} лет</div></div>
                    </div>
                  ))}
                  {trainers.length === 0 && <div className="text-center py-4 text-red-400">Нет тренеров</div>}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-red-400">Недавние записи</h3><Button variant="ghost" size="sm" onClick={() => setActiveTab("trainings")} className="text-primary">Все записи →</Button></div>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => {
                    const training = trainings.find((t) => t.id === booking.trainingId);
                    const client = users.find((u) => u.id === booking.userId);
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div><div className="font-semibold text-red-400">{client?.name || "Клиент"}</div><div className="text-sm text-red-400">{training?.title || "Тренировка"} • {training?.date || ""}</div></div>
                        <StatusBadge status={booking.status} />
                      </div>
                    );
                  })}
                </div>
              ) : (<EmptyState icon={Calendar} title="Нет записей" description="Записей пока нет" />)}
            </div>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="font-semibold text-red-400">Управление пользователями</h3>
                <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" /><Input placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-80 bg-input-background text-red-400 border-border" /></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-border"><th className="text-left py-3 px-4 text-sm font-semibold text-red-400">Имя</th><th className="text-left py-3 px-4 text-sm font-semibold text-red-400">Email</th><th className="text-left py-3 px-4 text-sm font-semibold text-red-400">Телефон</th><th className="text-left py-3 px-4 text-sm font-semibold text-red-400">Роль</th><th className="text-left py-3 px-4 text-sm font-semibold text-red-400">Статус</th><th className="text-left py-3 px-4 text-sm font-semibold text-red-400">Регистрация</th><th className="text-right py-3 px-4 text-sm font-semibold text-red-400">Действия</th></tr></thead>
                  <tbody>
                    {filteredUsers.map((userItem) => (
                      <tr key={userItem.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4"><div className="font-semibold text-red-400">{userItem.name}</div></td>
                        <td className="py-3 px-4 text-sm text-red-400">{userItem.email}</td>
                        <td className="py-3 px-4 text-sm text-red-400">{userItem.phone || '—'}</td>
                        <td className="py-3 px-4"><span className="text-sm text-red-400 capitalize">{userItem.role === 'client' ? 'Клиент' : userItem.role === 'trainer' ? 'Тренер' : userItem.role === 'admin' ? 'Админ' : '—'}</span></td>
                        <td className="py-3 px-4"><StatusBadge status={userItem.status} /></td>
                        <td className="py-3 px-4 text-sm text-red-400">{format(new Date(userItem.createdAt), "d MMM yyyy", { locale: ru })}</td>
                        <td className="py-3 px-4"><div className="flex items-center justify-end gap-2">
                          {userItem.status === 'active' ? (<Button size="sm" variant="outline" onClick={() => handleUserAction(userItem.id, 'block')} className="text-red-400"><Ban className="w-4 h-4" /></Button>) : (<Button size="sm" variant="outline" onClick={() => handleUserAction(userItem.id, 'unblock')} className="text-red-400"><CheckCircle className="w-4 h-4" /></Button>)}
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(userItem.id, 'delete')} className="text-red-400"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && <EmptyState icon={Users} title="Пользователи не найдены" description="Попробуйте изменить параметры поиска" />}
            </div>
          </TabsContent>

          {/* TRAINERS TAB */}
          <TabsContent value="trainers" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-red-400">Тренерский состав</h3>
                <Button onClick={handleAddTrainer} className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" />Добавить тренера</Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="border border-border rounded-xl p-5 space-y-4 bg-card">
                    <div><div className="font-semibold text-xl text-red-400 mb-1">{trainer.name}</div><div className="text-sm text-red-400">{trainer.email}</div>{trainer.phone && <div className="text-sm text-red-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {trainer.phone}</div>}</div>
                    <div className="space-y-2">
                      <div><span className="text-red-400 text-sm">Специализация:</span><div className="font-semibold text-red-400 text-sm mt-1">{trainer.specialization.join(', ')}</div></div>
                      <div className="flex items-center justify-between"><span className="text-red-400 text-sm">Опыт:</span><span className="font-semibold text-red-400">{trainer.experience} лет</span></div>
                      <div className="flex items-center justify-between"><span className="text-red-400 text-sm">Рейтинг:</span><span className="font-semibold text-primary flex items-center gap-1"><Star className="w-4 h-4 fill-primary" /> {trainer.rating}</span></div>
                      <div className="flex items-center justify-between"><span className="text-red-400 text-sm">Статус:</span><StatusBadge status={trainer.status} /></div>
                    </div>
                    <div className="pt-3 border-t border-border"><div className="text-sm text-red-400 mb-2">О тренере:</div><div className="text-sm text-red-400 leading-relaxed">{trainer.bio}</div></div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-red-400" onClick={() => handleEditTrainer(trainer)}><Edit className="w-4 h-4 mr-2" />Редактировать</Button>
                      <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeleteTrainer(trainer.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              {trainers.length === 0 && <EmptyState icon={Users} title="Нет тренеров" description="Добавьте первого тренера" />}
            </div>
          </TabsContent>

          {/* TRAININGS TAB */}
          <TabsContent value="trainings" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6"><h3 className="font-semibold text-red-400">Все тренировки</h3><Button className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" />Добавить тренировку</Button></div>
              <div className="space-y-4">
                {trainings.map((training) => (
                  <div key={training.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap"><div className="font-semibold text-red-400 text-lg">{training.title}</div><StatusBadge status={training.status} /></div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-red-400">
                        <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Тренер: {training.trainerName}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(new Date(training.date), "d MMMM yyyy", { locale: ru })}, {training.time}</div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {training.duration} мин</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {training.location}</div>
                        <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Записано: {training.bookedSpots} / {training.maxSpots}</div>
                      </div>
                      <div className="mt-2 text-sm text-red-400 line-clamp-2">{training.description}</div>
                    </div>
                    <div className="flex gap-2"><Button size="sm" variant="outline" className="text-red-400"><Edit className="w-4 h-4" /></Button><Button size="sm" variant="outline" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></div>
                  </div>
                ))}
              </div>
              {trainings.length === 0 && <EmptyState icon={Calendar} title="Нет тренировок" description="Добавьте первую тренировку" />}
            </div>
          </TabsContent>

          {/* MEMBERSHIPS TAB */}
          <TabsContent value="memberships" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6"><h3 className="font-semibold text-red-400">Активные абонементы</h3></div>
              <div className="space-y-4">
                {memberships.map((membership) => {
                  const memberUser = users.find((u) => String(u.id) === String(membership.userId));
                  return (
                    <div key={membership.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-red-400 text-lg mb-2">{memberUser?.name || 'Пользователь удалён'}</div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-red-400">
                          <div>Тип: <span className="font-semibold text-red-400 capitalize">{membership.type === 'basic' ? 'Базовый' : membership.type === 'premium' ? 'Премиум' : 'VIP'}</span></div>
                          <div>Действителен до: <span className="font-semibold text-red-400">{format(new Date(membership.validUntil), "d MMMM yyyy", { locale: ru })}</span></div>
                          <div>Стоимость: <span className="font-semibold text-red-400">{membership.price.toLocaleString()} ₽</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3"><StatusBadge status={membership.status} /><Button size="sm" variant="outline" className="text-red-400"><Edit className="w-4 h-4" /></Button></div>
                    </div>
                  );
                })}
              </div>
              {memberships.length === 0 && <EmptyState icon={CreditCard} title="Нет активных абонементов" description="Абонементы будут отображаться здесь" />}
            </div>
          </TabsContent>

          {/* PROMOTIONS TAB */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6"><h3 className="font-semibold text-red-400">Акции и предложения</h3><Button onClick={handleAddPromotion} className="bg-primary hover:bg-primary/90 text-white"><Plus className="w-4 h-4 mr-2" />Добавить акцию</Button></div>
              <div className="grid md:grid-cols-2 gap-6">
                {promotions.map((promo) => (
                  <div key={promo.id} className="border border-border rounded-xl p-5 space-y-4 bg-card">
                    <div className="flex items-start justify-between"><div className="flex-1"><div className="font-semibold text-lg text-red-400 mb-1">{promo.title}</div><div className="text-sm text-red-400">{promo.description}</div></div><StatusBadge status={promo.status} /></div>
                    <div className="flex items-center justify-between"><span className="text-red-400">Скидка:</span><span className="font-semibold text-primary text-2xl">{promo.discount}%</span></div>
                    <div className="text-sm text-red-400">Действует с {format(new Date(promo.validFrom), "d MMMM yyyy", { locale: ru })} по {format(new Date(promo.validUntil), "d MMMM yyyy", { locale: ru })}</div>
                    <div className="flex gap-2 pt-3 border-t border-border">
                      <Button size="sm" variant="outline" className="flex-1 text-red-400" onClick={() => handleEditPromotion(promo)}><Edit className="w-4 h-4 mr-2" />Изменить</Button>
                      <Button size="sm" variant="outline" onClick={() => deletePromotion(promo.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              {promotions.length === 0 && <EmptyState icon={TrendingUp} title="Нет активных акций" description="Создайте акцию для привлечения клиентов" />}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}
        title={actionType === 'delete' ? 'Удалить пользователя?' : actionType === 'block' ? 'Заблокировать пользователя?' : 'Разблокировать пользователя?'}
        description={actionType === 'delete' ? 'Пользователь и все его данные будут удалены.' : actionType === 'block' ? 'Пользователь не сможет войти в систему.' : 'Пользователь снова сможет войти в систему.'}
        confirmLabel={actionType === 'delete' ? 'Удалить' : actionType === 'block' ? 'Заблокировать' : 'Разблокировать'} cancelLabel="Отмена"
        variant={actionType === 'delete' ? 'destructive' : 'default'} onConfirm={handleConfirmAction} />

      {/* Trainer Dialog */}
      {trainerDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-400">{editingTrainer ? 'Редактировать тренера' : 'Новый тренер'}</h2>
              <button onClick={() => setTrainerDialogOpen(false)} className="p-1 hover:bg-primary/10 rounded-lg transition"><X className="w-5 h-5 text-red-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Имя *</label><input type="text" value={trainerForm.name} onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" placeholder="Иван Иванов" /></div>
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Email *</label><input type="email" value={trainerForm.email} onChange={(e) => setTrainerForm({ ...trainerForm, email: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" placeholder="trainer@example.com" /></div>
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Телефон</label><input type="tel" value={trainerForm.phone} onChange={(e) => setTrainerForm({ ...trainerForm, phone: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" placeholder="+7 (999) 123-45-67" /></div>
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Специализация (через запятую)</label><input type="text" value={trainerForm.specialization} onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" placeholder="Йога, Пилатес, Растяжка" /></div>
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Опыт (лет)</label><input type="number" value={trainerForm.experience} onChange={(e) => setTrainerForm({ ...trainerForm, experience: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" placeholder="5" /></div>
              <div><label className="block text-sm font-semibold text-red-400 mb-2">О тренере</label><textarea rows={3} value={trainerForm.bio} onChange={(e) => setTrainerForm({ ...trainerForm, bio: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400 resize-none" placeholder="Расскажите о тренере..." /></div>
              <div className="flex gap-3 pt-4"><Button onClick={handleSaveTrainer} className="flex-1 bg-primary text-white">{editingTrainer ? 'Сохранить' : 'Создать'}</Button><Button variant="outline" onClick={() => setTrainerDialogOpen(false)} className="flex-1 text-red-400">Отмена</Button></div>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Dialog */}
      {promoDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-400">{editingPromo ? 'Редактировать акцию' : 'Новая акция'}</h2>
              <button onClick={() => setPromoDialogOpen(false)} className="p-1 hover:bg-primary/10 rounded-lg transition"><X className="w-5 h-5 text-red-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Название акции</label><input type="text" value={promoForm.title} onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" placeholder="Например: Весенняя скидка" /></div>
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Описание</label><textarea rows={3} value={promoForm.description} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400 resize-none" placeholder="Описание акции..." /></div>
              <div><label className="block text-sm font-semibold text-red-400 mb-2">Скидка (%)</label><input type="number" value={promoForm.discount} onChange={(e) => setPromoForm({ ...promoForm, discount: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" placeholder="10" /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-red-400 mb-2">Дата начала</label><input type="date" value={promoForm.validFrom} onChange={(e) => setPromoForm({ ...promoForm, validFrom: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" /></div><div><label className="block text-sm font-semibold text-red-400 mb-2">Дата окончания</label><input type="date" value={promoForm.validUntil} onChange={(e) => setPromoForm({ ...promoForm, validUntil: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400" /></div></div>
              <div className="flex gap-3 pt-4"><Button onClick={handleSavePromotion} className="flex-1 bg-primary text-white">{editingPromo ? 'Сохранить' : 'Создать'}</Button><Button variant="outline" onClick={() => setPromoDialogOpen(false)} className="flex-1 text-red-400">Отмена</Button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
