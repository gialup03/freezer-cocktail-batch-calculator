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
      waterMl: 0,
      totalVolumeMl: config.batchSizeMl,
      totalSugarG: undefined,
      sugarGPerL: undefined
    };
  }

  // 1. Normalize ratios to total volume
  const totalRatio = ingredients.reduce((sum, ing) => sum + ing.ratio, 0);
  
  if (totalRatio === 0) {
    return {
      ingredients: [],
      finalAbv: 0,
      waterMl: 0,
      totalVolumeMl: config.batchSizeMl,
      totalSugarG: undefined,
      sugarGPerL: undefined
    };
  }
  
  // 2. Calculate ABV and sugar g/L based on ratios and dilution (independent of batch size)
  // These are intensive properties - they depend on proportions, not absolute volumes
  
  // Calculate the proportion of each ingredient in the undiluted mix
  const ingredientProportions = ingredients.map(ing => ({
    ingredient: ing,
    proportion: ing.ratio / totalRatio
  }));
  
  // Calculate weighted average alcohol content (before dilution)
  const undilutedAlcoholContent = ingredientProportions.reduce(
    (sum, { ingredient, proportion }) => sum + (proportion * ingredient.abv),
    0
  );
  
  // Apply dilution: dilutionPercent means "for every 100ml of base, add X ml water"
  // Total parts = 100 (base) + dilutionPercent (water)
  // Water fraction = dilutionPercent / (100 + dilutionPercent)
  // Ingredients fraction = 100 / (100 + dilutionPercent)
  const totalParts = 100 + config.dilutionPercent;
  const ingredientsFraction = 100 / totalParts;
  const waterFraction = config.dilutionPercent / totalParts;
  const finalAbv = undilutedAlcoholContent * ingredientsFraction;
  
  // Calculate sugar concentration
  // For each ingredient: its sugar concentration (g/L) weighted by its proportion
  const undilutedSugarGPerL = ingredientProportions.reduce(
    (sum, { ingredient, proportion }) => {
      const ingredientSugar = ingredient.sugarGPerL || 0;
      return sum + (proportion * ingredientSugar);
    },
    0
  );
  
  // Apply dilution to sugar concentration
  const sugarGPerL = undilutedSugarGPerL * ingredientsFraction;
  
  // 3. Calculate absolute volumes based on batch size (only if batch size > 0)
  let calculations: IngredientCalculation[] = [];
  let waterMl = 0;
  let totalSugarG: number | undefined = undefined;
  
  if (config.batchSizeMl > 0) {
    // Calculate water and ingredients volumes to fit batch size
    waterMl = config.dilutionPercent > 0 
      ? Math.round((config.batchSizeMl * waterFraction) * 10) / 10
      : 0;
    
    // Ingredients volume is the remainder to reach batch size
    const ingredientsVolumeMl = config.batchSizeMl - waterMl;
    
    calculations = ingredients.map(ing => {
      const volumeMl = (ing.ratio / totalRatio) * ingredientsVolumeMl;
      const volumeOz = volumeMl * 0.033814;
      const weightG = volumeMl * (ing.densityGPerL / 1000);
      const sugarG = ing.sugarGPerL ? (volumeMl / 1000) * ing.sugarGPerL : undefined;
      
      return { 
        ingredient: ing, 
        volumeMl: Math.round(volumeMl * 10) / 10, 
        volumeOz: Math.round(volumeOz * 100) / 100, 
        weightG: Math.round(weightG * 10) / 10,
        sugarG: sugarG !== undefined ? Math.round(sugarG * 10) / 10 : undefined
      };
    });
    
    totalSugarG = calculations.reduce((sum, calc) => sum + (calc.sugarG || 0), 0);
    
    // Add batch dilution to calculations if there's dilution
    if (waterMl > 0) {
      const waterOz = waterMl * 0.033814;
      const waterWeight = waterMl * 1.0;
      
      calculations.push({
        ingredient: {
          id: 'water',
          name: 'Batch Dilution',
          ratio: 0,
          abv: 0,
          densityGPerL: 1000
        },
        volumeMl: Math.round(waterMl * 10) / 10,
        volumeOz: Math.round(waterOz * 100) / 100,
        weightG: Math.round(waterWeight * 10) / 10,
        sugarG: undefined
      });
    }
  }
  
  return { 
    ingredients: calculations, 
    finalAbv: Math.round(finalAbv * 10) / 10,
    waterMl: waterMl,
    totalVolumeMl: config.batchSizeMl, // Total equals batch size
    totalSugarG: totalSugarG !== undefined && totalSugarG > 0 ? Math.round(totalSugarG * 10) / 10 : undefined,
    sugarGPerL: sugarGPerL > 0 ? Math.round(sugarGPerL * 10) / 10 : undefined
  };
}
