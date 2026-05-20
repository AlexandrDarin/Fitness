import { Dumbbell, Heart, Swords, Flower2, Users, Baby, Waves, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { DirectionDetailsModal, DirectionDetails } from "../ui/Modals";

export function DirectionsSection() {
  const [selectedDirection, setSelectedDirection] = useState<DirectionDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDetails = (direction: DirectionDetails) => {
    setSelectedDirection(direction);
    setModalOpen(true);
  };

  const directionsData: DirectionDetails[] = [
    {
      title: "Тренажёрный зал",
      description: "Современное оборудование для силовых и кардио тренировок",
      fullDescription: "Наш тренажёрный зал оснащён самым современным оборудованием от ведущих мировых производителей. Просторные зоны для кардио и силовых тренировок позволяют комфортно заниматься в любое время.",
      image: "https://yaart-web-alice-images.s3.yandex.net/13d89a9f542911f1af87dedad3e518de:1",
      features: [
        "Более 50 единиц силового оборудования",
        "30+ кардиотренажёров",
        "Зона функционального тренинга",
        "Бесплатное фитнес-тестирование",
      ],
      duration: "24/7",
      price: "от 3 990 ₽/мес"
    },
    {
      title: "Групповые тренировки",
      description: "Более 30 видов групповых занятий на любой вкус",
      fullDescription: "В нашем фитнес-клубе представлено более 30 направлений групповых программ: от энергичных танцевальных классов до спокойной йоги.",
      image: "https://yaart-web-alice-images.s3.yandex.net/3e93602e542911f1952e22bdcf9e15b8:2",
      features: [
        "30+ направлений на выбор",
        "Опытные инструкторы",
        "Утренние, дневные и вечерние группы",
        "Безлимитное посещение",
      ],
      duration: "60–90 мин",
      price: "включено в абонемент"
    },
    {
      title: "Единоборства",
      description: "Бокс, кикбоксинг, MMA с профессиональными тренерами",
      fullDescription: "Зал единоборств оснащён профессиональными рингами, грушами, мешками и всем необходимым оборудованием.",
      image: "https://yaart-web-alice-images.s3.yandex.net/7273b7b0542911f18f99f2d8a0c99347:1",
      features: [
        "Бокс, кикбоксинг, MMA",
        "Ринг и зона с мешками",
        "Спарринг-партнёры",
        "Групповые и персональные занятия",
      ],
      duration: "60–90 мин",
      price: "от 5 000 ₽/мес"
    },
    {
      title: "Йога и пилатес",
      description: "Гармония тела и разума в специально оборудованных залах",
      fullDescription: "Светлые, просторные залы с панорамными окнами создают идеальную атмосферу для практики йоги и пилатеса.",
      image: "https://yaart-web-alice-images.s3.yandex.net/a2f7d424542911f1aabb3e778ec87452:1",
      features: [
        "10+ видов йоги",
        "Пилатес на реформерах",
        "Медитационные практики",
        "Группы для начинающих",
      ],
      duration: "75–90 мин",
      price: "включено в абонемент"
    },
    {
      title: "Бассейн",
      description: "25-метровый бассейн с подогревом и аквааэробика",
      fullDescription: "Просторный 25-метровый бассейн с 6 дорожками, комфортная температура воды 27-28°C.",
      image: "https://yaart-web-alice-images.s3.yandex.net/bb05e5bc542911f1815dc6d8f4207592:1",
      features: [
        "25 метров, 6 дорожек",
        "Температура воды 27-28°C",
        "Аквааэробика и аквайога",
        "Обучение плаванию",
      ],
      duration: "45–60 мин",
      price: "включено в Премиум"
    },
    {
      title: "SPA-зона",
      description: "Сауна, хаммам, массаж для полного восстановления",
      fullDescription: "Роскошная SPA-зона для полного расслабления после тренировок. Финская сауна, турецкий хаммам, массаж.",
      image: "https://yaart-web-alice-images.s3.yandex.net/d696e90d542911f1bc95ce9a942b3bc4:1",
      features: [
        "Финская сауна",
        "Турецкий хаммам",
        "Инфракрасная кабина",
        "Массажный кабинет",
      ],
      duration: "неограниченно",
      price: "включено в Премиум"
    },
    {
      title: "Кроссфит",
      description: "Функциональный тренинг для максимальных результатов",
      fullDescription: "Специализированная зона для кроссфита с профессиональным оборудованием.",
      image: "https://yaart-web-alice-images.s3.yandex.net/e99429ea542911f1905c82618675ee7d:1",
      features: [
        "Полный набор оборудования",
        "WOD разной сложности",
        "Сертифицированные тренеры",
        "Командные тренировки",
      ],
      duration: "60 мин",
      price: "включено в абонемент"
    },
    {
      title: "Детский клуб",
      description: "Программы развития и тренировки для детей от 3 лет",
      fullDescription: "Детский клуб с профессиональными педагогами и тренерами. Программы развития: ОФП, плавание, гимнастика.",
      image: "https://yaart-web-alice-images.s3.yandex.net/00c56c96542a11f1b508dec16a0cd269:1",
      features: [
        "Дети от 3 до 15 лет",
        "ОФП и общеразвивающие программы",
        "Обучение плаванию",
        "Летний спортивный лагерь",
      ],
      duration: "45–60 мин",
      price: "от 2 500 ₽/занятие"
    },
  ];

  const iconsMap: Record<string, any> = {
    "Тренажёрный зал": Dumbbell,
    "Групповые тренировки": Users,
    "Единоборства": Swords,
    "Йога и пилатес": Flower2,
    "Бассейн": Waves,
    "SPA-зона": Sparkles,
    "Кроссфит": Heart,
    "Детский клуб": Baby,
  };

  return (
    <section id="directions" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Направления</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Тренировки на любой вкус
          </h2>
          <p className="text-lg text-muted-foreground">
            От силовых тренировок до йоги — найдите то, что подходит именно вам
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {directionsData.map((direction, index) => {
            const Icon = iconsMap[direction.title] || Dumbbell;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                onClick={() => handleOpenDetails(direction)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={direction.image}
                    alt={direction.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {direction.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {direction.description}
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                    Подробнее →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DirectionDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        direction={selectedDirection}
      />
    </section>
  );
}