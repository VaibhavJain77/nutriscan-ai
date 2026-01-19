import { CARB_FOODS } from "./carbs";
import { PROTEIN_FOODS } from "./protien";
import { SNACK_FOODS } from "./snacks";
import { DRINK_FOODS } from "./drinks";
import { FAT_FOODS } from "./fatFood";
import { MIXED_FOODS } from "./mixed";
console.log("CARB_FOODS", CARB_FOODS);

export const FOOD_DB = [
  ...CARB_FOODS,
  ...PROTEIN_FOODS,
  ...SNACK_FOODS,
  ...DRINK_FOODS,
  ...FAT_FOODS,
  ...MIXED_FOODS,
];
