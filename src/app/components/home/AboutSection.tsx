import { Award, Target, Heart, Users } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      icon: Award,
      title: "Премиальное качество",
      description: "Только профессиональное оборудование от мировых брендов",
    },
    {
      icon: Target,
      title: "Достигайте целей",
      description: "Индивидуальный план тренировок под ваши задачи",
    },
    {
      icon: Heart,
      title: "Забота о здоровье",
      description: "Медицинский контроль и безопасность на всех этапах",
    },
    {
      icon: Users,
      title: "Профессиональная команда",
      description: "Сертифицированные тренеры с международным опытом",
    },
  ];

  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">О клубе</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Почему выбирают Wire Fitness
          </h2>
          <p className="text-lg text-muted-foreground">
            Мы создали пространство, где каждый найдёт мотивацию для достижения своих целей. 
            Современные технологии, премиальный сервис и атмосфера успеха.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 bg-card rounded-3xl p-12 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Активных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">35</div>
              <div className="text-muted-foreground">Тренеров</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">120+</div>
              <div className="text-muted-foreground">Тренировок в неделю</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">8</div>
              <div className="text-muted-foreground">Лет на рынке</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
