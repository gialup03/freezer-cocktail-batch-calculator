import type { Ingredient, ColumnVisibility } from '../types';
import { IngredientInput } from './IngredientInput';
import { TemplateSelector } from './TemplateSelector';
import { RecipeTemplates } from './RecipeTemplates';
import type { IngredientTemplate } from '../utils/ingredientTemplates';
import { INGREDIENT_TEMPLATES } from '../utils/ingredientTemplates';
import type { RecipeTemplate } from '../utils/recipeTemplates';

interface IngredientListProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  columnVisibility: ColumnVisibility;
  onDilutionChange?: (dilution: number) => void;
}

export function IngredientList({ 
  ingredients, 
  onChange, 
  columnVisibility,
  onDilutionChange
}: IngredientListProps) {

  const addIngredient = (name: string = '') => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: name,
      ratio: 1,
      abv: 0,
      densityGPerL: 1000
    };
    onChange([...ingredients, newIngredient]);
  };

  const addIngredientFromTemplate = (template: IngredientTemplate, ratio: number = 1) => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: template.name,
      ratio: ratio,
      abv: template.abv,
      densityGPerL: template.densityGPerL,
      sugarGPerL: template.sugarGPerL
    };
    onChange([...ingredients, newIngredient]);
  };

  const loadRecipe = (recipe: RecipeTemplate) => {
    const newIngredients: Ingredient[] = recipe.ingredients.map((recipeIngredient) => {
      const template = INGREDIENT_TEMPLATES.find(t => t.name === recipeIngredient.templateName);
      if (!template) {
        // Fallback if template not found
        return {
          id: Date.now().toString() + Math.random(),
          name: recipeIngredient.templateName,
          ratio: recipeIngredient.ratio,
          abv: 0,
          densityGPerL: 1000
        };
      }
      return {
        id: Date.now().toString() + Math.random(),
        name: template.name,
        ratio: recipeIngredient.ratio,
        abv: template.abv,
        densityGPerL: template.densityGPerL,
        sugarGPerL: template.sugarGPerL
      };
    });
    onChange(newIngredients);
    
    // Set default dilution if provided
    if (recipe.dilutionPercent !== undefined && onDilutionChange) {
      onDilutionChange(recipe.dilutionPercent);
    }
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
      <RecipeTemplates onSelectRecipe={loadRecipe} />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Ingredients</h2>
        <TemplateSelector 
          onSelect={addIngredientFromTemplate}
          onAddCustom={addIngredient}
        />
      </div>
      
      {ingredients.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <p className="text-slate-500">No ingredients added yet. Click "Add Ingredient" to start.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-2 py-1.5 text-left text-sm font-semibold text-slate-700 min-w-[144px]">
                  Ingredient Name
                </th>
                <th className="px-2 py-1.5 text-left text-sm font-semibold text-slate-700 w-[70px] min-w-[70px]">
                  Ratio
                </th>
                <th className="px-2 py-1.5 text-left text-sm font-semibold text-slate-700 w-[85px] min-w-[85px]">
                  ABV (%)
                </th>
                {columnVisibility.weight && (
                  <th className="px-2 py-1.5 text-left text-sm font-semibold text-slate-700 w-28 min-w-28">
                    Density (g/L)
                  </th>
                )}
                {columnVisibility.sugar && (
                  <th className="px-2 py-1.5 text-left text-sm font-semibold text-slate-700 w-28 min-w-28">
                    Sugar (g/L)
                  </th>
                )}
                <th className="px-2 py-1.5 w-6 min-w-6"></th>
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
