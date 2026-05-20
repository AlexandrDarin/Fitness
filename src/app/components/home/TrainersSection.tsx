import { useState } from "react";
import { Button } from "../ui/button";
import { Star, Award, X, Mail, Phone } from "lucide-react";

export function TrainersSection() {
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const trainers = [
    {
      name: "Алексей Смирнов",
      specialization: "Персональный тренинг, реабилитация",
      experience: "12 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/3efcc6c8542a11f189eaf248a2d2a64e:1",
      rating: 5.0,
      certified: true,
      email: "alexey@wirefitness.ru",
      phone: "+7 (495) 123-45-67",
      bio: "Мастер спорта по пауэрлифтингу. Специализируюсь на силовом тренинге и реабилитации после травм. Индивидуальный подход к каждому клиенту."
    },
    {
      name: "Мария Петрова",
      specialization: "Групповые тренировки, функциональный тренинг",
      experience: "8 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/74932c09542a11f1a974f2c6bc857581:2",
      rating: 5.0,
      certified: true,
      email: "maria@wirefitness.ru",
      phone: "+7 (495) 234-56-78",
      bio: "Сертифицированный тренер по функциональному тренингу. Помогаю достичь результатов в групповых и индивидуальных занятиях."
    },
    {
      name: "Дмитрий Козлов",
      specialization: "Единоборства, силовой тренинг",
      experience: "10 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/3efcc6c8542a11f189eaf248a2d2a64e:2",
      rating: 4.9,
      certified: true,
      email: "dmitry@wirefitness.ru",
      phone: "+7 (495) 345-67-89",
      bio: "Кандидат в мастера спорта по боксу. Провожу тренировки по единоборствам и силовому тренингу."
    },
    {
      name: "Елена Волкова",
      specialization: "Йога, пилатес, стретчинг",
      experience: "6 лет опыта",
      image: "https://yaart-web-alice-images.s3.yandex.net/74932c09542a11f1a974f2c6bc857581:1",
      rating: 5.0,
      certified: true,
      email: "elena@wirefitness.ru",
      phone: "+7 (495) 456-78-90",
      bio: "Сертифицированный инструктор по йоге и пилатесу. Практикую более 15 лет. Помогаю обрести гармонию тела и духа."
    },
  ];

  const handleOpenDetails = (trainer: any) => {
    setSelectedTrainer(trainer);
    setModalOpen(true);
  };

  return (
    <>
      <section id="trainers" className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <span className="text-sm text-primary">Тренеры</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Профессиональная команда</h2>
            <p className="text-lg text-muted-foreground">Наши тренеры — сертифицированные специалисты с многолетним опытом и международными квалификациями</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainers.map((trainer, index) => (
              <div key={index} className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 group">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {trainer.certified && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1 text-xs">
                      <Award className="w-3 h-3" />
                      Сертифицирован
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{trainer.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{trainer.specialization}</p>
                  <p className="text-sm text-muted-foreground mb-4">{trainer.experience}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-card-foreground">{trainer.rating}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto" onClick={() => handleOpenDetails(trainer)}>
                      Подробнее →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Модальное окно с подробной информацией о тренере */}
      {modalOpen && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedTrainer.name}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img src={selectedTrainer.image} alt={selectedTrainer.name} className="w-full md:w-48 h-48 object-cover rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2"><Award className="w-5 h-5 text-green-600" /><span className="text-gray-600">Сертифицированный тренер</span></div>
                  <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /><span className="text-gray-600">Рейтинг: {selectedTrainer.rating}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-green-600" /><span className="text-gray-600">{selectedTrainer.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-green-600" /><span className="text-gray-600">{selectedTrainer.phone}</span></div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">О тренере</h3>
                <p className="text-gray-600 leading-relaxed">{selectedTrainer.bio}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Специализация</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.specialization.split(", ").map((spec: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{spec}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}