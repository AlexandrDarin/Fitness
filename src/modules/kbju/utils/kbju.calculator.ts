export function calculateKBJU(product: any, grams: number) {
  const g = Number(grams);
  if (isNaN(g) || g <= 0) {
    return { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  }
  
  const factor = g / 100;
  
  // Безопасно преобразуем любые значения из БД в числа
  const cal  = Number(product?.caloriesPer100g ?? product?.calories_per_100g ?? 0);
  const prot = Number(product?.proteinsPer100g ?? product?.proteins_per_100g ?? 0);
  const fat  = Number(product?.fatsPer100g     ?? product?.fats_per_100g     ?? 0);
  const carb = Number(product?.carbsPer100g    ?? product?.carbs_per_100g    ?? 0);

  return {
    calories: Math.round(cal * factor),
    proteins: Number((prot * factor).toFixed(1)),
    fats:     Number((fat * factor).toFixed(1)),
    carbs:    Number((carb * factor).toFixed(1)),
  };
}

export function sumKBJU(entries: any[]) {
  if (!Array.isArray(entries)) return { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  
  return entries.reduce((acc, entry) => {
    const kbju = entry.kbju || { calories: 0, proteins: 0, fats: 0, carbs: 0 };
    return {
      calories: acc.calories + (Number(kbju.calories) || 0),
      proteins: Number((acc.proteins + (Number(kbju.proteins) || 0)).toFixed(1)),
      fats:     Number((acc.fats     + (Number(kbju.fats)     || 0)).toFixed(1)),
      carbs:    Number((acc.carbs    + (Number(kbju.carbs)    || 0)).toFixed(1)),
    };
  }, { calories: 0, proteins: 0, fats: 0, carbs: 0 });
}
