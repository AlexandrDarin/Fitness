import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dumbbell,
  Calendar,
  CreditCard,
  User,
  Bell,
  LogOut,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { BookingModal } from "../components/modals/BookingModal";
import { PurchaseMembershipModal } from "../components/modals/PurchaseMembershipModal";
import { EditProfileModal } from "../components/modals/EditProfileModal";
import { ConfirmDialog } from "../components/modals/ConfirmDialog";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { membershipTypes } from "../lib/mockData";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    trainings,
    getUserBookings,
    getUserMembership,
    getUserVisits,
    createBooking,
    cancelBooking,
    purchaseMembership,
    updateUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get user data
  const userBookings = user ? getUserBookings(user.id) : [];
  const userMembership = user ? getUserMembership(user.id) : undefined;
  const userVisits = user ? getUserVisits(user.id) : [];

  // Filter confirmed bookings with training details
  const confirmedBookings = userBookings
    .filter((b) => b.status === "confirmed")
    .map((booking) => ({
      ...booking,
      training: trainings.find((t) => t.id === booking.trainingId),
    }))
    .filter((b) => b.training)
    .sort(
      (a, b) =>
        new Date(a.training!.date + " " + a.training!.time).getTime() -
        new Date(b.training!.date + " " + b.training!.time).getTime()
    );

  // Get next training
  const nextBooking = confirmedBookings[0];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBookTraining = (training: any) => {
    setSelectedTraining(training);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedTraining) return;

    setIsProcessing(true);
    const success = await createBooking(user.id, selectedTraining.id);
    setIsProcessing(false);

    if (success) {
      setBookingModalOpen(false);
      setSelectedTraining(null);
    }
  };

  const handleCancelBookingRequest = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsProcessing(true);
    const success = await cancelBooking(bookingToCancel);
    setIsProcessing(false);

    if (success) {
      setConfirmDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handlePurchaseMembership = (type: string) => {
    const membership = membershipTypes.find((m) => m.type === type);
    if (membership) {
      setSelectedMembership({
        id: type,
        name: membership.name,
        price: membership.price,
        duration: `${membership.duration} дней`,
        features: membership.features,
      });
      setMembershipModalOpen(true);
    }
  };

  const handleConfirmPurchase = async (membershipId: string) => {
    if (!user) return;

    setIsProcessing(true);
    const success = await purchaseMembership(user.id, membershipId as any);
    setIsProcessing(false);

    if (success) {
      setMembershipModalOpen(false);
      setSelectedMembership(null);
    }
  };

  const handleSaveProfile = async (data: any) => {
    if (!user) return;

    await updateUser(user.id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
  };

  // Calculate membership days left
  const getMembershipDaysLeft = () => {
    if (!userMembership) return 0;
    const validUntil = new Date(userMembership.validUntil);
    const today = new Date();
    const diff = Math.ceil(
      (validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, diff);
  };

  // Available trainings (not booked by user)
  const availableTrainings = trainings.filter((training) => {
    const isBooked = userBookings.some(
      (b) => b.trainingId === training.id && b.status === "confirmed"
    );
    return !isBooked && training.status === "scheduled" && training.bookedSpots < training.maxSpots;
  });

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
                  Личный кабинет
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
            Управляйте тренировками и отслеживайте прогресс
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="bookings">
              Мои записи
              {confirmedBookings.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {confirmedBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="membership">Абонемент</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Membership Status */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    Абонемент
                  </h3>
                </div>
                {userMembership ? (
                  <>
                    <div className="text-2xl font-bold text-card-foreground mb-1">
                      {membershipTypes.find((m) => m.type === userMembership.type)
                        ?.name || userMembership.type}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Действителен до{" "}
                      {format(new Date(userMembership.validUntil), "d MMMM yyyy", {
                        locale: ru,
                      })}
                    </p>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="text-sm text-muted-foreground mb-1">
                        Осталось дней
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {getMembershipDaysLeft()}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-4">
                      У вас нет активного абонемента
                    </p>
                    <Button
                      onClick={() => setActiveTab("membership")}
                      size="sm"
                    >
                      Купить абонемент
                    </Button>
                  </div>
                )}
              </div>

              {/* Next Training */}
              <div className="bg-card rounded-2xl p-6 border border-border md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">
                      Ближайшая тренировка
                    </h3>
                  </div>
                  {nextBooking && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelBookingRequest(nextBooking.id)}
                    >
                      Отменить
                    </Button>
                  )}
                </div>
                {nextBooking && nextBooking.training ? (
                  <div className="space-y-3">
                    <div className="text-xl font-bold text-card-foreground">
                      {nextBooking.training.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {nextBooking.training.trainerName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {format(
                          new Date(nextBooking.training.date),
                          "d MMMM yyyy",
                          { locale: ru }
                        )}
                        , {nextBooking.training.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {nextBooking.training.location}
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="Нет предстоящих тренировок"
                    description="Запишитесь на тренировку в расписании"
                    action={
                      <Button onClick={() => setActiveTab("schedule")}>
                        Просмотреть расписание
                      </Button>
                    }
                  />
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-card-foreground mb-4">
                Быстрые действия
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  className="w-full"
                  onClick={() => setActiveTab("schedule")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Записаться
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("membership")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Продлить абонемент
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("bookings")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Мои записи
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Профиль
                </Button>
              </div>
            </div>

            {/* Upcoming Bookings */}
            {confirmedBookings.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-card-foreground mb-4">
                  Предстоящие записи
                </h3>
                <div className="space-y-3">
                  {confirmedBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-card-foreground mb-1">
                          {booking.training!.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{booking.training!.trainerName}</span>
                          <span>•</span>
                          <span>
                            {format(
                              new Date(booking.training!.date),
                              "d MMMM",
                              { locale: ru }
                            )}
                            , {booking.training!.time}
                          </span>
                          <span>•</span>
                          <span>{booking.training!.location}</span>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 ml-4" />
                    </div>
                  ))}
                </div>
                {confirmedBookings.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("bookings")}
                  >
                    Все записи →
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-card-foreground mb-6">
                Мои записи
              </h3>
              {confirmedBookings.length > 0 ? (
                <div className="space-y-4">
                  {confirmedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-card-foreground mb-2">
                          {booking.training!.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {booking.training!.trainerName}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {format(
                              new Date(booking.training!.date),
                              "d MMMM yyyy",
                              { locale: ru }
                            )}
                            , {booking.training!.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {booking.training!.location}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelBookingRequest(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Отменить
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Нет записей"
                  description="У вас пока нет записей на тренировки"
                  action={
                    <Button onClick={() => setActiveTab("schedule")}>
                      Посмотреть расписание
                    </Button>
                  }
                />
              )}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-card-foreground mb-6">
                Расписание групповых занятий
              </h3>
              <p className="text-muted-foreground mb-4">
                Выберите удобное время и запишитесь на тренировку
              </p>
              {availableTrainings.length > 0 ? (
                <div className="space-y-4">
                  {availableTrainings.map((training) => {
                    const spotsLeft = training.maxSpots - training.bookedSpots;
                    const spotsPercentage =
                      (training.bookedSpots / training.maxSpots) * 100;

                    return (
                      <div
                        key={training.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary rounded-xl gap-4"
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
                              Тренер: {training.trainerName} • {training.location}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {format(new Date(training.date), "d MMMM yyyy", {
                                locale: ru,
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              Свободно мест:
                            </div>
                            <div
                              className={`font-semibold ${
                                spotsPercentage > 80
                                  ? "text-red-500"
                                  : spotsPercentage > 50
                                  ? "text-yellow-500"
                                  : "text-primary"
                              }`}
                            >
                              {spotsLeft} из {training.maxSpots}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleBookTraining(training)}
                            disabled={spotsLeft === 0}
                          >
                            {spotsLeft === 0 ? "Мест нет" : "Записаться"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Нет доступных тренировок"
                  description="В данный момент нет свободных тренировок для записи"
                />
              )}
            </div>
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership" className="space-y-6">
            {userMembership && (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border-2 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-card-foreground">
                    Текущий абонемент
                  </h3>
                  <StatusBadge status={userMembership.status} />
                </div>
                <div className="text-2xl font-bold text-card-foreground mb-2">
                  {membershipTypes.find((m) => m.type === userMembership.type)
                    ?.name || userMembership.type}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Действителен до
                    </div>
                    <div className="font-semibold text-card-foreground">
                      {format(new Date(userMembership.validUntil), "d MMMM yyyy", {
                        locale: ru,
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Осталось дней
                    </div>
                    <div className="font-semibold text-primary">
                      {getMembershipDaysLeft()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Посещений
                    </div>
                    <div className="font-semibold text-card-foreground">
                      {userMembership.visitsLeft === "unlimited"
                        ? "Безлимит"
                        : userMembership.visitsLeft}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Стоимость
                    </div>
                    <div className="font-semibold text-card-foreground">
                      {userMembership.price.toLocaleString()} ₽
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-card-foreground mb-6">
                Доступные абонементы
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {membershipTypes.map((membership) => (
                  <div
                    key={membership.type}
                    className={`rounded-2xl p-6 border-2 transition-all ${
                      membership.type === "premium"
                        ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5"
                        : "border-border bg-secondary"
                    }`}
                  >
                    {membership.type === "premium" && (
                      <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                        Популярный
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-card-foreground mb-2">
                      {membership.name}
                    </h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {membership.price.toLocaleString()} ₽
                      </span>
                      <span className="text-muted-foreground ml-2">
                        / {membership.duration} дней
                      </span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {membership.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={
                        membership.type === "premium" ? "default" : "outline"
                      }
                      onClick={() => handlePurchaseMembership(membership.type)}
                    >
                      Купить
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-card-foreground">
                  Личная информация
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setEditProfileModalOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Имя
                  </div>
                  <div className="font-semibold text-card-foreground">
                    {user.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Email
                  </div>
                  <div className="font-semibold text-card-foreground">
                    {user.email}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Телефон
                  </div>
                  <div className="font-semibold text-card-foreground">
                    {user.phone || "Не указан"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Роль
                  </div>
                  <div className="font-semibold text-card-foreground">
                    Клиент
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-card-foreground mb-6">
                Статистика
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-secondary rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {userVisits.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Всего посещений
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {confirmedBookings.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Активных записей
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {getMembershipDaysLeft()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Дней до окончания абонемента
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-card-foreground mb-6">
                История посещений
              </h3>
              {userVisits.length > 0 ? (
                <div className="space-y-3">
                  {userVisits.slice().reverse().map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                    >
                      <div>
                        <div className="font-semibold text-card-foreground mb-1">
                          {visit.activity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(visit.date), "d MMMM yyyy", {
                            locale: ru,
                          })}{" "}
                          • {visit.checkInTime}
                          {visit.checkOutTime && ` - ${visit.checkOutTime}`}
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Нет истории посещений"
                  description="Здесь будет отображаться история ваших посещений"
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedTraining && (
        <BookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          training={{
            title: selectedTraining.title,
            trainer: selectedTraining.trainerName,
            date: format(new Date(selectedTraining.date), "d MMMM yyyy", {
              locale: ru,
            }),
            time: selectedTraining.time,
            location: selectedTraining.location,
            spots: selectedTraining.maxSpots - selectedTraining.bookedSpots,
          }}
          onConfirm={handleConfirmBooking}
        />
      )}

      <PurchaseMembershipModal
        open={membershipModalOpen}
        onOpenChange={setMembershipModalOpen}
        membership={selectedMembership}
        onConfirm={handleConfirmPurchase}
      />

      <EditProfileModal
        open={editProfileModalOpen}
        onOpenChange={setEditProfileModalOpen}
        initialData={{
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          birthDate: "",
        }}
        onSave={handleSaveProfile}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Отменить запись?"
        description="Вы уверены, что хотите отменить запись на тренировку? Это действие нельзя отменить."
        confirmLabel="Да, отменить"
        cancelLabel="Нет, оставить"
        variant="destructive"
        onConfirm={handleConfirmCancelBooking}
      />
    </div>
  );
}
