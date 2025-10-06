import type { IngredientCalculation, ColumnVisibility } from '../types';

interface ResultsTableProps {
  calculations: IngredientCalculation[];
  columnVisibility: ColumnVisibility;
  totalSugarG?: number;
  sugarGPerL?: number;
}

export function ResultsTable({ calculations, columnVisibility, totalSugarG, sugarGPerL }: ResultsTableProps) {
  if (calculations.length === 0) {
    return null;
  }

  const totalVolumeMl = calculations.reduce((sum, calc) => sum + calc.volumeMl, 0);
  const totalVolumeOz = calculations.reduce((sum, calc) => sum + calc.volumeOz, 0);
  const totalWeightG = calculations.reduce((sum, calc) => sum + calc.weightG, 0);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-900">Batch Breakdown</h2>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b-2 border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Ingredient</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-900">Volume (mL)</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-900">Volume (oz)</th>
            {columnVisibility.weight && (
              <th className="text-right py-3 px-4 font-semibold text-slate-900">Weight (g)</th>
            )}
            {columnVisibility.sugar && (
              <th className="text-right py-3 px-4 font-semibold text-slate-900">Sugar (g)</th>
            )}
          </tr>
        </thead>
        <tbody>
          {calculations.map((calc, index) => (
            <tr 
              key={calc.ingredient.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            >
              <td className="py-3 px-4 border-b border-slate-200">{calc.ingredient.name || 'Unnamed'}</td>
              <td className="text-right py-3 px-4 border-b border-slate-200">{calc.volumeMl.toFixed(0)}</td>
              <td className="text-right py-3 px-4 border-b border-slate-200">{calc.volumeOz.toFixed(2)}</td>
              {columnVisibility.weight && (
                <td className="text-right py-3 px-4 border-b border-slate-200">{calc.weightG.toFixed(0)}</td>
              )}
              {columnVisibility.sugar && (
                <td className="text-right py-3 px-4 border-b border-slate-200">
                  {calc.sugarG !== undefined ? calc.sugarG.toFixed(0) : '-'}
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-slate-100 font-semibold">
            <td className="py-3 px-4 border-t-2 border-slate-300">Total</td>
            <td className="text-right py-3 px-4 border-t-2 border-slate-300">{totalVolumeMl.toFixed(0)}</td>
            <td className="text-right py-3 px-4 border-t-2 border-slate-300">{totalVolumeOz.toFixed(2)}</td>
            {columnVisibility.weight && (
              <td className="text-right py-3 px-4 border-t-2 border-slate-300">{totalWeightG.toFixed(0)}</td>
            )}
            {columnVisibility.sugar && (
              <td className="text-right py-3 px-4 border-t-2 border-slate-300">
                {totalSugarG !== undefined ? totalSugarG.toFixed(0) : '-'}
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
