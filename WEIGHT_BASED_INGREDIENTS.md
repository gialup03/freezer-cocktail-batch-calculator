# Weight-Based Ingredients Feature

## Overview

The app now supports ingredients measured by weight (like mint, herbs, spices) alongside liquid ingredients. This is implemented through a new **g/part** column.

## How It Works

### For Liquid Ingredients
- Use the **Ratio** column as normal (e.g., Rum: 2, Lime: 1)
- Leave the **g/part** column empty (shows "—")
- System calculates volume and weight based on batch size

### For Weight-Based Ingredients
- **Ratio** column shows "—" (not used for weight-based ingredients)
- Set the **g/part** value (grams per ratio part)
- System calculates: `total grams = g/part × total liquid ratio`

## Example: Mojito with Mint

### Input Table
```
Ingredient          Ratio   ABV%   Density   Sugar   g/part
White Rum           2.0     40     940       0       —
Lime Juice          1.0     0      1020      10      —
Simple Syrup        0.75    0      1150      500     —
Mint Leaves         —       0      1000      0       10      ← 10g per part, ratio not used
Soda Water          2.0     0      1000      0       —
```

### Calculation
- Total liquid ratio = 2 + 1 + 0.75 + 2 = 5.75 parts
- Mint calculation = 10g/part × 5.75 parts = **57.5g mint**

### Results Table (2000mL batch)
```
Ingredient                  Ratio   Vol (mL)   Vol (oz)   Weight (g)
White Rum                   2.00    696        23.5       654
Lime Juice                  1.00    348        11.8       355
Simple Syrup (1:1)          0.75    261        8.8        300
Mint Leaves (by weight)     —       —          —          57.5g      ← Total grams
Soda Water                  2.00    696        23.5       696
```

## Adjusting Weight-Based Ingredients

Want more or less of a weight-based ingredient? Just change the g/part value:

- **More mint**: 15g/part × 5.75 = 86.25g total
- **Less mint**: 5g/part × 5.75 = 28.75g total
- **Double mint**: 20g/part × 5.75 = 115g total

## Available Weight-Based Ingredients

The following templates are available in the "Batch Ingredient" category:

- **Mint Leaves**: 10g/part (typical for mojitos, juleps)
- **Basil Leaves**: 8g/part
- **Cucumber**: 15g/part
- **Ginger**: 5g/part
- **Jalapeño**: 3g/part

## Technical Implementation

### Data Structure
```typescript
interface Ingredient {
  // ... existing fields
  gramsPerPart?: number; // When set, ingredient is weight-based
}
```

### Display Logic
- Weight-based ingredients show "—" for volume columns
- Weight is shown in **bold** with "g" suffix
- Name displays "(by weight)" tag in results

### Calculation Logic
1. Separate liquid and weight-based ingredients
2. Calculate total ratio from liquid ingredients only
3. For weight-based: multiply `gramsPerPart × totalRatio`
4. Display weight prominently, omit meaningless volume

## Design Rationale

This approach was chosen because:
- ✓ **Unambiguous**: g/part column makes it immediately clear what's weight-based
- ✓ **Intuitive**: "10g per part" is easy to understand
- ✓ **Scales naturally**: More parts automatically means more of the ingredient
- ✓ **Flexible**: Can adjust intensity by changing g/part value
- ✓ **Batch-friendly**: Designed for batch preparation where solids are muddled/infused

## Use Cases

### Muddled Ingredients
- Mint in Mojitos
- Basil in Gin Smashes
- Cucumber in Garden Cocktails

### Infused Ingredients
- Ginger in Moscow Mules
- Jalapeño in Spicy Margaritas
- Herbs in aromatic cocktails

### Note on Garnishes
This feature is for **batch preparation** ingredients (muddled, infused). 
Traditional garnishes (orange peel, cherry, herb sprig) are added per-drink when serving 
and are not included in batch calculations.
