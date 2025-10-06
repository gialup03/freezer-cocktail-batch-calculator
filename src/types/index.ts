export interface Ingredient {
  id: string;
  name: string;
  ratio: number; // e.g., 3 for gin in 3:1 martini
  abv: number;   // 0-100 (e.g., 40 for 40% ABV)
  density: number; // g/mL (e.g., 0.95 for vodka, 1.0 for water)
}

export interface BatchConfig {
  batchSizeMl: number; // total batch size in mL
}

export interface IngredientCalculation {
  ingredient: Ingredient;
  volumeMl: number;
  volumeOz: number;
  weightG: number;
}

export interface BatchResult {
  ingredients: IngredientCalculation[];
  finalAbv: number;
  dilutionSuggestion: {
    needsDilution: boolean;
    waterMl?: number;
    targetAbv?: number;
  };
}
