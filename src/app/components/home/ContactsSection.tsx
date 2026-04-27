import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { PrivacyModal } from "../ui/Modals";

export function ContactsSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Валидация
    if (!formData.name || !formData.phone) {
      alert('Пожалуйста, заполните обязательные поля: Имя и Телефон');
      setIsSubmitting(false);
      return;
    }

    // Имитация отправки
    setTimeout(() => {
      console.log('Форма отправлена:', formData);
      alert('✅ Спасибо! Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время.');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+74951234567';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@ecofitness.ru';
  };

  return (
    <section id="contacts" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Контакты</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Свяжитесь с нами
          </h2>
          <p className="text-lg text-muted-foreground">
            Ответим на все вопросы и поможем выбрать подходящий абонемент
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 border border-border">
            <h3 className="text-2xl font-bold text-card-foreground mb-6">
              Оставьте заявку
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-card-foreground">
                  Имя *
                </label>
                <Input 
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-card-foreground">
                  Телефон *
                </label>
                <Input 
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-card-foreground">
                  Email
                </label>
                <Input 
                  type="email" 
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-card-foreground">
                  Сообщение
                </label>
                <Textarea 
                  placeholder="Расскажите о ваших целях и пожеланиях" 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button size="lg" className="w-full" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <button 
                  type="button"
                  onClick={() => setShowPrivacy(true)} 
                  className="text-primary hover:underline"
                >
                  политикой конфиденциальности
                </button>
              </p>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Address */}
            <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">
                    Адрес
                  </h3>
                  <p className="text-muted-foreground">
                    г. Москва, ул. Спортивная, д. 25
                  </p>
                  <p className="text-muted-foreground">
                    м. Спортивная (5 минут пешком)
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div 
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition cursor-pointer"
              onClick={handlePhoneClick}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">
                    Телефон
                  </h3>
                  <a 
                    href="tel:+74951234567" 
                    className="text-muted-foreground hover:text-primary transition-colors block"
                  >
                    +7 (495) 123-45-67
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Звонки принимаются круглосуточно
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div 
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition cursor-pointer"
              onClick={handleEmailClick}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">
                    Email
                  </h3>
                  <a 
                    href="mailto:info@ecofitness.ru" 
                    className="text-muted-foreground hover:text-primary transition-colors block"
                  >
                    info@ecofitness.ru
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ответим в течение 24 часов
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">
                    Режим работы
                  </h3>
                  <p className="text-muted-foreground">
                    Тренажёрный зал: 24/7
                  </p>
                  <p className="text-muted-foreground">
                    Групповые занятия: 07:00 - 22:00
                  </p>
                  <p className="text-muted-foreground">
                    Рецепция: 06:00 - 23:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно политики конфиденциальности */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </section>
  );
}