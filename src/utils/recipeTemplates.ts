export interface RecipeIngredient {
  templateName: string; // matches name in ingredientTemplates
  ratio: number;
}

export interface RecipeTemplate {
  name: string;
  ingredients: RecipeIngredient[];
  dilutionPercent?: number; // Optional default dilution percentage
}

export const RECIPE_TEMPLATES: RecipeTemplate[] = [
  {
    name: 'Negroni',
    ingredients: [
      { templateName: 'Gin', ratio: 1 },
      { templateName: 'Campari', ratio: 1 },
      { templateName: 'Sweet Vermouth', ratio: 1 },
    ],
    dilutionPercent: 20, // Stirred cocktail, standard dilution
  },
  {
    name: 'Martini',
    ingredients: [
      { templateName: 'Gin', ratio: 3 },
      { templateName: 'Dry Vermouth', ratio: 1 },
    ],
    dilutionPercent: 22, // Stirred cocktail, slightly more dilution
  },
  {
    name: 'Manhattan',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Sweet Vermouth', ratio: 1 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 22, // Stirred cocktail, standard dilution
  },
  {
    name: 'Old Fashioned',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Demerara Syrup', ratio: 0.25 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 20, // Stirred cocktail, standard dilution
  },
];
