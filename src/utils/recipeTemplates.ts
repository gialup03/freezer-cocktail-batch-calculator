export interface RecipeIngredient {
  templateName: string; // matches name in ingredientTemplates
  ratio: number;
}

export interface RecipeTemplate {
  name: string;
  ingredients: RecipeIngredient[];
  dilutionPercent?: number; // Optional default dilution percentage
  servingSizeMl?: number; // Optional default serving size for single serving
}

export const RECIPE_TEMPLATES: RecipeTemplate[] = [
  {
    name: 'Negroni',
    ingredients: [
      { templateName: 'Gin', ratio: 1 },
      { templateName: 'Campari', ratio: 1 },
      { templateName: 'Sweet Vermouth', ratio: 1 },
    ],
    dilutionPercent: 10, // Rocks cocktail
    servingSizeMl: 120, // ~3 UK units at 24.9% ABV
  },
  {
    name: 'Martini',
    ingredients: [
      { templateName: 'Gin', ratio: 3 },
      { templateName: 'Dry Vermouth', ratio: 1 },
    ],
    dilutionPercent: 5, // Stirred, served up
    servingSizeMl: 90, // ~3 UK units at 32.8% ABV
  },
  {
    name: 'Old Fashioned',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Demerara Syrup', ratio: 0.25 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 10, // Rocks cocktail
    servingSizeMl: 90, // ~3 UK units at 36.1% ABV
  },
  {
    name: 'Manhattan',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Sweet Vermouth', ratio: 1 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 5, // Stirred, served up
    servingSizeMl: 90, // ~3 UK units at 34.3% ABV
  },
];
