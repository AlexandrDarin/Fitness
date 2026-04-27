import { Button } from "../ui/button";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { PurchaseModal, DetailsModal } from "../ui/Modals";

export function MembershipsSection() {
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsContent, setDetailsContent] = useState({ title: '', content: '' });

  const memberships = [
    {
      name: "Старт",
      price: "3 990",
      period: "месяц",
      description: "Идеально для начинающих",
      features: [
        "Тренажёрный зал",
        "Раздевалки и душевые",
        "Групповые тренировки (5 в месяц)",
        "Фитнес-тестирование",
      ],
      popular: false,
    },
    {
      name: "Премиум",
      price: "7 990",
      period: "месяц",
      description: "Самый популярный выбор",
      features: [
        "Тренажёрный зал 24/7",
        "Безлимит групповых тренировок",
        "Бассейн",
        "SPA-зона (сауна, хаммам)",
        "Персональная программа тренировок",
        "Скидка 20% на персональные тренировки",
      ],
      popular: true,
    },
    {
      name: "VIP",
      price: "14 990",
      period: "месяц",
      description: "Максимальный комфорт",
      features: [
        "Всё из тарифа Премиум",
        "Персональный тренер (4 тренировки)",
        "Приоритетная запись",
        "Отдельная VIP-зона",
        "Массаж (2 сеанса)",
        "Индивидуальный шкафчик",
        "Гостевые визиты (2 в месяц)",
      ],
      popular: false,
    },
  ];

  const handleBuyMembership = (membershipName: string) => {
    setSelectedMembership(membershipName);
    setShowPurchaseModal(true);
  };

  const handleDetailsClick = (type: string) => {
    if (type === 'yearly') {
      setDetailsContent({
        title: 'Скидка 20% на годовой абонемент',
        content: 'При оплате годового абонемента вы получаете скидку 20% от стоимости. Годовой абонемент также включает:\n\n• 2 месяца заморозки\n• 4 гостевых визита\n• Бесплатное фитнес-тестирование\n• Приоритетная запись на тренировки\n\nАкция действует до 31 декабря 2026 года.'
      });
    } else if (type === 'referral') {
      setDetailsContent({
        title: 'Приведи друга — получи бонус',
        content: 'За каждого приведённого друга, который купит абонемент на 3+ месяца, вы получаете:\n\n• 1 месяц бесплатного посещения\n• Бесплатная персональная тренировка\n• Скидка 30% на массаж\n• Именная скидочная карта 10%\n\nУсловия акции:\n• Друг должен указать ваше имя при покупке\n• Акция суммируется (5 друзей = 5 месяцев бесплатно)'
      });
    }
    setShowDetailsModal(true);
  };

  return (
    <section id="memberships" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* ... ваш существующий заголовок ... */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Абонементы</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Выберите свой тариф
          </h2>
          <p className="text-lg text-muted-foreground">
            Гибкие условия и выгодные предложения для достижения ваших целей
          </p>
        </div>

        {/* Карточки абонементов */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {memberships.map((membership, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-3xl p-8 border-2 transition-all duration-300 ${
                membership.popular
                  ? 'border-primary shadow-2xl shadow-primary/20 scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {membership.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" />
                    Популярный выбор
                  </div>
                </div>
              )}

              {/* ... ваш существующий контент карточки ... */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-card-foreground mb-2">
                  {membership.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {membership.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-card-foreground">
                    {membership.price}
                  </span>
                  <span className="text-muted-foreground">₽</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {membership.period}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {membership.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                variant={membership.popular ? "default" : "outline"}
                size="lg"
                onClick={() => handleBuyMembership(membership.name)}
              >
                Выбрать тариф
              </Button>
            </div>
          ))}
        </div>

        {/* Special Offers */}
        <div className="mt-16 bg-card rounded-3xl p-8 md:p-12 border border-border max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">
                Скидка 20% на годовой абонемент
              </h3>
              <p className="text-muted-foreground mb-4">
                Оплатите сразу 12 месяцев и получите существенную выгоду
              </p>
              <Button variant="outline" onClick={() => handleDetailsClick('yearly')}>
                Узнать подробнее
              </Button>
            </div>
            <div>
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">
                Приведи друга — получи бонус
              </h3>
              <p className="text-muted-foreground mb-4">
                Месяц бесплатного посещения за каждого приведённого друга
              </p>
              <Button variant="outline" onClick={() => handleDetailsClick('referral')}>
                Узнать подробнее
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        membershipName={selectedMembership || ''}
      />
      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={detailsContent.title}
      >
        <div className="whitespace-pre-wrap text-muted-foreground">
          {detailsContent.content}
        </div>
      </DetailsModal>
    </section>
  );
}