import { X } from 'lucide-react';
import type { Ingredient, ColumnVisibility } from '../types';

interface IngredientInputProps {
  ingredient: Ingredient;
  onChange: (ingredient: Ingredient) => void;
  onDelete: () => void;
  columnVisibility: ColumnVisibility;
}

export function IngredientInput({ ingredient, onChange, onDelete, columnVisibility }: IngredientInputProps) {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-2 py-1.5 min-w-[144px]">
        <input
          type="text"
          value={ingredient.name}
          onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
          className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="e.g., Gin"
        />
      </td>
      
      <td className="px-2 py-1.5 w-[70px] min-w-[70px]">
        <input
          type="number"
          min="0"
          step="0.5"
          value={ingredient.ratio}
          onChange={(e) => onChange({ ...ingredient, ratio: parseFloat(e.target.value) || 0 })}
          className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </td>
      
      <td className="px-2 py-1.5 w-[85px] min-w-[85px]">
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={ingredient.abv}
          onChange={(e) => onChange({ ...ingredient, abv: parseFloat(e.target.value) || 0 })}
          className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </td>
      
      {columnVisibility.weight && (
        <td className="px-2 py-1.5 w-28 min-w-28">
          <input
            type="number"
            min="0"
            step="10"
            value={ingredient.densityGPerL}
            onChange={(e) => onChange({ ...ingredient, densityGPerL: parseFloat(e.target.value) || 1000 })}
            className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </td>
      )}
      
      {columnVisibility.sugar && (
        <td className="px-2 py-1.5 w-28 min-w-28">
          <input
            type="number"
            min="0"
            step="10"
            value={ingredient.sugarGPerL || 0}
            onChange={(e) => onChange({ ...ingredient, sugarGPerL: parseFloat(e.target.value) || undefined })}
            className="w-full px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="0"
          />
        </td>
      )}
      
      <td className="px-2 py-1.5 text-center w-6 min-w-6">
        <button
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors inline-flex items-center justify-center"
          title="Delete ingredient"
        >
          <X size={20} />
        </button>
      </td>
    </tr>
  );
}
