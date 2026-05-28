import { Link } from "react-router";
import { Dumbbell, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="bg-primary p-2 rounded-xl"><Dumbbell className="w-5 h-5 text-primary-foreground" /></div>
              <div className="flex flex-col"><span className="font-bold text-foreground">Wire Fitness</span><span className="text-xs text-muted-foreground">Premium Club</span></div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">Премиальный фитнес-клуб с современным оборудованием, профессиональными тренерами и индивидуальным подходом к каждому клиенту.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a3 3 0 0 0-2.11-2.11C16.12 4.2 12 4.2 12 4.2s-4.12 0-5.48.38a3 3 0 0 0-2.11 2.11C4.2 8.12 4.2 12 4.2 12s0 3.88.38 5.31a3 3 0 0 0 2.11 2.11c1.36.38 5.48.38 5.48.38s4.12 0 5.48-.38a3 3 0 0 0 2.11-2.11c.38-1.43.38-5.31.38-5.31s0-3.88-.38-5.31zM9.75 14.5v-5l4.5 2.5-4.5 2.5z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 5.37a.86.86 0 0 0-.69-.46 14.22 14.22 0 0 0-4.08-.64c-.32 0-.56.19-.66.45l-.29.61a11.5 11.5 0 0 0-3.46 0l-.29-.61a.77.77 0 0 0-.66-.45 14.22 14.22 0 0 0-4.08.64.86.86 0 0 0-.69.46A9.8 9.8 0 0 0 4 10.7a9.91 9.91 0 0 0 2.58 5.33c.31.35.7.63 1.13.84.39.18.8.31 1.22.38.5.1 1.02.1 1.53-.03l.14-.03c.3-.08.59-.2.86-.37l-.02-.03a6.36 6.36 0 0 0 1.56-1.58 7.05 7.05 0 0 1-2.46-.84 5.97 5.97 0 0 1-1.45-1.1c.32.03.64.05.96.05h.02c.21 0 .42-.02.63-.05a6.03 6.03 0 0 1-1.36-.95 5.28 5.28 0 0 1-1.02-1.53c.34.1.69.16 1.05.18a5.83 5.83 0 0 1-1.56-2.16c.42.19.87.32 1.33.38a6.93 6.93 0 0 1-2.1-2.8 7.85 7.85 0 0 1-.25-1.75c.79.47 1.7.74 2.64.8a7.3 7.3 0 0 1-2.64-3.12c.94.46 1.96.71 3.01.75a6.9 6.9 0 0 1-1.68-2.3c.48.28 1 .48 1.54.6a7.57 7.57 0 0 1-2.38-2.8 7.2 7.2 0 0 1-.34-1.48 12.2 12.2 0 0 0 3.45 1.13 8.9 8.9 0 0 0 1.9.2c.34 0 .68-.03 1.02-.08a11.37 11.37 0 0 0 3.46-1.13c.1.5.28.98.54 1.43a9.17 9.17 0 0 1-2.38 2.8c.58-.12 1.14-.32 1.66-.6a7.65 7.65 0 0 1-1.68 2.3 11.8 11.8 0 0 0 3.01-.75 7.3 7.3 0 0 1-2.64 3.12c.94-.06 1.85-.33 2.64-.8a7.85 7.85 0 0 1-.25 1.75 6.93 6.93 0 0 1-2.1 2.8c.46-.06.91-.19 1.33-.38a5.28 5.28 0 0 1-1.02 1.53 5.83 5.83 0 0 1-1.36.95c.21.03.42.05.63.05h.02c.32 0 .64-.02.96-.05a5.97 5.97 0 0 1-1.45 1.1 7.05 7.05 0 0 1-2.46.84 6.36 6.36 0 0 0 1.56 1.58l-.02.03c.27.17.56.29.86.37l.14.03c.51.13 1.03.13 1.53.03.43-.07.84-.2 1.22-.38.44-.21.83-.49 1.14-.84a9.91 9.91 0 0 0 2.58-5.33 9.8 9.8 0 0 0-.78-4.97z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Навигация</h4>
            <ul className="space-y-3">
              <li><button onClick={() => scrollToSection('about')} className="text-sm text-muted-foreground hover:text-primary transition-colors">О клубе</button></li>
              <li><button onClick={() => scrollToSection('directions')} className="text-sm text-muted-foreground hover:text-primary transition-colors">Направления</button></li>
              <li><button onClick={() => scrollToSection('trainers')} className="text-sm text-muted-foreground hover:text-primary transition-colors">Тренеры</button></li>
              <li><button onClick={() => scrollToSection('schedule')} className="text-sm text-muted-foreground hover:text-primary transition-colors">Расписание</button></li>
              <li><button onClick={() => scrollToSection('memberships')} className="text-sm text-muted-foreground hover:text-primary transition-colors">Абонементы</button></li>
            </ul>
          </div>

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

          <div>
            <h4 className="font-semibold text-foreground mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-sm text-muted-foreground">г. Москва, ул. Спортивная, д. 25</span></li>
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary shrink-0" /><a href="tel:+74951234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">+7 (495) 123-45-67</a></li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary shrink-0" /><a href="mailto:info@wirefitness.ru" className="text-sm text-muted-foreground hover:text-primary transition-colors">info@wirefitness.ru</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 Wire Fitness. Все права защищены.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Публичная оферта</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}