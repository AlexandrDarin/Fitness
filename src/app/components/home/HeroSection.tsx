import { Button } from "../ui/button";
import { ArrowRight, MapPin, Users, Clock, Waves } from "lucide-react";
import { useState } from "react";
import { PrivacyModal, OfferModal, ApplicationModal } from "../ui/Modals";

interface HeroSectionProps {
  onScrollToMemberships: () => void;
  onScrollToTour: () => void;
}

export function HeroSection({ onScrollToMemberships, onScrollToTour }: HeroSectionProps) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showApplication, setShowApplication] = useState(false);

  const handleApplicationSubmit = (data: any) => {
    console.log('Заявка отправлена:', data);
    // Здесь можно добавить отправку на сервер API
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - ваш существующий код */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1766031263281-43cdaa6e624a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmaXRuZXNzJTIwY2x1YiUyMGV4dGVyaW9yJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzc1MDY3NjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Фасад ECO FITNESS"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
      </div>

      {/* Кнопка "Далее" (вниз) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="animate-bounce bg-primary/20 hover:bg-primary/30 backdrop-blur-sm text-primary p-3 rounded-full transition-all duration-300"
          aria-label="Далее"
        >
          <ArrowRight className="w-6 h-6 rotate-90" />
        </button>
      </div>

      {/* Content - ваш существующий код */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 pb-20">
        {/* ... ваш существующий контент HeroSection ... */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm text-primary">Премиальный фитнес-клуб в Москве</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Измените своё тело,
            <br />
            <span className="text-primary">измените жизнь</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Современное оборудование, профессиональные тренеры и индивидуальный подход. 
            Достигайте целей вместе с ECO FITNESS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="text-lg px-8 py-6" onClick={onScrollToMemberships}>
              Купить абонемент
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={onScrollToTour}>
              Виртуальный тур
            </Button>
          </div>

          {/* Stats - ваш существующий код */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* ... stats ... */}
          </div>
        </div>
      </div>

      {/* Футер с ссылками */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground border-t border-border bg-background/80 backdrop-blur-sm z-20">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-4">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-primary transition">
            Политика конфиденциальности
          </button>
          <span>•</span>
          <button onClick={() => setShowOffer(true)} className="hover:text-primary transition">
            Публичная оферта
          </button>
          <span>•</span>
          <button onClick={() => setShowApplication(true)} className="hover:text-primary transition">
            Связаться с нами
          </button>
        </div>
      </footer>

      {/* Модальные окна */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <OfferModal isOpen={showOffer} onClose={() => setShowOffer(false)} />
      <ApplicationModal 
        isOpen={showApplication} 
        onClose={() => setShowApplication(false)}
        onSubmit={handleApplicationSubmit}
      />
    </section>
  );
}