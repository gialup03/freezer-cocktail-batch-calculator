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
      totalVolumeMl: config.batchSizeMl
    };
  }

  // 1. Normalize ratios to total volume
  const totalRatio = ingredients.reduce((sum, ing) => sum + ing.ratio, 0);
  
  if (totalRatio === 0) {
    return {
      ingredients: [],
      finalAbv: 0,
      waterMl: 0,
      totalVolumeMl: config.batchSizeMl
    };
  }
  
  // 2. Calculate base ingredient volumes (before dilution)
  const baseVolumeMl = config.batchSizeMl;
  const calculations: IngredientCalculation[] = ingredients.map(ing => {
    const volumeMl = (ing.ratio / totalRatio) * baseVolumeMl;
    const volumeOz = volumeMl * 0.033814; // mL to oz conversion
    const weightG = volumeMl * ing.density;
    
    return { 
      ingredient: ing, 
      volumeMl: Math.round(volumeMl * 10) / 10, 
      volumeOz: Math.round(volumeOz * 100) / 100, 
      weightG: Math.round(weightG * 10) / 10 
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
  
  // 6. Add water as a separate calculation if there's dilution
  let finalCalculations = [...calculations];
  if (waterMl > 0) {
    const waterOz = waterMl * 0.033814;
    const waterWeight = waterMl * 1.0; // density of water is 1.0
    
    finalCalculations.push({
      ingredient: {
        id: 'water',
        name: 'Water (dilution)',
        ratio: 0, // Water is not part of the base ratio
        abv: 0,
        density: 1.0
      },
      volumeMl: Math.round(waterMl * 10) / 10,
      volumeOz: Math.round(waterOz * 100) / 100,
      weightG: Math.round(waterWeight * 10) / 10
    });
  }
  
  return { 
    ingredients: finalCalculations, 
    finalAbv: Math.round(finalAbv * 10) / 10,
    waterMl: waterMl,
    totalVolumeMl: totalVolumeMl
  };
}
