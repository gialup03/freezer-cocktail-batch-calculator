import { useState, useEffect } from 'react';
import type { IngredientCalculation, ColumnVisibility } from '../types';
import { formatOzAsFraction } from '../utils/formatOz';
import type { PreparationMethod as RecipePreparationMethod } from '../utils/recipeTemplates';

interface ServingInfoProps {
  batchSizeMl: number;
  finalAbv: number;
  calculations: IngredientCalculation[];
  columnVisibility: ColumnVisibility;
  defaultServingSizeMl?: number;
  batchMode?: boolean;
  defaultPreparationMethod?: RecipePreparationMethod;
}

type PreparationMethod = 'stirred' | 'shaken' | 'neat' | 'built' | 'custom';

const PREPARATION_DILUTION: Record<Exclude<PreparationMethod, 'custom'>, number> = {
  stirred: 18,
  shaken: 23,
  built: 10,
  neat: 0,
};

export function ServingInfo({ batchSizeMl, finalAbv, calculations, columnVisibility, defaultServingSizeMl, batchMode = true, defaultPreparationMethod }: ServingInfoProps) {
  // Calculate default serving size for 3 UK units
  // UK units = (volume * ABV / 100) / 10
  // For 3 units: volume = 3000 / ABV
  const calculateDefaultVolume = () => {
    // Use provided default if available
    if (defaultServingSizeMl !== undefined) {
      return defaultServingSizeMl;
    }
    const idealVolume = 3000 / finalAbv;
    // Round to nearest 5ml increment
    const rounded = Math.round(idealVolume / 5) * 5;
    // Clamp to 50-200ml range
    return Math.max(50, Math.min(200, rounded));
  };

  const defaultVolume = calculateDefaultVolume();

  const [servingVolumeMl, setServingVolumeMl] = useState(defaultVolume);
  const [preparationMethod, setPreparationMethod] = useState<PreparationMethod>(batchMode ? 'neat' : 'stirred');
  const [customDilution, setCustomDilution] = useState(20);

  // Update serving size when defaultServingSizeMl changes (from recipe selection)
  useEffect(() => {
    if (defaultServingSizeMl !== undefined) {
      setServingVolumeMl(defaultServingSizeMl);
    }
  }, [defaultServingSizeMl]);

  // Update preparation method when defaultPreparationMethod changes (from recipe selection)
  useEffect(() => {
    if (defaultPreparationMethod !== undefined && !batchMode) {
      setPreparationMethod(defaultPreparationMethod);
    }
  }, [defaultPreparationMethod, batchMode]);

  // Update preparation method when batch mode changes
  useEffect(() => {
    setPreparationMethod(batchMode ? 'neat' : (defaultPreparationMethod || 'stirred'));
  }, [batchMode, defaultPreparationMethod]);

  // servingVolumeMl represents the BASE volume (undiluted cocktail)
  // Calculate servings count based on base volume
  const servingsCount = Math.round(batchSizeMl / servingVolumeMl);

  const handleVolumeChange = (value: number) => {
    if (value > 0) {
      const roundedVolume = Math.round(value);
      setServingVolumeMl(roundedVolume);
    }
  };

  // Get current dilution percentage
  const getCurrentDilution = () => {
    if (preparationMethod === 'custom') {
      return customDilution;
    }
    return PREPARATION_DILUTION[preparationMethod];
  };

  const dilutionPercent = getCurrentDilution();

  // The base volume (from slider) is the undiluted cocktail
  const baseVolumeMl = servingVolumeMl;
  
  // Calculate preparation dilution volume based on base volume
  const preparationDilutionMl = baseVolumeMl * (dilutionPercent / 100);
  
  // Final serving volume includes preparation dilution
  const finalServingVolumeMl = baseVolumeMl + preparationDilutionMl;

  // Calculate alcohol per serving (based on batch ABV and base volume)
  const pureAlcoholMlPerServing = baseVolumeMl * (finalAbv / 100);
  
  // UK units (1 UK unit = 10ml pure alcohol)
  const ukUnitsPerServing = pureAlcoholMlPerServing / 10;

  // Calculate ingredient breakdown per serving
  // Filter out "Batch Dilution" when batch mode is off
  const filteredCalculations = batchMode 
    ? calculations 
    : calculations.filter(calc => calc.ingredient.name !== 'Batch Dilution');
  
  // Scale ingredients to match the base volume
  const batchBaseVolume = filteredCalculations.reduce((sum, calc) => sum + calc.volumeMl, 0);
  const scaleFactor = baseVolumeMl / (batchBaseVolume / servingsCount);
  
  const ingredientsPerServing = filteredCalculations.map(calc => ({
    name: calc.ingredient.name,
    volumeMl: (calc.volumeMl / servingsCount) * scaleFactor,
    volumeOz: (calc.volumeOz / servingsCount) * scaleFactor,
    weightG: (calc.weightG / servingsCount) * scaleFactor,
    sugarG: calc.sugarG !== undefined ? (calc.sugarG / servingsCount) * scaleFactor : undefined
  }));

  // Add preparation dilution to ingredients if dilution is enabled
  const ingredientsWithDilution = dilutionPercent > 0 
    ? [
        ...ingredientsPerServing,
        {
          name: 'Preparation Dilution',
          volumeMl: preparationDilutionMl,
          volumeOz: preparationDilutionMl / 29.5735,
          weightG: preparationDilutionMl * 1.0, // Water density
          sugarG: undefined, // Use undefined instead of 0 to show dash
          abv: 0,
        }
      ]
    : ingredientsPerServing;

  // Calculate totals per serving
  const totalVolumeMlPerServing = ingredientsWithDilution.reduce((sum, ing) => sum + ing.volumeMl, 0);
  const totalVolumeOzPerServing = ingredientsWithDilution.reduce((sum, ing) => sum + ing.volumeOz, 0);
  const totalWeightGPerServing = ingredientsWithDilution.reduce((sum, ing) => sum + ing.weightG, 0);
  const totalSugarGPerServing = ingredientsWithDilution.reduce((sum, ing) => sum + (ing.sugarG || 0), 0);

  // Calculate final ABV after preparation dilution
  const totalAlcoholMl = ingredientsPerServing.reduce((sum, ing) => {
    const ingredientCalc = filteredCalculations.find(calc => calc.ingredient.name === ing.name);
    if (ingredientCalc && ingredientCalc.ingredient.abv) {
      return sum + (ing.volumeMl * ingredientCalc.ingredient.abv / 100);
    }
    return sum;
  }, 0);
  const finalServingAbv = (totalAlcoholMl / totalVolumeMlPerServing) * 100;

  // Calculate final sugar concentration (g/L)
  const finalSugarGPerL = totalSugarGPerServing > 0 
    ? (totalSugarGPerServing / totalVolumeMlPerServing) * 1000 
    : 0;

  // Helper functions for color coding
  const getAbvColorClass = (abv: number) => {
    if (abv < 10) {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    } else if (abv < 15) {
      return 'bg-green-50 text-green-800 border-green-200';
    } else if (abv < 20) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (abv < 25) {
      return 'bg-orange-50 text-orange-800 border-orange-200';
    } else {
      return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  const getSugarColorClass = (sugar: number) => {
    if (sugar < 10) {
      return {
        colorClass: 'bg-amber-50 text-amber-800 border-amber-100',
        label: 'Dry'
      };
    } else if (sugar < 20) {
      return {
        colorClass: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Off-dry'
      };
    } else if (sugar < 40) {
      return {
        colorClass: 'bg-amber-200 text-amber-900 border-amber-300',
        label: 'Medium-dry'
      };
    } else if (sugar < 80) {
      return {
        colorClass: 'bg-amber-300 text-amber-900 border-amber-400',
        label: 'Medium-sweet'
      };
    } else if (sugar < 140) {
      return {
        colorClass: 'bg-amber-400 text-amber-950 border-amber-500',
        label: 'Sweet'
      };
    } else {
      return {
        colorClass: 'bg-amber-500 text-amber-950 border-amber-600',
        label: 'Luscious'
      };
    }
  };

  const abvColorClass = getAbvColorClass(finalServingAbv);
  const sugarStyle = finalSugarGPerL > 0 ? getSugarColorClass(finalSugarGPerL) : null;

  return (
    <div className="space-y-3">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Serving Options</h2>
      
      <div className="border border-slate-200 rounded-lg bg-white p-3 sm:p-4">
        <div className="mb-3">
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-xs sm:text-sm font-medium text-slate-600">
              Base Volume
            </label>
            <span className="text-sm sm:text-base font-semibold text-slate-900">
              {Math.round(servingVolumeMl)} mL ({formatOzAsFraction(servingVolumeMl / 29.5735)} oz)
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={Math.round(servingVolumeMl)}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((Math.round(servingVolumeMl) - 50) / 150) * 100}%, #e2e8f0 ${((Math.round(servingVolumeMl) - 50) / 150) * 100}%, #e2e8f0 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>50 mL</span>
            <span>200 mL</span>
          </div>
        </div>

        {/* Preparation Dilution Section */}
        <div className="mb-3 pt-3 border-t border-slate-200">
          <label className="text-xs font-medium text-slate-600 block mb-1.5">
            Preparation Dilution
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setPreparationMethod('neat')}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                preparationMethod === 'neat'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              None
            </button>
            <button
              onClick={() => setPreparationMethod('built')}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                preparationMethod === 'built'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              Built ({PREPARATION_DILUTION.built}%)
            </button>
            <button
              onClick={() => setPreparationMethod('stirred')}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                preparationMethod === 'stirred'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              Stirred ({PREPARATION_DILUTION.stirred}%)
            </button>
            <button
              onClick={() => setPreparationMethod('shaken')}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                preparationMethod === 'shaken'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              Shaken ({PREPARATION_DILUTION.shaken}%)
            </button>
            <button
              onClick={() => setPreparationMethod('custom')}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                preparationMethod === 'custom'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
              }`}
            >
              Custom
            </button>
            {preparationMethod === 'custom' && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={customDilution}
                  onChange={(e) => setCustomDilution(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  className="w-14 px-1.5 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600">%</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-0.5 text-xs sm:text-sm text-slate-600">
          <p>
            {ukUnitsPerServing.toFixed(1)} UK alcohol units per serving
          </p>
          {batchMode && (
            <p>
              {Math.round(servingsCount)} servings in batch
            </p>
          )}
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-left font-semibold text-slate-700">Ingredient</th>
                <th className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-right font-semibold text-slate-700">Vol (mL)</th>
                <th className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-right font-semibold text-slate-700">Vol (oz)</th>
                {columnVisibility.weight && (
                  <th className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-right font-semibold text-slate-700">Wt (g)</th>
                )}
                {columnVisibility.sugar && (
                  <th className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-right font-semibold text-slate-700">Sugar (g)</th>
                )}
              </tr>
            </thead>
            <tbody>
              {ingredientsWithDilution.map((ingredient, index) => (
                <tr 
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{ingredient.name}</td>
                  <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{ingredient.volumeMl.toFixed(0)}</td>
                  <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">
                    {formatOzAsFraction(ingredient.volumeOz)}
                  </td>
                  {columnVisibility.weight && (
                    <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{ingredient.weightG.toFixed(1)}</td>
                  )}
                  {columnVisibility.sugar && (
                    <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">
                      {ingredient.sugarG !== undefined ? ingredient.sugarG.toFixed(1) : '-'}
                    </td>
                  )}
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold">
                <td className="px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">Total</td>
                <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{totalVolumeMlPerServing.toFixed(0)}</td>
                <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">
                  {formatOzAsFraction(totalVolumeOzPerServing)}
                </td>
                {columnVisibility.weight && (
                  <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{totalWeightGPerServing.toFixed(1)}</td>
                )}
                {columnVisibility.sugar && (
                  <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{totalSugarGPerServing.toFixed(1)}</td>
                )}
              </tr>
            </tbody>
          </table>
      </div>

      {/* Final ABV and Sugar Concentration */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`flex flex-col justify-center py-2 px-3 rounded-lg border ${abvColorClass} text-center`}>
          <div className="text-xs font-medium uppercase tracking-wide mb-0.5">Final ABV</div>
          <div className="text-lg sm:text-xl font-bold">{finalServingAbv.toFixed(1)}%</div>
        </div>
        
        {columnVisibility.sugar && sugarStyle && (
          <div className={`flex flex-col justify-center py-2 px-3 rounded-lg border ${sugarStyle.colorClass} text-center`}>
            <div className="text-xs font-medium uppercase tracking-wide mb-0.5">Final Sugar</div>
            <div className="text-lg sm:text-xl font-bold">{finalSugarGPerL.toFixed(0)} g/L</div>
            <div className="text-xs mt-0.5">{sugarStyle.label}</div>
          </div>
        )}
      </div>
    </div>
  );
}
