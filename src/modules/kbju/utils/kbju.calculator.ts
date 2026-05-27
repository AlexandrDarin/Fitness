export const calculateKBJU = (product: any, grams: number) => {
  const factor = grams / 100;
  return {
    calories: Math.round(product.calories_per_100g * factor),
    proteins: Math.round(product.proteins_per_100g * factor * 10) / 10,
    fats:     Math.round(product.fats_per_100g * factor * 10) / 10,
    carbs:    Math.round(product.carbs_per_100g * factor * 10) / 10,
  };
};

export const sumKBJU = (entries: any[]) => {
  return entries.reduce((acc, entry) => ({
    calories: acc.calories + (entry.kbju?.calories || 0),
    proteins: acc.proteins + (entry.kbju?.proteins || 0),
    fats:     acc.fats     + (entry.kbju?.fats || 0),
    carbs:    acc.carbs    + (entry.kbju?.carbs || 0),
  }), { calories: 0, proteins: 0, fats: 0, carbs: 0 });
};
