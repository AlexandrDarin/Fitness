import { useState } from "react";
import { Button } from "../ui/button";
import { Clock, Users, MapPin, CheckCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { toast } from "sonner";

export function ScheduleSection() {
  const { isAuthenticated, user } = useAuth();
  const { getUserMembership } = useApp();
  const [selectedDay, setSelectedDay] = useState("Понедельник");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{ open: boolean; title: string }>({ open: false, title: "" });

  const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  const categories = ["Все", "Групповые", "Йога", "Силовые", "Кардио", "Единоборства"];

  const schedule = [
    { time: "07:00", title: "Утренняя йога", trainer: "Елена Волкова", category: "Йога", duration: "60 мин", capacity: "15 чел.", location: "Зал йоги" },
    { time: "09:00", title: "Функциональный тренинг", trainer: "Мария Петрова", category: "Групповые", duration: "45 мин", capacity: "20 чел.", location: "Групповой зал" },
    { time: "11:00", title: "Силовая тренировка", trainer: "Алексей Смирнов", category: "Силовые", duration: "60 мин", capacity: "12 чел.", location: "Тренажёрный зал" },
    { time: "14:00", title: "Бокс для начинающих", trainer: "Дмитрий Козлов", category: "Единоборства", duration: "60 мин", capacity: "10 чел.", location: "Зал единоборств" },
    { time: "17:00", title: "HIIT тренировка", trainer: "Мария Петрова", category: "Кардио", duration: "45 мин", capacity: "25 чел.", location: "Групповой зал" },
    { time: "19:00", title: "Вечерняя растяжка", trainer: "Елена Волкова", category: "Йога", duration: "45 мин", capacity: "15 чел.", location: "Зал йоги" },
  ];

  const handleBooking = async (training: any) => {
    if (!isAuthenticated) {
      toast.error("Войдите в систему", { description: "Для записи на тренировку необходимо авторизоваться" });
      return;
    }
    const membership = getUserMembership(user!.id);
    if (!membership) {
      toast.error("Нет активного абонемента", { description: "Для записи на тренировку необходимо приобрести абонемент" });
      return;
    }
    setBookingLoading(training.title);
    setTimeout(() => {
      setBookingLoading(null);
      setSuccessModal({ open: true, title: training.title });
    }, 1000);
  };

  const filteredSchedule = selectedCategory === "Все" ? schedule : schedule.filter(item => item.category === selectedCategory);

  return (
    <section id="schedule" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Расписание</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Планируйте тренировки</h2>
          <p className="text-lg text-muted-foreground">Более 120 групповых занятий в неделю в удобное для вас время</p>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {days.map((day) => (<Button key={day} variant={selectedDay === day ? "default" : "outline"} onClick={() => setSelectedDay(day)} className="whitespace-nowrap">{day}</Button>))}
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {categories.map((category) => (<Button key={category} variant={selectedCategory === category ? "default" : "ghost"} size="sm" onClick={() => setSelectedCategory(category)} className="whitespace-nowrap">{category}</Button>))}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredSchedule.map((item, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-primary/10 px-4 py-2 rounded-lg"><span className="font-semibold text-primary">{item.time}</span></div>
                    <div><h3 className="text-xl font-semibold text-card-foreground mb-1">{item.title}</h3><p className="text-sm text-muted-foreground">Тренер: {item.trainer}</p></div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{item.duration}</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4" />{item.capacity}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{item.location}</div>
                </div>
                <Button className="lg:w-auto bg-green-600 hover:bg-green-700" onClick={() => handleBooking(item)} disabled={bookingLoading === item.title}>
                  {bookingLoading === item.title ? "Запись..." : "Записаться"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">Полное расписание</Button>
        </div>
      </div>

      {successModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Запись подтверждена!</h3>
            <p className="text-gray-600 mb-4">Вы успешно записаны на тренировку "{successModal.title}"</p>
            <Button onClick={() => setSuccessModal({ open: false, title: "" })} className="w-full bg-green-600 hover:bg-green-700">Закрыть</Button>
          </div>
        </div>
      )}
    </section>
  );
}