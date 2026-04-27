import { useState } from "react";
import { Button } from "../ui/button";
import { Clock, Users, MapPin } from "lucide-react";

export function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState("Понедельник");
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  const categories = ["Все", "Групповые", "Йога", "Силовые", "Кардио", "Единоборства"];

  const schedule = [
    {
      time: "07:00",
      title: "Утренняя йога",
      trainer: "Елена Волкова",
      category: "Йога",
      duration: "60 мин",
      capacity: "15 чел.",
      location: "Зал йоги",
    },
    {
      time: "09:00",
      title: "Функциональный тренинг",
      trainer: "Мария Петрова",
      category: "Групповые",
      duration: "45 мин",
      capacity: "20 чел.",
      location: "Групповой зал",
    },
    {
      time: "11:00",
      title: "Силовая тренировка",
      trainer: "Алексей Смирнов",
      category: "Силовые",
      duration: "60 мин",
      capacity: "12 чел.",
      location: "Тренажёрный зал",
    },
    {
      time: "14:00",
      title: "Бокс для начинающих",
      trainer: "Дмитрий Козлов",
      category: "Единоборства",
      duration: "60 мин",
      capacity: "10 чел.",
      location: "Зал единоборств",
    },
    {
      time: "17:00",
      title: "HIIT тренировка",
      trainer: "Мария Петрова",
      category: "Кардио",
      duration: "45 мин",
      capacity: "25 чел.",
      location: "Групповой зал",
    },
    {
      time: "19:00",
      title: "Вечерняя растяжка",
      trainer: "Елена Волкова",
      category: "Йога",
      duration: "45 мин",
      capacity: "15 чел.",
      location: "Зал йоги",
    },
  ];

  const filteredSchedule = selectedCategory === "Все" 
    ? schedule 
    : schedule.filter(item => item.category === selectedCategory);

  return (
    <section id="schedule" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Расписание</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Планируйте тренировки
          </h2>
          <p className="text-lg text-muted-foreground">
            Более 120 групповых занятий в неделю в удобное для вас время
          </p>
        </div>

        {/* Day Selector */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {days.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                onClick={() => setSelectedDay(day)}
                className="whitespace-nowrap"
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid gap-4">
          {filteredSchedule.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Time & Title */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-primary/10 px-4 py-2 rounded-lg">
                      <span className="font-semibold text-primary">{item.time}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Тренер: {item.trainer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {item.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {item.capacity}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                </div>

                {/* Action */}
                <Button className="lg:w-auto">
                  Записаться
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Полное расписание
          </Button>
        </div>
      </div>
    </section>
  );
}
