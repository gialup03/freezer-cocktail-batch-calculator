import type { ServingStyle } from '../types';

export interface RecipeIngredient {
  templateName: string; // matches name in ingredientTemplates
  ratio: number;
}

export type PreparationMethod = 'shaken' | 'stirred' | 'built';

export interface RecipeTemplate {
  name: string;
  ingredients: RecipeIngredient[];
  dilutionPercent?: number; // Optional default dilution percentage (batch mode uses this or 0)
  preparationMethod?: PreparationMethod; // How the cocktail is prepared (maps to dilution preset)
  servingSizeMl?: number; // Optional default serving size for single serving
  servingStyle?: ServingStyle; // Optional default serving style
}

export const RECIPE_TEMPLATES: RecipeTemplate[] = [
  {
    name: 'Martini',
    ingredients: [
      { templateName: 'Gin', ratio: 3 },
      { templateName: 'Dry Vermouth', ratio: 1 },
    ],
    dilutionPercent: 5, // Batch mode
    preparationMethod: 'stirred',
    servingSizeMl: 90, // ~3 UK units at 32.8% ABV
    servingStyle: 'up',
  },
  {
    name: 'Negroni',
    ingredients: [
      { templateName: 'Gin', ratio: 1 },
      { templateName: 'Campari', ratio: 1 },
      { templateName: 'Sweet Vermouth', ratio: 1 },
    ],
    dilutionPercent: 10, // Batch mode
    preparationMethod: 'stirred',
    servingSizeMl: 120, // ~3 UK units at 24.9% ABV
    servingStyle: 'rocks',
  },
  {
    name: 'Manhattan',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Sweet Vermouth', ratio: 1 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 5, // Batch mode
    preparationMethod: 'stirred',
    servingSizeMl: 90, // ~3 UK units at 34.3% ABV
    servingStyle: 'up',
  },
  {
    name: 'Old Fashioned',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Demerara Syrup', ratio: 0.25 },
      { templateName: 'Angostura Bitters', ratio: 0.05 },
    ],
    dilutionPercent: 10, // Batch mode
    preparationMethod: 'built',
    servingSizeMl: 90, // ~3 UK units at 36.1% ABV
    servingStyle: 'rocks',
  },
  {
    name: 'Daiquiri',
    ingredients: [
      { templateName: 'White Rum', ratio: 2 },
      { templateName: 'Lime Juice', ratio: 1 },
      { templateName: 'Simple Syrup (1:1)', ratio: 0.75 },
    ],
    dilutionPercent: 0, // Batch mode - no dilution (contains juice)
    preparationMethod: 'shaken',
    servingSizeMl: 90, // ~3 UK units at 21.5% ABV
    servingStyle: 'up',
  },
  {
    name: 'Margarita',
    ingredients: [
      { templateName: 'Tequila', ratio: 2 },
      { templateName: 'Cointreau', ratio: 1 },
      { templateName: 'Lime Juice', ratio: 1 },
    ],
    dilutionPercent: 0, // Batch mode - no dilution (contains juice)
    preparationMethod: 'shaken',
    servingSizeMl: 120, // ~3 UK units at 25% ABV
    servingStyle: 'up',
  },
  {
    name: 'Whiskey Sour',
    ingredients: [
      { templateName: 'Whiskey', ratio: 2 },
      { templateName: 'Lemon Juice', ratio: 1 },
      { templateName: 'Simple Syrup (1:1)', ratio: 0.75 },
    ],
    dilutionPercent: 0, // Batch mode - no dilution (contains juice)
    preparationMethod: 'shaken',
    servingSizeMl: 120, // ~3 UK units at 24.3% ABV
    servingStyle: 'up',
  },
  {
    name: 'Mojito',
    ingredients: [
      { templateName: 'White Rum', ratio: 2 },
      { templateName: 'Lime Juice', ratio: 1 },
      { templateName: 'Simple Syrup (1:1)', ratio: 0.75 },
      { templateName: 'Soda Water', ratio: 2 },
    ],
    dilutionPercent: 0, // Batch mode - no dilution (contains juice/soda)
    preparationMethod: 'built',
    servingSizeMl: 180, // ~3 UK units at 13.9% ABV
    servingStyle: 'crushed',
  },
  {
    name: 'Cosmopolitan',
    ingredients: [
      { templateName: 'Vodka', ratio: 2 },
      { templateName: 'Cointreau', ratio: 1 },
      { templateName: 'Cranberry Juice', ratio: 1 },
      { templateName: 'Lime Juice', ratio: 0.5 },
    ],
    dilutionPercent: 0, // Batch mode - no dilution (contains juice)
    preparationMethod: 'shaken',
    servingSizeMl: 120, // ~3 UK units at 22.2% ABV
    servingStyle: 'up',
  },
  {
    name: 'Espresso Martini',
    ingredients: [
      { templateName: 'Vodka', ratio: 2 },
      { templateName: 'Kahlúa', ratio: 1 },
      { templateName: 'Espresso', ratio: 1 },
      { templateName: 'Simple Syrup (1:1)', ratio: 0.5 },
    ],
    dilutionPercent: 0, // Batch mode - no dilution (contains espresso)
    preparationMethod: 'shaken',
    servingSizeMl: 100, // ~3 UK units at 20.4% ABV
    servingStyle: 'up',
  },
  {
    name: 'Aperol Spritz',
    ingredients: [
      { templateName: 'Aperol', ratio: 3 },
      { templateName: 'Prosecco', ratio: 5 },
      { templateName: 'Soda Water', ratio: 1 },
    ],
    dilutionPercent: 0, // Batch mode - no dilution (contains bubbles/soda)
    preparationMethod: 'built',
    servingSizeMl: 180, // ~2 UK units at 9.5% ABV
    servingStyle: 'rocks',
  },
];
