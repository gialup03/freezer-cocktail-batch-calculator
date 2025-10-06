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
  
  // 2. Calculate base ingredient volumes (before dilution)
  const baseVolumeMl = config.batchSizeMl;
  const calculations: IngredientCalculation[] = ingredients.map(ing => {
    const volumeMl = (ing.ratio / totalRatio) * baseVolumeMl;
    const volumeOz = volumeMl * 0.033814; // mL to oz conversion
    // Convert density from g/L to g/mL by dividing by 1000, then multiply by volume in mL
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
  
  // 3. Calculate total alcohol content from base ingredients
  const totalAlcoholMl = calculations.reduce(
    (sum, calc) => sum + (calc.volumeMl * calc.ingredient.abv / 100),
    0
  );
  
  // 4. Calculate water to add based on dilution percentage
  // dilutionPercent represents the percentage of FINAL volume that should be water
  // So: waterMl / totalVolumeMl = dilutionPercent / 100
  // Therefore: waterMl = (baseVolume * dilutionPercent) / (100 - dilutionPercent)
  const waterMl = config.dilutionPercent > 0 
    ? Math.round((baseVolumeMl * config.dilutionPercent) / (100 - config.dilutionPercent))
    : 0;
  
  // 5. Calculate final ABV with dilution
  const totalVolumeMl = baseVolumeMl + waterMl;
  const finalAbv = (totalAlcoholMl / totalVolumeMl) * 100;
  
  // Calculate total sugar
  const totalSugarG = calculations.reduce(
    (sum, calc) => sum + (calc.sugarG || 0),
    0
  );
  const sugarGPerL = totalVolumeMl > 0 ? (totalSugarG / totalVolumeMl) * 1000 : undefined;
  
  // 6. Add water as a separate calculation if there's dilution
  let finalCalculations = [...calculations];
  if (waterMl > 0) {
    const waterOz = waterMl * 0.033814;
    const waterWeight = waterMl * 1.0; // density of water is 1000 g/L = 1.0 g/mL
    
    finalCalculations.push({
      ingredient: {
        id: 'water',
        name: 'Water (dilution)',
        ratio: 0, // Water is not part of the base ratio
        abv: 0,
        densityGPerL: 1000
      },
      volumeMl: Math.round(waterMl * 10) / 10,
      volumeOz: Math.round(waterOz * 100) / 100,
      weightG: Math.round(waterWeight * 10) / 10,
      sugarG: undefined
    });
  }
  
  return { 
    ingredients: finalCalculations, 
    finalAbv: Math.round(finalAbv * 10) / 10,
    waterMl: waterMl,
    totalVolumeMl: totalVolumeMl,
    totalSugarG: totalSugarG > 0 ? Math.round(totalSugarG * 10) / 10 : undefined,
    sugarGPerL: sugarGPerL !== undefined && sugarGPerL > 0 ? Math.round(sugarGPerL * 10) / 10 : undefined
  };
}
