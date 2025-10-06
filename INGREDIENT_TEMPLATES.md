# Ingredient Templates Feature

## Overview
The ingredient templates feature allows users to quickly add common cocktail ingredients with pre-filled default values for ABV, density, and sugar content. Users can still edit all values after selection.

## How to Use

### Adding from Template
1. Click the **"From Template"** button in the Ingredients section
2. Browse templates by category (Spirits, Liqueurs, Vermouth, etc.) or search by name
3. Click on any ingredient to add it with default values
4. Edit the values as needed after adding

### Adding Custom Ingredient
1. Click **"Add Custom"** to create a blank ingredient
2. Fill in all values manually

## Template Library

The template library includes 45+ essential freezer cocktail ingredients organized into categories:

### Categories
- **Spirits**: Gin, Vodka, Rum, Tequila, Whiskey, Bourbon, Rye, Cognac, Brandy, Mezcal, Pisco
- **Liqueurs**: Cointreau, Triple Sec, Campari, Aperol, Chartreuse, Maraschino, Crème de Violette, Amaretto, Kahlúa, St-Germain, Benedictine, Drambuie, Fernet-Branca, Cynar, Amaro Nonino
- **Fortified Wine**: Dry Vermouth, Sweet Vermouth, Blanc Vermouth, Lillet Blanc, Fino Sherry, Oloroso Sherry, Port
- **Syrup**: Simple Syrup (1:1), Rich Simple Syrup (2:1), Demerara, Honey, Agave, Grenadine, Orgeat, Falernum

### Default Values
Each template includes:
- **ABV (%)**: Alcohol by volume percentage
- **Density (g/L)**: Specific density in grams per liter
- **Sugar (g/L)**: Sugar content in grams per liter (when applicable)

## Technical Details

### Files
- `src/utils/ingredientTemplates.ts`: Template data and utilities
- `src/components/TemplateSelector.tsx`: Dropdown selection UI
- `src/components/IngredientList.tsx`: Integration with ingredient list

### Customization
To add new templates, edit `src/utils/ingredientTemplates.ts`:

```typescript
{
  name: 'Your Ingredient',
  category: 'Spirits', // or other category
  abv: 40,
  densityGPerL: 940,
  sugarGPerL: 0 // optional
}
```

### Template Data Sources
Default values are based on:
- Standard industry ABV values
- Manufacturer specifications
- Common cocktail recipe resources
- Physical properties of liquids

Users should verify and adjust values based on their specific brands and ingredients.
