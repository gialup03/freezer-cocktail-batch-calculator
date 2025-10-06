import type { Ingredient, BatchConfig, BatchResult, IngredientCalculation } from '../types';

export function calculateBatch(
  ingredients: Ingredient[],
  config: BatchConfig
): BatchResult {
  // Handle empty ingredients
  if (ingredients.length === 0) {
    return {
      ingredients: [],
      finalAbv: 0,
      dilutionSuggestion: { needsDilution: false }
    };
  }

  // 1. Normalize ratios to total volume
  const totalRatio = ingredients.reduce((sum, ing) => sum + ing.ratio, 0);
  
  if (totalRatio === 0) {
    return {
      ingredients: [],
      finalAbv: 0,
      dilutionSuggestion: { needsDilution: false }
    };
  }
  
  // 2. Calculate per-ingredient volumes
  const calculations: IngredientCalculation[] = ingredients.map(ing => {
    const volumeMl = (ing.ratio / totalRatio) * config.batchSizeMl;
    const volumeOz = volumeMl * 0.033814; // mL to oz conversion
    const weightG = volumeMl * ing.density;
    
    return { 
      ingredient: ing, 
      volumeMl: Math.round(volumeMl * 10) / 10, 
      volumeOz: Math.round(volumeOz * 100) / 100, 
      weightG: Math.round(weightG * 10) / 10 
    };
  });
  
  // 3. Calculate weighted ABV
  const totalAlcoholMl = calculations.reduce(
    (sum, calc) => sum + (calc.volumeMl * calc.ingredient.abv / 100),
    0
  );
  const finalAbv = (totalAlcoholMl / config.batchSizeMl) * 100;
  
  // 4. Suggest dilution if ABV > 33%
  const dilutionSuggestion = calculateDilution(finalAbv, config.batchSizeMl);
  
  return { 
    ingredients: calculations, 
    finalAbv: Math.round(finalAbv * 10) / 10, 
    dilutionSuggestion 
  };
}

function calculateDilution(currentAbv: number, currentVolumeMl: number) {
  const targetAbv = 31.5; // midpoint of 30-33% target
  
  if (currentAbv <= 33) {
    return { needsDilution: false };
  }
  
  // Formula: water_needed = (current_ABV - target_ABV) / target_ABV × current_volume
  const waterMl = ((currentAbv - targetAbv) / targetAbv) * currentVolumeMl;
  
  return {
    needsDilution: true,
    waterMl: Math.round(waterMl),
    targetAbv
  };
}
