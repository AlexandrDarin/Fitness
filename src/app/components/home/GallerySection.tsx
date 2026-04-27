import { useState } from "react";

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const categories = ["Все", "Залы", "Бассейн", "SPA", "Групповые занятия"];

  const gallery = [
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/1c88431d31c611f1b10192ae4ac67c08:1",
      title: "Тренажёрный зал",
      category: "Залы",
    },
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/63c53e9d31c611f192f47e61ecf83566:1",
      title: "Бассейн 25 метров",
      category: "Бассейн",
    },
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/fbae636531c611f1a028bae3b25bf788:1",
      title: "Групповые тренировки",
      category: "Групповые занятия",
    },
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/1a454e9931c211f1a442be4dae8ccf49:1",
      title: "SPA-зона",
      category: "SPA",
    },
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/327cfad231c911f19d6de676f5c8961e:1",
      title: "Зал для йоги",
      category: "Залы",
    },
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/5b59a6a931c711f1973bb6fa7ad1afd2:1",
      title: "Зал единоборств",
      category: "Залы",
    },
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/84a059bc31c711f19dcf66327cb4ba83:1",
      title: "Кроссфит зона",
      category: "Групповые занятия",
    },
    {
      image: "https://yaart-web-alice-images.s3.yandex.net/editing_result_8ad0fa7931c811f1bc80667f9eb495d6:1",
      title: "Рецепция",
      category: "Залы",
    },
  ];

  const filteredGallery = selectedCategory === "Все" 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-primary">Галерея</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Современное пространство
          </h2>
          <p className="text-lg text-muted-foreground">
            Премиальное оборудование и комфортная атмосфера для эффективных тренировок
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-center gap-2 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border border-border hover:border-primary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-semibold text-lg">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
