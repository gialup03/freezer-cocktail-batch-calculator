import type { IngredientCalculation, ColumnVisibility } from '../types';
import { formatOzAsFraction } from '../utils/formatOz';

interface ResultsTableProps {
  calculations: IngredientCalculation[];
  columnVisibility: ColumnVisibility;
  totalSugarG?: number;
  sugarGPerL?: number;
  batchSizeMl: number;
  onBatchSizeChange: (batchSizeMl: number) => void;
}

export function ResultsTable({ calculations, columnVisibility, totalSugarG, batchSizeMl, onBatchSizeChange }: ResultsTableProps) {
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
  
  const dilutionPercent = (calculations.find(c => c.ingredient.name === 'Water')?.volumeMl || 0) / batchSizeMl * 100;
  const waterRatio = dilutionPercent > 0 && dilutionPercent < 100
    ? (dilutionPercent / (100 - dilutionPercent)) * totalIngredientRatio
    : 0;
  
  // Format ratio string - use exact ratio values as shown in ingredients section
  const formatRatio = (calc: IngredientCalculation): string => {
    if (calc.ingredient.name === 'Water') {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Batch Breakdown</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-600">
            Batch Size (mL)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            value={batchSizeMl}
            onChange={(e) => onBatchSizeChange(parseFloat(e.target.value) || 0)}
            className="w-32 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="e.g., 750"
          />
        </div>
      </div>
      
      <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
        <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-2 py-1.5 text-left text-sm font-semibold text-slate-700">Ingredient</th>
            <th className="px-2 py-1.5 text-right text-sm font-semibold text-slate-700">Ratio</th>
            <th className="px-2 py-1.5 text-right text-sm font-semibold text-slate-700">Volume (mL)</th>
            <th className="px-2 py-1.5 text-right text-sm font-semibold text-slate-700">Volume (oz)</th>
            {columnVisibility.weight && (
              <th className="px-2 py-1.5 text-right text-sm font-semibold text-slate-700">Weight (g)</th>
            )}
            {columnVisibility.sugar && (
              <th className="px-2 py-1.5 text-right text-sm font-semibold text-slate-700">Sugar (g)</th>
            )}
          </tr>
        </thead>
        <tbody>
          {calculations.map((calc, index) => (
            <tr 
              key={calc.ingredient.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            >
              <td className="px-2 py-1.5 border-b border-slate-200 text-sm">{calc.ingredient.name || 'Unnamed'}</td>
              <td className="text-right px-2 py-1.5 border-b border-slate-200 text-sm">{formatRatio(calc)}</td>
              <td className="text-right px-2 py-1.5 border-b border-slate-200 text-sm">{calc.volumeMl.toFixed(0)}</td>
              <td className="text-right px-2 py-1.5 border-b border-slate-200 text-sm">{formatOzAsFraction(calc.volumeOz)}</td>
              {columnVisibility.weight && (
                <td className="text-right px-2 py-1.5 border-b border-slate-200 text-sm">{calc.weightG.toFixed(0)}</td>
              )}
              {columnVisibility.sugar && (
                <td className="text-right px-2 py-1.5 border-b border-slate-200 text-sm">
                  {calc.sugarG !== undefined ? calc.sugarG.toFixed(0) : '-'}
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-slate-50 font-semibold">
            <td className="px-2 py-1.5 border-t border-slate-200 text-sm">Total</td>
            <td className="text-right px-2 py-1.5 border-t border-slate-200 text-sm">{formattedTotalRatio}</td>
            <td className="text-right px-2 py-1.5 border-t border-slate-200 text-sm">{totalVolumeMl.toFixed(0)}</td>
            <td className="text-right px-2 py-1.5 border-t border-slate-200 text-sm">{formatOzAsFraction(totalVolumeOz)}</td>
            {columnVisibility.weight && (
              <td className="text-right px-2 py-1.5 border-t border-slate-200 text-sm">{totalWeightG.toFixed(0)}</td>
            )}
            {columnVisibility.sugar && (
              <td className="text-right px-2 py-1.5 border-t border-slate-200 text-sm">
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
