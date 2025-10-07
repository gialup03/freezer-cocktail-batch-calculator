# Dilution Calculation Update

## Changes Made

Updated the batch dilution calculation to be clearer and more intuitive. The dilution percentage now represents: **"For every 100ml of base recipe, add X ml of water"**, then scale to fit the batch size.

## What Changed

### Before
- Dilution % was a percentage of the **final batch volume**
- Example: 5% dilution on 750ml batch = 37.5ml water + 712.5ml ingredients = 750ml total
- This was confusing - it wasn't clear what the percentage meant

### After  
- Dilution % means "for every 100ml of base recipe, add X ml of water"
- Then normalize everything to fit the batch size
- Example: 50% dilution means ratio of 100:50 (base:water), or 2 parts base to 1 part water
- For 750ml batch with 50% dilution:
  - Total parts = 100 + 50 = 150
  - Base = 750ml × (100/150) = 500ml
  - Water = 750ml × (50/150) = 250ml
  - Total = 750ml (matches batch size)

## Formula Changes

### Old Formula
```
ingredientsFraction = (100 - dilutionPercent) / 100
waterMl = batchSizeMl * dilutionPercent / 100
ingredientsVolumeMl = batchSizeMl - waterMl
totalVolumeMl = batchSizeMl
```

### New Formula
```
totalParts = 100 + dilutionPercent
ingredientsFraction = 100 / totalParts
waterFraction = dilutionPercent / totalParts
waterMl = batchSizeMl × waterFraction
ingredientsVolumeMl = batchSizeMl - waterMl
totalVolumeMl = batchSizeMl
```

## UI Changes

- Updated the dilution label to show "X% of base" to clarify what the percentage represents
- The "parts" calculation accurately reflects the ratio

## Example Calculations

### 5% Dilution on 750ml Batch
- Ratio: 100 parts base : 5 parts water = 20:1
- Total parts = 105
- Base volume: 750ml × (100/105) = 714.3ml
- Water volume: 750ml × (5/105) = 35.7ml
- Total: 750ml

### 50% Dilution on 100ml Batch
- Ratio: 100 parts base : 50 parts water = 2:1
- Total parts = 150
- Base volume: 100ml × (100/150) = 66.7ml
- Water volume: 100ml × (50/150) = 33.3ml
- Total: 100ml

This makes it much clearer - you specify how much water to add relative to the base recipe (e.g., 50% means add half as much water as base), and everything is normalized to fit your desired batch size.
