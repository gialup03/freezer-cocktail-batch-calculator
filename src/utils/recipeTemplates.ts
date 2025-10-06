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
    dilutionPercent: 10, // Rocks cocktail
  },
  {
    name: 'Martini',
    ingredients: [
      { templateName: 'Gin', ratio: 3 },
      { templateName: 'Dry Vermouth', ratio: 1 },
    ],
    dilutionPercent: 5, // Stirred, served up
  },
  {
    name: 'Manhattan',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Sweet Vermouth', ratio: 1 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 5, // Stirred, served up
  },
  {
    name: 'Old Fashioned',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Demerara Syrup', ratio: 0.25 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 10, // Rocks cocktail
  },
];
