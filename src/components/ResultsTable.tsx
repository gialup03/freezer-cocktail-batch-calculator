import type { IngredientCalculation, ColumnVisibility } from '../types';
import { formatOzAsFraction } from '../utils/formatOz';

interface ResultsTableProps {
  calculations: IngredientCalculation[];
  columnVisibility: ColumnVisibility;
  totalSugarG?: number;
  sugarGPerL?: number;
}

export function ResultsTable({ calculations, columnVisibility, totalSugarG }: ResultsTableProps) {
  if (calculations.length === 0) {
    return null;
  }

  const totalVolumeMl = calculations.reduce((sum, calc) => sum + calc.volumeMl, 0);
  const totalVolumeOz = calculations.reduce((sum, calc) => sum + calc.volumeOz, 0);
  const totalWeightG = calculations.reduce((sum, calc) => sum + calc.weightG, 0);

  // Calculate water ratio based on dilution percentage
  // If dilution is X%, ingredients are (100-X)%
  // Water ratio = (X / (100-X)) * totalIngredientRatio
  const ingredientsWithRatios = calculations.filter(calc => calc.ingredient.ratio > 0);
  const totalIngredientRatio = ingredientsWithRatios.reduce((sum, calc) => sum + calc.ingredient.ratio, 0);
  
  const batchDilutionVolume = calculations.find(c => c.ingredient.name === 'Batch Dilution')?.volumeMl || 0;
  const dilutionPercent = totalVolumeMl > 0 ? (batchDilutionVolume / totalVolumeMl) * 100 : 0;
  const waterRatio = dilutionPercent > 0 && dilutionPercent < 100
    ? (dilutionPercent / (100 - dilutionPercent)) * totalIngredientRatio
    : 0;
  
  // Format ratio string - use exact ratio values as shown in ingredients section
  const formatRatio = (calc: IngredientCalculation): string => {
    if (calc.ingredient.name === 'Batch Dilution') {
      if (waterRatio === 0) return '-';
      // Round to 2 decimal places and remove trailing zeros
      return parseFloat(waterRatio.toFixed(2)).toString();
    }
    if (calc.ingredient.ratio === 0) {
      return '-';
    }
    // Use exact ratio value as shown in ingredients section
    return calc.ingredient.ratio.toString();
  };

  // Calculate total ratio
  const totalRatio = totalIngredientRatio + waterRatio;
  const formattedTotalRatio = parseFloat(totalRatio.toFixed(2)).toString();

  return (
    <div>
      <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-left font-semibold text-slate-700">Ingredient</th>
            <th className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-right font-semibold text-slate-700">Ratio</th>
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
          {calculations.map((calc, index) => (
            <tr 
              key={calc.ingredient.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            >
              <td className="px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{calc.ingredient.name || 'Unnamed'}</td>
              <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{formatRatio(calc)}</td>
              <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{calc.volumeMl.toFixed(0)}</td>
              <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{formatOzAsFraction(calc.volumeOz)}</td>
              {columnVisibility.weight && (
                <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">{calc.weightG.toFixed(0)}</td>
              )}
              {columnVisibility.sugar && (
                <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-b border-slate-200">
                  {calc.sugarG !== undefined ? calc.sugarG.toFixed(0) : '-'}
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-slate-50 font-semibold">
            <td className="px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">Total</td>
            <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{formattedTotalRatio}</td>
            <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{totalVolumeMl.toFixed(0)}</td>
            <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{formatOzAsFraction(totalVolumeOz)}</td>
            {columnVisibility.weight && (
              <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">{totalWeightG.toFixed(0)}</td>
            )}
            {columnVisibility.sugar && (
              <td className="text-right px-1.5 sm:px-2 py-1 sm:py-1.5 border-t border-slate-200">
                {totalSugarG !== undefined ? totalSugarG.toFixed(0) : '-'}
              </td>
            )}
          </tr>
        </tbody>
        </table>
      </div>
    </div>
  );
}
