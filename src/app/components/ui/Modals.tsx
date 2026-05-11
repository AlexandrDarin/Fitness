import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto border border-border shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Модальное окно для отправки заявки
export function ApplicationModal({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
      onClose();
      alert('✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Отправить заявку">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Ваше имя *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Иван Иванов"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Телефон *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="ivan@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Сообщение</label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ваш вопрос или пожелания..."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </button>
      </form>
    </Modal>
  );
}

// Модальное окно для политики конфиденциальности
export function PrivacyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Политика конфиденциальности">
      <div className="space-y-4 text-muted-foreground">
        <p className="text-sm">Последнее обновление: 6 апреля 2026 г.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">1. Общие положения</h3>
        <p>Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые ECO FITNESS.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">2. Какие данные мы собираем</h3>
        <p>Мы собираем следующие персональные данные: имя, номер телефона, адрес электронной почты, а также информацию о посещениях клуба и тренировках.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">3. Цели обработки данных</h3>
        <p>Ваши данные используются для: предоставления услуг клуба, связи с вами, рассылки информации о акциях и новостях, улучшения качества обслуживания.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">4. Защита данных</h3>
        <p>Мы принимаем необходимые организационные и технические меры для защиты вашей персональной информации от неправомерного доступа, уничтожения, изменения, блокирования, копирования, распространения.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">5. Ваши права</h3>
        <p>Вы имеете право на получение информации, касающейся обработки ваших персональных данных, на уточнение, блокирование или уничтожение ваших персональных данных в случае, если они являются неполными, устаревшими, недостоверными.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">6. Контакты</h3>
        <p>По всем вопросам обработки персональных данных вы можете обратиться по email: privacy@ecofitness.ru или по телефону: +7 (499) 123-45-67.</p>
      </div>
    </Modal>
  );
}

// Модальное окно для публичной оферты
export function OfferModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Публичная оферта">
      <div className="space-y-4 text-muted-foreground">
        <p className="text-sm">Последнее обновление: 6 апреля 2026 г.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">1. Предмет договора</h3>
        <p>ECO FITNESS (далее — «Исполнитель») предоставляет физкультурно-оздоровительные услуги, а Клиент (далее — «Заказчик») оплачивает эти услуги на условиях настоящей оферты.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">2. Стоимость услуг и порядок оплаты</h3>
        <p>Стоимость услуг определяется действующим прайс-листом Исполнителя. Оплата производится 100% предоплатой за выбранный период.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">3. Права и обязанности сторон</h3>
        <p>Исполнитель обязуется предоставить услуги надлежащего качества. Заказчик обязуется соблюдать правила посещения клуба и своевременно оплачивать услуги.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">4. Возврат денежных средств</h3>
        <p>Возврат денежных средств осуществляется в соответствии с Законом РФ «О защите прав потребителей».</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">5. Ответственность сторон</h3>
        <p>Исполнитель не несет ответственности за травмы, полученные в результате нарушения Заказчиком правил техники безопасности.</p>
        
        <h3 className="text-lg font-semibold text-foreground mt-6">6. Реквизиты</h3>
        <p>ООО «ЭКО ФИТНЕС»<br />
        ИНН: 7701234567<br />
        КПП: 770101001<br />
        ОГРН: 1237700012345<br />
        Юр. адрес: г. Москва, ул. Спортивная, д. 25</p>
      </div>
    </Modal>
  );
}

// Модальное окно для покупки абонемента
export function PurchaseModal({ isOpen, onClose, membershipName }: { 
  isOpen: boolean; 
  onClose: () => void; 
  membershipName: string;
}) {
  const handleConfirm = () => {
    alert(`✅ Спасибо за покупку абонемента "${membershipName}"!\n\nНаш менеджер свяжется с вами в ближайшее время для оформления.`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Оформление абонемента">
      <div className="text-center space-y-6">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Вы выбрали тариф "{membershipName}"</h3>
          <p className="text-muted-foreground">
            Для оформления абонемента, пожалуйста, оставьте свои контактные данные. Наш менеджер свяжется с вами для подтверждения.
          </p>
        </div>
        <button
          onClick={handleConfirm}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Подтвердить
        </button>
      </div>
    </Modal>
  );
}

// Модальное окно для направлений
export interface DirectionDetails {
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  features: string[];
  duration?: string;
  price?: string;
}

export function DirectionDetailsModal({ 
  isOpen, 
  onClose, 
  direction 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  direction: DirectionDetails | null;
}) {
  if (!direction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={direction.title}>
      <div className="space-y-4">
        <img src={direction.image} alt={direction.title} className="w-full h-48 object-cover rounded-lg" />
        <p className="text-muted-foreground">{direction.fullDescription}</p>
        <div className="border-t border-border pt-4">
          <h4 className="font-semibold mb-2">Условия проведения:</h4>
          <ul className="space-y-1">
            {direction.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        {(direction.duration || direction.price) && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {direction.duration && (
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground">Длительность</p>
                <p className="font-semibold">{direction.duration}</p>
              </div>
            )}
            {direction.price && (
              <div className="text-center p-3 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground">Стоимость</p>
                <p className="font-semibold text-primary">{direction.price}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function DetailsModal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Modal>
  );
}