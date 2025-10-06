import { useState, useRef, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import type { Ingredient, ColumnVisibility } from '../types';
import { IngredientInput } from './IngredientInput';

interface IngredientListProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
}

export function IngredientList({ 
  ingredients, 
  onChange, 
  columnVisibility,
  onColumnVisibilityChange 
}: IngredientListProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      ratio: 1,
      abv: 0,
      densityGPerL: 1000
    };
    onChange([...ingredients, newIngredient]);
  };

  const updateIngredient = (index: number, updated: Ingredient) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = updated;
    onChange(newIngredients);
  };

  const deleteIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const toggleColumn = (column: keyof ColumnVisibility) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [column]: !columnVisibility[column]
    });
  };

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    };

    if (isOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOptionsOpen]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Ingredients</h2>
        <div className="flex items-center gap-2">
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200 transition-colors"
              title="Column Options"
            >
              <Settings size={20} />
              Options
            </button>
            
            {isOptionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">
                    Show Columns
                  </div>
                  <label className="flex items-center gap-2 px-2 py-2 hover:bg-slate-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={columnVisibility.weight}
                      onChange={() => toggleColumn('weight')}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Weight</span>
                  </label>
                  <label className="flex items-center gap-2 px-2 py-2 hover:bg-slate-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={columnVisibility.sugar}
                      onChange={() => toggleColumn('sugar')}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Sugar</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={addIngredient}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Ingredient
          </button>
        </div>
      </div>
      
      {ingredients.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <p className="text-slate-500">No ingredients added yet. Click "Add Ingredient" to start.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Ingredient Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Ratio
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  ABV (%)
                </th>
                {columnVisibility.weight && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Density (g/L)
                  </th>
                )}
                {columnVisibility.sugar && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Sugar Conc. (g/L)
                  </th>
                )}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <IngredientInput
                  key={ingredient.id}
                  ingredient={ingredient}
                  onChange={(updated) => updateIngredient(index, updated)}
                  onDelete={() => deleteIngredient(index)}
                  columnVisibility={columnVisibility}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
