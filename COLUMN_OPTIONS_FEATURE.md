# Column Visibility Options Feature

## Overview
Added an "Options" button next to the Ingredients section that allows users to toggle the visibility of optional data columns.

## Features Implemented

### 1. Column Visibility Toggle
- **Options Button**: Located next to "Add Ingredient" button
- **Dropdown Menu**: Click to show/hide column options
- **Three Toggle Options**:
  - **Density (g/mL)**: Show/hide density input in ingredients table
  - **Weight (g)**: Show/hide weight column in batch breakdown
  - **Sugar (g/L)**: Show/hide sugar content input and calculations

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
  density: boolean;
  weight: boolean;
  sugar: boolean;
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
- **Calculations**: Sugar calculations integrated into existing batch calculation logic
- **Click Outside**: Options dropdown closes when clicking outside
