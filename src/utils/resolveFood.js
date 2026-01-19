import { FOOD_DB } from "../data/food/foodDB";


export function resolveFood(name, unit = "bowl", servings = 1) {
  if (!name) return null;

  const food = FOOD_DB.find(
    (f) =>
      f.name.toLowerCase() === name.toLowerCase() ||
      f.aliases?.some((a) => a.toLowerCase() === name.toLowerCase())
  );

  if (!food) return null;

  return {
    name: food.name,
    calories: Math.round(food.calories * servings),
    protein: Math.round(food.protein * servings),
    fats: Math.round(food.fats * servings),
    fiber: food.fiber ? Math.round(food.fiber * servings) : 0,
    servings,
    unit: food.unit || unit,
    image: food.image || null,
  };
}
