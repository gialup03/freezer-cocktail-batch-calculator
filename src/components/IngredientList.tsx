import { Plus } from 'lucide-react';
import type { Ingredient } from '../types';
import { IngredientInput } from './IngredientInput';

interface IngredientListProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export function IngredientList({ ingredients, onChange }: IngredientListProps) {
  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      ratio: 1,
      abv: 0,
      density: 1.0
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Ingredients</h2>
        <button
          onClick={addIngredient}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Ingredient
        </button>
      </div>
      
      {ingredients.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <p className="text-slate-500">No ingredients added yet. Click "Add Ingredient" to start.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <IngredientInput
              key={ingredient.id}
              ingredient={ingredient}
              onChange={(updated) => updateIngredient(index, updated)}
              onDelete={() => deleteIngredient(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
