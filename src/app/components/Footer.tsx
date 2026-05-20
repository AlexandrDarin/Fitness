import { Link } from "react-router";
import { Dumbbell, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* О клубе */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="bg-primary p-2 rounded-xl">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground">Wire Fitness</span>
                <span className="text-xs text-muted-foreground">Premium Club</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Премиальный фитнес-клуб с современным оборудованием, профессиональными тренерами и индивидуальным подходом к каждому клиенту.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Навигация</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('about')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  О клубе
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('directions')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Направления
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('trainers')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Тренеры
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('schedule')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Расписание
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('memberships')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Абонементы
                </button>
              </li>
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Услуги</h4>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">Тренажёрный зал</li>
              <li className="text-sm text-muted-foreground">Групповые тренировки</li>
              <li className="text-sm text-muted-foreground">Персональный тренинг</li>
              <li className="text-sm text-muted-foreground">Бассейн</li>
              <li className="text-sm text-muted-foreground">SPA-зона</li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  г. Москва, ул. Спортивная, д. 25
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+74951234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +7 (495) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@wirefitness.ru" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@wirefitness.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Wire Fitness. Все права защищены.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Публичная оферта
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
