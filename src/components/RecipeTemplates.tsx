import { RECIPE_TEMPLATES, type RecipeTemplate } from '../utils/recipeTemplates';

interface RecipeTemplatesProps {
  onSelectRecipe: (recipe: RecipeTemplate) => void;
}

export function RecipeTemplates({ onSelectRecipe }: RecipeTemplatesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">Quick Start Recipes</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {RECIPE_TEMPLATES.map((recipe) => (
            <button
              key={recipe.name}
              onClick={() => onSelectRecipe(recipe)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {recipe.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
