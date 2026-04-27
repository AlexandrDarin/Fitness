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
  Pause,
  CheckCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { ConfirmDialog } from "../components/modals/ConfirmDialog";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    trainings,
    bookings,
    getTrainingBookings,
    updateTrainingStatus,
    markAttendance,
    users,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'start' | 'complete' | 'cancel' | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);

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
        return 'text-blue-500';
      case 'ongoing':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
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
              <div className="bg-primary p-2 rounded-xl">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-card-foreground">
                  ECO FITNESS
                </span>
                <span className="text-xs text-muted-foreground">
                  Кабинет тренера
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
            Добро пожаловать, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Управляйте расписанием и работайте с клиентами
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="schedule">
              Расписание
              {todayTrainings.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {todayTrainings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="trainings">Все тренировки</TabsTrigger>
            <TabsTrigger value="clients">Клиенты</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Тренировок сегодня
                  </h3>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {todayTrainings.length}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Всего клиентов
                  </h3>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {nextTraining ? nextTraining.bookedSpots : 0}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Предстоящие
                  </h3>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {upcomingTrainings.length}
                </div>
              </div>
            </div>

            {/* Next Training */}
            {nextTraining && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">
                      Ближайшая тренировка
                    </h3>
                  </div>
                  <div className={`font-semibold ${getStatusColor(nextTraining.status)}`}>
                    {getStatusLabel(nextTraining.status)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-card-foreground mb-2">
                      {nextTraining.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Начать тренировку
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleTrainingAction(nextTraining.id, 'cancel')}
                        >
                          Отменить
                        </Button>
                      </>
                    )}
                    {nextTraining.status === 'ongoing' && (
                      <Button
                        onClick={() => handleTrainingAction(nextTraining.id, 'complete')}
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
                <h3 className="font-semibold text-card-foreground mb-4">
                  Расписание на сегодня
                </h3>
                <div className="space-y-3">
                  {todayTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-primary/10 px-4 py-2 rounded-lg shrink-0">
                          <div className="font-semibold text-primary">
                            {training.time}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-card-foreground mb-1">
                            {training.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
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
              <h3 className="font-semibold text-card-foreground mb-6">
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
                              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                                <div className="font-semibold text-primary">
                                  {training.time}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-card-foreground text-lg">
                                  {training.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {training.location}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
                                <div className="text-sm font-semibold text-card-foreground">
                                  Участники:
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {participants.map((participant) => (
                                    <div
                                      key={participant.id}
                                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                    >
                                      <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-card-foreground">
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
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleMarkAttendance(participant.id, false)
                                            }
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      )}
                                      {participant.status === 'completed' && (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                      )}
                                      {participant.status === 'missed' && (
                                        <XCircle className="w-4 h-4 text-red-500" />
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
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Начать
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTrainingAction(training.id, 'cancel')}
                                >
                                  Отменить
                                </Button>
                              </>
                            )}
                            {training.status === 'ongoing' && (
                              <Button
                                size="sm"
                                onClick={() => handleTrainingAction(training.id, 'complete')}
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
              <h3 className="font-semibold text-card-foreground mb-6">
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
                        <div className="font-semibold text-card-foreground mb-2">
                          {training.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
              <h3 className="font-semibold text-card-foreground mb-6">
                Клиенты
              </h3>
              <div className="space-y-4">
                {trainerTrainings.map((training) => {
                  const participants = getParticipants(training.id);
                  if (participants.length === 0) return null;

                  return (
                    <div key={training.id} className="space-y-3">
                      <div className="font-semibold text-card-foreground">
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
                              <div className="font-semibold text-card-foreground mb-1">
                                {participant.user!.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
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
