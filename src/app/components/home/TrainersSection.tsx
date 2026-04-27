import { Button } from "../ui/button";
import { Star, Award } from "lucide-react";

export function TrainersSection() {
  const trainers = [
    {
      name: "Алексей Смирнов",
      specialization: "Персональный тренинг, реабилитация",
      experience: "12 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/0ccf06d131ca11f1ad22c62e5cc596f9:1 ",
      rating: 5.0,
      certified: true,
    },
    {
      name: "Мария Петрова",
      specialization: "Групповые тренировки, функциональный тренинг",
      experience: "8 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/235130f531c511f19195cab6cc048e22:4",
      rating: 5.0,
      certified: true,
    },
    {
      name: "Дмитрий Козлов",
      specialization: "Единоборства, силовой тренинг",
      experience: "10 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/c6795ce231c411f19bddc26dd85608fb:1",
      rating: 4.9,
      certified: true,
    },
    {
      name: "Елена Волкова",
      specialization: "Йога, пилатес, стретчинг",
      experience: "6 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/235130f531c511f19195cab6cc048e22:3",
      rating: 5.0,
      certified: true,
    },
  ];

  return (
    <section id="trainers" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Тренеры</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Профессиональная команда
          </h2>
          <p className="text-lg text-muted-foreground">
            Наши тренеры — сертифицированные специалисты с многолетним опытом и международными квалификациями
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 group"
            >
              {/* Photo */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {trainer.certified && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1 text-xs">
                    <Award className="w-3 h-3" />
                    Сертифицирован
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {trainer.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {trainer.specialization}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {trainer.experience}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-card-foreground">
                      {trainer.rating}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                    Подробнее →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Все тренеры
          </Button>
        </div>
      </div>
    </section>
  );
}
