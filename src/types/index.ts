export interface Ingredient {
  id: string;
  name: string;
  ratio: number; // e.g., 3 for gin in 3:1 martini
  abv: number;   // 0-100 (e.g., 40 for 40% ABV)
  densityGPerL: number; // g/L (e.g., 940 for spirits, 1000 for water)
  sugarGPerL?: number; // g/L (e.g., 100 for 100g sugar per liter)
}

export interface BatchConfig {
  batchSizeMl: number; // total batch size in mL
  dilutionPercent: number; // 0-100, percentage of final volume that is water
}

export interface IngredientCalculation {
  ingredient: Ingredient;
  volumeMl: number;
  volumeOz: number;
  weightG: number;
  sugarG?: number; // total sugar in grams for this ingredient
}

export interface BatchResult {
  ingredients: IngredientCalculation[];
  finalAbv: number;
  waterMl: number; // amount of water being added
  totalVolumeMl: number; // total including dilution
  totalSugarG?: number; // total sugar in grams across all ingredients
  sugarGPerL?: number; // sugar concentration in final drink
}

export interface ColumnVisibility {
  weight: boolean;
  sugar: boolean;
}

export type ServingStyle = 'up' | 'rocks' | 'crushed';

export interface ServingStyleOption {
  value: ServingStyle;
  label: string;
  description?: string;
}
