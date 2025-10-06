import type { IngredientCalculation } from '../types';

interface ResultsTableProps {
  calculations: IngredientCalculation[];
}

export function ResultsTable({ calculations }: ResultsTableProps) {
  if (calculations.length === 0) {
    return null;
  }

  const totalVolumeMl = calculations.reduce((sum, calc) => sum + calc.volumeMl, 0);
  const totalVolumeOz = calculations.reduce((sum, calc) => sum + calc.volumeOz, 0);
  const totalWeightG = calculations.reduce((sum, calc) => sum + calc.weightG, 0);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">Batch Breakdown</h2>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b-2 border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Ingredient</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-900">Volume (mL)</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-900">Volume (oz)</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-900">Weight (g)</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calc, index) => (
            <tr 
              key={calc.ingredient.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
            >
              <td className="py-3 px-4 border-b border-slate-200">{calc.ingredient.name || 'Unnamed'}</td>
              <td className="text-right py-3 px-4 border-b border-slate-200">{calc.volumeMl.toFixed(1)}</td>
              <td className="text-right py-3 px-4 border-b border-slate-200">{calc.volumeOz.toFixed(2)}</td>
              <td className="text-right py-3 px-4 border-b border-slate-200">{calc.weightG.toFixed(1)}</td>
            </tr>
          ))}
          <tr className="bg-slate-100 font-semibold">
            <td className="py-3 px-4 border-t-2 border-slate-300">Total</td>
            <td className="text-right py-3 px-4 border-t-2 border-slate-300">{totalVolumeMl.toFixed(1)}</td>
            <td className="text-right py-3 px-4 border-t-2 border-slate-300">{totalVolumeOz.toFixed(2)}</td>
            <td className="text-right py-3 px-4 border-t-2 border-slate-300">{totalWeightG.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
