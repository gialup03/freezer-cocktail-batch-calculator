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
      <td className="px-4 py-3">
        <input
          type="text"
          value={ingredient.name}
          onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="e.g., Gin"
        />
      </td>
      
      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          step="0.25"
          value={ingredient.ratio}
          onChange={(e) => onChange({ ...ingredient, ratio: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </td>
      
      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={ingredient.abv}
          onChange={(e) => onChange({ ...ingredient, abv: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </td>
      
      {columnVisibility.density && (
        <td className="px-4 py-3">
          <input
            type="number"
            min="0"
            step="0.01"
            value={ingredient.density}
            onChange={(e) => onChange({ ...ingredient, density: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </td>
      )}
      
      {columnVisibility.sugar && (
        <td className="px-4 py-3">
          <input
            type="number"
            min="0"
            step="1"
            value={ingredient.sugarGPerL || 0}
            onChange={(e) => onChange({ ...ingredient, sugarGPerL: parseFloat(e.target.value) || undefined })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="0"
          />
        </td>
      )}
      
      <td className="px-4 py-3 text-center">
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
