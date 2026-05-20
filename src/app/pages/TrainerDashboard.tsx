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
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'start' | 'complete' | 'cancel' | null>(null);

  // Get trainer's trainings
  const trainerTrainings = trainings.filter((t) => t.trainerId === user?.id);

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
        user: users.find((u) => u.id === booking.userId),
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
              Все тренировки
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-red-300 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Клиенты
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
                    Всего клиентов
                  </h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {nextTraining ? nextTraining.bookedSpots : 0}
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
                        <Clock className="w-4 h-4" />
                        {format(new Date(nextTraining.date), "d MMMM yyyy", {
                          locale: ru,
                        })}
                        , {nextTraining.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {nextTraining.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
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

          {/* All Trainings Tab */}
          <TabsContent value="trainings" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-red-400 mb-6">
                Все предстоящие тренировки
              </h3>
              {upcomingTrainings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-red-400 mb-2">
                          {training.title}
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
                      </div>
                      <div className={`font-semibold ${getStatusColor(training.status)}`}>
                        {getStatusLabel(training.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Нет предстоящих тренировок"
                  description="У вас пока нет запланированных тренировок"
                />
              )}
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-red-400 mb-6">
                Клиенты
              </h3>
              <div className="space-y-4">
                {trainerTrainings.map((training) => {
                  const participants = getParticipants(training.id);
                  if (participants.length === 0) return null;

                  return (
                    <div key={training.id} className="space-y-3">
                      <div className="font-semibold text-red-400">
                        {training.title} -{" "}
                        {format(new Date(training.date), "d MMMM", { locale: ru })}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {participants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                          >
                            <div>
                              <div className="font-semibold text-red-400 mb-1">
                                {participant.user!.name}
                              </div>
                              <div className="text-sm text-red-300">
                                {participant.user!.email}
                              </div>
                            </div>
                            <StatusBadge status={participant.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
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
    </div>
  );
}