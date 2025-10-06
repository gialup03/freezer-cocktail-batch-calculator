import { X } from 'lucide-react';
import type { Ingredient } from '../types';

interface IngredientInputProps {
  ingredient: Ingredient;
  onChange: (ingredient: Ingredient) => void;
  onDelete: () => void;
}

export function IngredientInput({ ingredient, onChange, onDelete }: IngredientInputProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Ingredient Name
          </label>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="e.g., Gin"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Ratio
          </label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={ingredient.ratio}
            onChange={(e) => onChange({ ...ingredient, ratio: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            ABV (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={ingredient.abv}
            onChange={(e) => onChange({ ...ingredient, abv: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Density (g/mL)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={ingredient.density}
              onChange={(e) => onChange({ ...ingredient, density: parseFloat(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete ingredient"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
