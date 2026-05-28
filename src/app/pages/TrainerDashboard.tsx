import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dumbbell,
  Calendar,
  Users,
  Bell,
  LogOut,
  Clock,
  MapPin,
  CheckCircle,
  User,
  TrendingUp,
  XCircle,
  Play,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { ConfirmDialog } from "../components/modals/ConfirmDialog";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    trainings,
    getTrainingBookings,
    updateTrainingStatus,
    markAttendance,
    users,
    addTraining,
    updateTraining,
    deleteTraining,
    getTrainerClients,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'start' | 'complete' | 'cancel' | null>(null);
  
  // State для модального окна тренировки
  const [trainingDialogOpen, setTrainingDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<any>(null);
  const [trainingForm, setTrainingForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    location: "",
    category: "",
    maxSpots: 10,
  });

  // 👇 ИСПРАВЛЕНО: Безопасное сравнение типов через приведение к строке!
  const trainerTrainings = trainings.filter((t) => String(t.trainerId) === String(user?.id));
  const myClients = user ? getTrainerClients(user.id) : [];

  // Today's trainings
  const today = new Date().toISOString().split('T')[0];
  const todayTrainings = trainerTrainings
    .filter((t) => t.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Upcoming trainings
  const upcomingTrainings = trainerTrainings
    .filter((t) => new Date(t.date) >= new Date() && t.status === 'scheduled')
    .sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
    });

  // Next training
  const nextTraining = upcomingTrainings[0];

  // Get training participants
  const getParticipants = (trainingId: string) => {
    const trainingBookings = getTrainingBookings(trainingId);
    return trainingBookings
      .filter((b) => b.status === 'confirmed')
      .map((booking) => ({
        ...booking,
        user: users.find((u) => String(u.id) === String(booking.userId)), // Сравнение строк
      }))
      .filter((b) => b.user);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleTrainingAction = (trainingId: string, action: 'start' | 'complete' | 'cancel') => {
    setSelectedTraining(trainingId);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedTraining || !actionType) return;

    const statusMap = {
      start: 'ongoing' as const,
      complete: 'completed' as const,
      cancel: 'cancelled' as const,
    };

    updateTrainingStatus(selectedTraining, statusMap[actionType]);
    setConfirmDialogOpen(false);
    setSelectedTraining(null);
    setActionType(null);
  };

  const handleMarkAttendance = async (bookingId: string, attended: boolean) => {
    await markAttendance(bookingId, attended);
  };

  const handleAddTraining = () => {
    setEditingTraining(null);
    setTrainingForm({
      title: "",
      description: "",
      date: today,
      time: "10:00",
      duration: 60,
      location: "",
      category: "",
      maxSpots: 10,
    });
    setTrainingDialogOpen(true);
  };

  const handleEditTraining = (training: any) => {
    setEditingTraining(training);
    setTrainingForm({
      title: training.title,
      description: training.description,
      date: training.date,
      time: training.time,
      duration: training.duration,
      location: training.location,
      category: training.category,
      maxSpots: training.maxSpots,
    });
    setTrainingDialogOpen(true);
  };

  const handleSaveTraining = async () => {
    if (editingTraining) {
      await updateTraining(editingTraining.id, trainingForm);
    } else {
      await addTraining({
        ...trainingForm,
        trainerId: user!.id,
        trainerName: user!.name,
        type: "group",
        price: undefined,
      });
    }
    setTrainingDialogOpen(false);
    setEditingTraining(null);
  };

  const handleDeleteTraining = async (trainingId: string) => {
    if (confirm("Удалить тренировку? Это действие нельзя отменить.")) {
      await deleteTraining(trainingId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-400';
      case 'ongoing':
        return 'text-yellow-400';
      case 'completed':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-red-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Запланирована';
      case 'ongoing':
        return 'Идёт';
      case 'completed':
        return 'Завершена';
      case 'cancelled':
        return 'Отменена';
      default:
        return status;
    }
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
              <div className="bg-green-500 p-2 rounded-xl">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-green-400">
                  Wire Fitness
                </span>
                <span className="text-xs text-red-400">
                  Кабинет тренера
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-red-300">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-red-300">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-400 mb-2">
            Добро пожаловать, {user.name}!
          </h1>
          <p className="text-red-300">
            Управляйте расписанием и работайте с клиентами
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-secondary">
            <TabsTrigger value="overview" className="text-red-300 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Обзор
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-red-300 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Расписание
              {todayTrainings.length > 0 && (
                <span className="ml-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {todayTrainings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="trainings" className="text-red-300 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Мои тренировки
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-red-300 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Мои клиенты
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-red-400">
                    Тренировок сегодня
                  </h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {todayTrainings.length}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-red-400">
                    Моих клиентов
                  </h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {myClients.length}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-red-400">
                    Предстоящие
                  </h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {upcomingTrainings.length}
                </div>
              </div>
            </div>

            {/* Next Training */}
            {nextTraining && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-red-400">
                      Ближайшая тренировка
                    </h3>
                  </div>
                  <div className={`font-semibold ${getStatusColor(nextTraining.status)}`}>
                    {getStatusLabel(nextTraining.status)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-red-400 mb-2">
                      {nextTraining.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-red-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-400" />
                        {format(new Date(nextTraining.date), "d MMMM yyyy", {
                          locale: ru,
                        })}
                        , {nextTraining.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        {nextTraining.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        {nextTraining.bookedSpots} / {nextTraining.maxSpots} человек
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {nextTraining.status === 'scheduled' && (
                      <>
                        <Button
                          onClick={() => handleTrainingAction(nextTraining.id, 'start')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Начать тренировку
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleTrainingAction(nextTraining.id, 'cancel')}
                          className="border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          Отменить
                        </Button>
                      </>
                    )}
                    {nextTraining.status === 'ongoing' && (
                      <Button
                        onClick={() => handleTrainingAction(nextTraining.id, 'complete')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Завершить тренировку
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Today's Schedule */}
            {todayTrainings.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-red-400 mb-4">
                  Расписание на сегодня
                </h3>
                <div className="space-y-3">
                  {todayTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-green-500/20 px-4 py-2 rounded-lg shrink-0">
                          <div className="font-semibold text-green-400">
                            {training.time}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-red-400 mb-1">
                            {training.title}
                          </div>
                          <div className="text-sm text-red-300">
                            {training.location} • {training.bookedSpots} /{" "}
                            {training.maxSpots} человек
                          </div>
                        </div>
                      </div>
                      <div className={`font-semibold text-sm ${getStatusColor(training.status)}`}>
                        {getStatusLabel(training.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-red-400 mb-6">
                Расписание на сегодня
              </h3>
              {todayTrainings.length > 0 ? (
                <div className="space-y-4">
                  {todayTrainings.map((training) => {
                    const participants = getParticipants(training.id);

                    return (
                      <div
                        key={training.id}
                        className="border border-border rounded-xl p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-green-500/20 px-4 py-2 rounded-lg">
                                <div className="font-semibold text-green-400">
                                  {training.time}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-red-400 text-lg">
                                  {training.title}
                                </div>
                                <div className="text-sm text-red-300">
                                  {training.location}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-red-300 mb-4">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Записано: {participants.length} / {training.maxSpots}
                              </div>
                              <div className={`font-semibold ${getStatusColor(training.status)}`}>
                                {getStatusLabel(training.status)}
                              </div>
                            </div>

                            {participants.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-sm font-semibold text-red-400">
                                  Участники:
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {participants.map((participant) => (
                                    <div
                                      key={participant.id}
                                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                    >
                                      <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-red-300" />
                                        <span className="text-sm text-red-400">
                                          {participant.user!.name}
                                        </span>
                                      </div>
                                      {training.status === 'ongoing' && (
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleMarkAttendance(participant.id, true)
                                            }
                                            className="border-green-500 text-green-400"
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleMarkAttendance(participant.id, false)
                                            }
                                            className="border-red-500 text-red-400"
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      )}
                                      {participant.status === 'completed' && (
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                      )}
                                      {participant.status === 'missed' && (
                                        <XCircle className="w-4 h-4 text-red-400" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            {training.status === 'scheduled' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleTrainingAction(training.id, 'start')}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Начать
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTrainingAction(training.id, 'cancel')}
                                  className="border-red-500 text-red-400"
                                >
                                  Отменить
                                </Button>
                              </>
                            )}
                            {training.status === 'ongoing' && (
                              <Button
                                size="sm"
                                onClick={() => handleTrainingAction(training.id, 'complete')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Завершить
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Нет тренировок на сегодня"
                  description="Сегодня у вас нет запланированных тренировок"
                />
              )}
            </div>
          </TabsContent>

          {/* My Trainings Tab */}
          <TabsContent value="trainings" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-red-400">Мои тренировки</h3>
                <Button onClick={handleAddTraining} className="bg-green-500 hover:bg-green-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать тренировку
                </Button>
              </div>
              {trainerTrainings.length > 0 ? (
                <div className="space-y-4">
                  {trainerTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <div className="font-semibold text-red-400 text-lg">
                            {training.title}
                          </div>
                          <StatusBadge status={training.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-red-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {format(new Date(training.date), "d MMMM yyyy", {
                              locale: ru,
                            })}
                            , {training.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {training.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {training.bookedSpots} / {training.maxSpots}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-red-400 line-clamp-2">
                          {training.description}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400"
                          onClick={() => handleEditTraining(training)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500"
                          onClick={() => handleDeleteTraining(training.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Нет тренировок"
                  description="Создайте свою первую тренировку"
                />
              )}
            </div>
          </TabsContent>

          {/* My Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-red-400 mb-6">Мои клиенты</h3>
              {myClients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                    >
                      <div>
                        <div className="font-semibold text-red-400 mb-1">
                          {client.name}
                        </div>
                        <div className="text-sm text-red-300">
                          {client.email}
                        </div>
                        <div className="text-sm text-red-300">
                          {client.phone || "Нет телефона"}
                        </div>
                      </div>
                      <StatusBadge status={client.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="Нет клиентов"
                  description="Клиенты появятся после записи на ваши тренировки"
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
          actionType === 'start'
            ? 'Начать тренировку?'
            : actionType === 'complete'
            ? 'Завершить тренировку?'
            : 'Отменить тренировку?'
        }
        description={
          actionType === 'start'
            ? 'Тренировка будет отмечена как идущая'
            : actionType === 'complete'
            ? 'Тренировка будет отмечена как завершённая'
            : 'Все записи будут отменены. Это действие нельзя отменить.'
        }
        confirmLabel="Подтвердить"
        cancelLabel="Отмена"
        variant={actionType === 'cancel' ? 'destructive' : 'default'}
        onConfirm={handleConfirmAction}
      />

      {/* Training Dialog (Create/Edit) */}
      {trainingDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-400">
                {editingTraining ? 'Редактировать тренировку' : 'Новая тренировка'}
              </h2>
              <button onClick={() => setTrainingDialogOpen(false)} className="p-1 hover:bg-primary/10 rounded-lg transition">
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-red-400 mb-2">Название *</label>
                <input
                  type="text"
                  value={trainingForm.title}
                  onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400"
                  placeholder="Функциональный тренинг"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-400 mb-2">Описание</label>
                <textarea
                  rows={2}
                  value={trainingForm.description}
                  onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400 resize-none"
                  placeholder="Описание тренировки..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-red-400 mb-2">Дата *</label>
                  <input
                    type="date"
                    value={trainingForm.date}
                    onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-400 mb-2">Время *</label>
                  <input
                    type="time"
                    value={trainingForm.time}
                    onChange={(e) => setTrainingForm({ ...trainingForm, time: e.target.value })}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-red-400 mb-2">Длительность (мин)</label>
                  <input
                    type="number"
                    value={trainingForm.duration}
                    onChange={(e) => setTrainingForm({ ...trainingForm, duration: parseInt(e.target.value) || 60 })}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-400 mb-2">Макс. мест</label>
                  <input
                    type="number"
                    value={trainingForm.maxSpots}
                    onChange={(e) => setTrainingForm({ ...trainingForm, maxSpots: parseInt(e.target.value) || 10 })}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-400 mb-2">Локация *</label>
                <input
                  type="text"
                  value={trainingForm.location}
                  onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400"
                  placeholder="Групповой зал"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-400 mb-2">Категория *</label>
                <input
                  type="text"
                  value={trainingForm.category}
                  onChange={(e) => setTrainingForm({ ...trainingForm, category: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-red-400"
                  placeholder="Функциональный тренинг"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveTraining} className="flex-1 bg-green-500 text-white">
                  {editingTraining ? 'Сохранить' : 'Создать'}
                </Button>
                <Button variant="outline" onClick={() => setTrainingDialogOpen(false)} className="flex-1 text-red-400">
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
