import { useState, useEffect } from 'react';
import type { IngredientCalculation, ColumnVisibility } from '../types';
import { formatOzAsFraction } from '../utils/formatOz';

interface ServingInfoProps {
  batchSizeMl: number;
  finalAbv: number;
  calculations: IngredientCalculation[];
  columnVisibility: ColumnVisibility;
  defaultServingSizeMl?: number;
  batchMode?: boolean;
}

export function ServingInfo({ batchSizeMl, finalAbv, calculations, columnVisibility, defaultServingSizeMl, batchMode = true }: ServingInfoProps) {
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

  // Update serving size when defaultServingSizeMl changes (from recipe selection)
  useEffect(() => {
    if (defaultServingSizeMl !== undefined) {
      setServingVolumeMl(defaultServingSizeMl);
    }
  }, [defaultServingSizeMl]);

  // Calculate servings count based on serving volume
  const servingsCount = Math.round(batchSizeMl / servingVolumeMl);

  const handleVolumeChange = (value: number) => {
    if (value > 0) {
      const roundedVolume = Math.round(value);
      setServingVolumeMl(roundedVolume);
    }
  };

  // Calculate alcohol per serving
  // Pure alcohol volume = serving volume * (ABV / 100)
  const pureAlcoholMlPerServing = servingVolumeMl * (finalAbv / 100);
  
  // UK units (1 UK unit = 10ml pure alcohol)
  const ukUnitsPerServing = pureAlcoholMlPerServing / 10;

  // Calculate ingredient breakdown per serving
  // Filter out "Batch dilution" when batch mode is off
  const filteredCalculations = batchMode 
    ? calculations 
    : calculations.filter(calc => calc.ingredient.name !== 'Batch dilution');
  
  const ingredientsPerServing = filteredCalculations.map(calc => ({
    name: calc.ingredient.name,
    volumeMl: calc.volumeMl / servingsCount,
    volumeOz: calc.volumeOz / servingsCount,
    weightG: calc.weightG / servingsCount,
    sugarG: calc.sugarG !== undefined ? calc.sugarG / servingsCount : undefined
  }));

  // Calculate totals per serving
  const totalVolumeMlPerServing = ingredientsPerServing.reduce((sum, ing) => sum + ing.volumeMl, 0);
  const totalVolumeOzPerServing = ingredientsPerServing.reduce((sum, ing) => sum + ing.volumeOz, 0);
  const totalWeightGPerServing = ingredientsPerServing.reduce((sum, ing) => sum + ing.weightG, 0);
  const totalSugarGPerServing = ingredientsPerServing.reduce((sum, ing) => sum + (ing.sugarG || 0), 0);

  return (
    <div className="space-y-3">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Serving Information</h2>
      
      <div className="border border-slate-200 rounded-lg bg-white p-3 sm:p-4">
        <div className="mb-3">
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-xs sm:text-sm font-medium text-slate-600">
              Serving Volume
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
              {ingredientsPerServing.map((ingredient, index) => (
                <tr 
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{ingredient.name}</td>
                  <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{ingredient.volumeMl.toFixed(1)}</td>
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
                <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{totalVolumeMlPerServing.toFixed(1)}</td>
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
    </div>
  );
}
