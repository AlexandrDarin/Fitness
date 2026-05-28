/**
 * Stateless utility — чистые функции без состояния.
 */
class NutritionCalculator {
  static calcForProduct(product, grams) {
    const factor = grams / 100;
    return {
      calories: +(product.calories_per_100g * factor).toFixed(1),
      proteins: +(product.proteins_per_100g * factor).toFixed(1),
      fats:     +(product.fats_per_100g     * factor).toFixed(1),
      carbs:    +(product.carbs_per_100g    * factor).toFixed(1),
    };
  }

  static calcTotal(entries) {
    return entries.reduce((acc, entry) => {
      const n = NutritionCalculator.calcForProduct(entry.product, entry.amount_grams);
      return {
        calories: +(acc.calories + n.calories).toFixed(1),
        proteins: +(acc.proteins + n.proteins).toFixed(1),
        fats:     +(acc.fats     + n.fats    ).toFixed(1),
        carbs:    +(acc.carbs    + n.carbs   ).toFixed(1),
      };
    }, { calories: 0, proteins: 0, fats: 0, carbs: 0 });
  }
}

module.exports = NutritionCalculator;
