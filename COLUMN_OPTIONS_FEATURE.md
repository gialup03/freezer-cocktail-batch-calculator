# Column Visibility Options Feature

## Overview
Added an "Options" button next to the Ingredients section that allows users to toggle the visibility of optional data columns.

## Features Implemented

### 1. Column Visibility Toggle
- **Options Button**: Located next to "Add Ingredient" button
- **Dropdown Menu**: Click to show/hide column options
- **Two Toggle Options**:
  - **Weight**: Shows "Density (g/L)" in ingredients and "Weight (g)" in batch breakdown
  - **Sugar**: Shows "Sugar Conc. (g/L)" in ingredients and "Sugar (g)" in batch breakdown

### 2. Sugar Content Tracking
- **Input Field**: Sugar content in grams per liter (g/L) for each ingredient
- **Calculations**:
  - Total sugar in grams for each ingredient based on volume
  - Total sugar across all ingredients
  - Final sugar concentration (g/L) in the finished drink
- **Display**: Shows final sugar concentration above the results table when enabled

### 3. Default State
All columns are hidden by default to keep the interface clean and focused on the essential information (ingredient name, ratio, ABV, and volumes).

## Data Model Changes

### Ingredient Type
```typescript
interface Ingredient {
  densityGPerL: number; // g/L (e.g., 940 for spirits, 1000 for water)
  sugarGPerL?: number; // g/L - sugar content
}
```

### IngredientCalculation Type
```typescript
interface IngredientCalculation {
  sugarG?: number; // total sugar in grams for this ingredient
}
```

### BatchResult Type
```typescript
interface BatchResult {
  totalSugarG?: number; // total sugar in grams across all ingredients
  sugarGPerL?: number; // sugar concentration in final drink
}
```

### ColumnVisibility Type
```typescript
interface ColumnVisibility {
  weight: boolean;  // Controls both density input and weight output
  sugar: boolean;   // Controls both sugar conc. input and sugar output
}
```

## User Experience

1. **Clean Default View**: Users see only essential columns by default
2. **Easy Access to Advanced Features**: One click to reveal additional options
3. **Persistent State**: Column visibility is maintained throughout the session
4. **Contextual Information**: Sugar concentration displayed prominently when enabled

## Technical Implementation

- **State Management**: Column visibility state managed in App.tsx
- **Props Drilling**: Visibility settings passed to IngredientList, IngredientInput, and ResultsTable
- **Conditional Rendering**: Table columns conditionally rendered based on visibility state
- **Calculations**: 
  - Density converted from g/L to g/mL (÷1000) for weight calculations
  - Sugar calculations integrated into existing batch calculation logic
- **Click Outside**: Options dropdown closes when clicking outside
- **Default Values**: 
  - Density: 1000 g/L (water equivalent)
  - Common values: Spirits ~940 g/L, Vermouth ~980 g/L, Water 1000 g/L
