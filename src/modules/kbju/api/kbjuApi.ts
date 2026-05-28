const BASE_URL = '/api/kbju';

export const kbjuApi = {
  searchProducts: async (query: string) => {
    console.log(`Ищем продукты по запросу: ${query}`);
  },
  getDiary: async (date: string) => {
    console.log(`Получаем дневник за ${date}`);
  },
  addDiaryEntry: async (productId: number, grams: number, mealType: string) => {
    console.log(`Добавляем продукт ${productId}, ${grams}г в ${mealType}`);
  }
};
