import { Star, Quote } from "lucide-react";

export function ReviewsSection() {
  const reviews = [
    {
      name: "Анна Соколова",
      role: "Клиент с 2024 года",
      rating: 5,
      text: "ECO FITNESS — это лучший фитнес-клуб, в котором я была. Современное оборудование, профессиональные тренеры и невероятная атмосфера. За полгода тренировок достигла всех своих целей!",
      image: "https://yaart-web-alice-images.s3.yandex.net/d25a824a31cb11f1ad22c62e5cc596f9:3",
    },
    {
      name: "Михаил Кузнецов",
      role: "Клиент с 2023 года",
      rating: 5,
      text: "Отличный клуб! Особенно нравится, что он работает круглосуточно — могу тренироваться в любое время. Бассейн и SPA-зона помогают восстановиться после тяжёлых тренировок.",
      image: "https://yaart-web-alice-images.s3.yandex.net/d25a824a31cb11f1ad22c62e5cc596f9:1",
    },
    {
      name: "Елена Морозова",
      role: "Клиент с 2025 года",
      rating: 5,
      text: "Прекрасные групповые занятия! Разнообразие программ позволяет не заскучать. Тренеры всегда готовы помочь и объяснить технику. Результаты заметны уже через месяц!",
      image: "https://yaart-web-alice-images.s3.yandex.net/3459cf3a31cc11f18d09666a69826437:3",
    },
    {
      name: "Дмитрий Волков",
      role: "Клиент с 2022 года",
      rating: 5,
      text: "Занимаюсь с персональным тренером уже 4 года. За это время полностью изменил своё тело и образ жизни. ECO FITNESS — это не просто клуб, это образ жизни!",
      image: "https://yaart-web-alice-images.s3.yandex.net/cb00416131cc11f185809e4ea3a14128:1",
    },
    {
      name: "Ольга Петрова",
      role: "Клиент с 2024 года",
      rating: 5,
      text: "Замечательный детский клуб! Пока я тренируюсь, мой ребёнок под присмотром профессиональных педагогов. Это очень удобно для родителей!",
      image: "https://yaart-web-alice-images.s3.yandex.net/f672c89231cd11f1a472367a16fcfac4:1",
    },
    {
      name: "Сергей Иванов",
      role: "Клиент с 2023 года",
      rating: 5,
      text: "Премиальный сервис во всём! Чистота, порядок, новое оборудование. Персонал всегда вежливый и готов помочь. Рекомендую всем, кто ценит качество!",
      image: "https://yaart-web-alice-images.s3.yandex.net/ae52193e31ce11f1bc80667f9eb495d6:1",
    },
  ];

  return (
    <section id="reviews" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Отзывы</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Что говорят наши клиенты
          </h2>
          <p className="text-lg text-muted-foreground">
            Более 5000 человек уже изменили свою жизнь с ECO FITNESS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-muted-foreground mb-6 relative z-10">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-card-foreground">
                    {review.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 max-w-2xl mx-auto bg-card rounded-3xl p-8 md:p-12 border border-border text-center">
          <div className="text-6xl font-bold text-primary mb-3">5.0</div>
          <div className="flex items-center justify-center gap-2 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-muted-foreground">
            Средняя оценка на основе 1,250+ отзывов
          </p>
        </div>
      </div>
    </section>
  );
}
