export interface IngredientTemplate {
  name: string;
  category: string;
  abv: number;
  densityGPerL: number;
  sugarGPerL?: number;
}

export const INGREDIENT_TEMPLATES: IngredientTemplate[] = [
  // Spirits (40% ABV standard)
  { name: 'Gin', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Vodka', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'White Rum', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Dark Rum', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Tequila', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Mezcal', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Whisky', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Whiskey', category: 'Spirits', abv: 45, densityGPerL: 940 },
  { name: 'Cognac', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Brandy', category: 'Spirits', abv: 40, densityGPerL: 940 },
  { name: 'Pisco', category: 'Spirits', abv: 40, densityGPerL: 940 },
  
  // Liqueurs
  { name: 'Cointreau', category: 'Liqueurs', abv: 40, densityGPerL: 1040, sugarGPerL: 240 },
  { name: 'Triple Sec', category: 'Liqueurs', abv: 30, densityGPerL: 1050, sugarGPerL: 250 },
  { name: 'Grand Marnier', category: 'Liqueurs', abv: 40, densityGPerL: 1050, sugarGPerL: 230 },
  { name: 'Campari', category: 'Liqueurs', abv: 25, densityGPerL: 1070, sugarGPerL: 250 },
  { name: 'Aperol', category: 'Liqueurs', abv: 11, densityGPerL: 1090, sugarGPerL: 300 },
  { name: 'Green Chartreuse', category: 'Liqueurs', abv: 55, densityGPerL: 1050, sugarGPerL: 250 },
  { name: 'Yellow Chartreuse', category: 'Liqueurs', abv: 40, densityGPerL: 1070, sugarGPerL: 300 },
  { name: 'Maraschino Liqueur', category: 'Liqueurs', abv: 32, densityGPerL: 1060, sugarGPerL: 280 },
  { name: 'Crème de Violette', category: 'Liqueurs', abv: 20, densityGPerL: 1100, sugarGPerL: 350 },
  { name: 'Crème de Cacao', category: 'Liqueurs', abv: 25, densityGPerL: 1100, sugarGPerL: 350 },
  { name: 'Crème de Cassis', category: 'Liqueurs', abv: 20, densityGPerL: 1100, sugarGPerL: 350 },
  { name: 'Amaretto', category: 'Liqueurs', abv: 28, densityGPerL: 1080, sugarGPerL: 320 },
  { name: 'Kahlúa', category: 'Liqueurs', abv: 20, densityGPerL: 1100, sugarGPerL: 350 },
  { name: 'St-Germain', category: 'Liqueurs', abv: 20, densityGPerL: 1090, sugarGPerL: 320 },
  { name: 'Benedictine', category: 'Liqueurs', abv: 40, densityGPerL: 1070, sugarGPerL: 280 },
  { name: 'Drambuie', category: 'Liqueurs', abv: 40, densityGPerL: 1070, sugarGPerL: 280 },
  { name: 'Fernet-Branca', category: 'Liqueurs', abv: 39, densityGPerL: 1000, sugarGPerL: 100 },
  { name: 'Cynar', category: 'Liqueurs', abv: 16.5, densityGPerL: 1070, sugarGPerL: 250 },
  { name: 'Amaro Nonino', category: 'Liqueurs', abv: 35, densityGPerL: 1050, sugarGPerL: 200 },
  
  // Fortified Wines
  { name: 'Dry Vermouth', category: 'Fortified Wine', abv: 18, densityGPerL: 1020, sugarGPerL: 40 },
  { name: 'Sweet Vermouth', category: 'Fortified Wine', abv: 18, densityGPerL: 1060, sugarGPerL: 150 },
  { name: 'Blanc Vermouth', category: 'Fortified Wine', abv: 16, densityGPerL: 1050, sugarGPerL: 130 },
  { name: 'Lillet Blanc', category: 'Fortified Wine', abv: 17, densityGPerL: 1040, sugarGPerL: 100 },
  { name: 'Fino Sherry', category: 'Fortified Wine', abv: 15, densityGPerL: 1010, sugarGPerL: 10 },
  { name: 'Oloroso Sherry', category: 'Fortified Wine', abv: 18, densityGPerL: 1020, sugarGPerL: 50 },
  { name: 'Port', category: 'Fortified Wine', abv: 20, densityGPerL: 1050, sugarGPerL: 130 },
  
  // Bitters
  { name: 'Angostura Bitters', category: 'Bitters', abv: 44.7, densityGPerL: 950 },
  { name: 'Orange Bitters', category: 'Bitters', abv: 40, densityGPerL: 950 },
  
  // Syrups
  { name: 'Simple Syrup (1:1)', category: 'Syrup', abv: 0, densityGPerL: 1200, sugarGPerL: 500 },
  { name: 'Rich Simple Syrup (2:1)', category: 'Syrup', abv: 0, densityGPerL: 1330, sugarGPerL: 667 },
  { name: 'Demerara Syrup', category: 'Syrup', abv: 0, densityGPerL: 1200, sugarGPerL: 500 },
  { name: 'Honey Syrup', category: 'Syrup', abv: 0, densityGPerL: 1200, sugarGPerL: 500 },
  { name: 'Agave Syrup', category: 'Syrup', abv: 0, densityGPerL: 1350, sugarGPerL: 680 },
  { name: 'Grenadine', category: 'Syrup', abv: 0, densityGPerL: 1300, sugarGPerL: 600 },
  { name: 'Orgeat', category: 'Syrup', abv: 0, densityGPerL: 1250, sugarGPerL: 550 },
  { name: 'Falernum', category: 'Syrup', abv: 11, densityGPerL: 1150, sugarGPerL: 450 },
  
  // Juices (Fresh/Cold-Pressed)
  { name: 'Lime Juice', category: 'Juice', abv: 0, densityGPerL: 1020, sugarGPerL: 10 },
  { name: 'Lemon Juice', category: 'Juice', abv: 0, densityGPerL: 1020, sugarGPerL: 12 },
  { name: 'Orange Juice', category: 'Juice', abv: 0, densityGPerL: 1045, sugarGPerL: 85 },
  { name: 'Grapefruit Juice', category: 'Juice', abv: 0, densityGPerL: 1040, sugarGPerL: 70 },
  { name: 'Pineapple Juice', category: 'Juice', abv: 0, densityGPerL: 1055, sugarGPerL: 100 },
  { name: 'Cranberry Juice', category: 'Juice', abv: 0, densityGPerL: 1045, sugarGPerL: 100 },
  { name: 'Tomato Juice', category: 'Juice', abv: 0, densityGPerL: 1020, sugarGPerL: 35 },
  
  // Wine & Bubbles
  { name: 'Prosecco', category: 'Wine & Bubbles', abv: 11, densityGPerL: 990, sugarGPerL: 15 },
  { name: 'Champagne', category: 'Wine & Bubbles', abv: 12, densityGPerL: 990, sugarGPerL: 10 },
  { name: 'Dry White Wine', category: 'Wine & Bubbles', abv: 12, densityGPerL: 990, sugarGPerL: 5 },
  
  // Non-Alcoholic Mixers
  { name: 'Soda Water', category: 'Mixer', abv: 0, densityGPerL: 1000, sugarGPerL: 0 },
  { name: 'Tonic Water', category: 'Mixer', abv: 0, densityGPerL: 1040, sugarGPerL: 85 },
  { name: 'Ginger Beer', category: 'Mixer', abv: 0, densityGPerL: 1040, sugarGPerL: 100 },
  { name: 'Cola', category: 'Mixer', abv: 0, densityGPerL: 1040, sugarGPerL: 105 },
  { name: 'Espresso', category: 'Mixer', abv: 0, densityGPerL: 1000, sugarGPerL: 0 },
];

export const INGREDIENT_CATEGORIES = [
  'All',
  'Spirits',
  'Liqueurs',
  'Fortified Wine',
  'Bitters',
  'Syrup',
  'Juice',
  'Wine & Bubbles',
  'Mixer',
] as const;

export type IngredientCategory = typeof INGREDIENT_CATEGORIES[number];

export function getTemplatesByCategory(category: IngredientCategory): IngredientTemplate[] {
  if (category === 'All') {
    return INGREDIENT_TEMPLATES;
  }
  return INGREDIENT_TEMPLATES.filter(t => t.category === category);
}
