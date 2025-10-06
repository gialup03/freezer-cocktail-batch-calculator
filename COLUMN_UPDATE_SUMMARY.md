# Column Options Update Summary

## Changes Made

### 1. Updated Column Structure
The options menu now has two toggles:
- **Weight**: Shows density input (g/L) in ingredients and weight output (g) in batch breakdown
- **Sugar**: Shows sugar concentration input (g/L) in ingredients and sugar output (g) in batch breakdown

### 2. Changed Density Units from g/mL to g/L

**Why this change?**
- More intuitive for users (larger numbers are easier to work with)
- Consistent with sugar concentration units (g/L)
- Aligns with common industry practice

**Conversions:**
| Old (g/mL) | New (g/L) | Ingredient Type |
|------------|-----------|-----------------|
| 0.94       | 940       | Gin/Vodka       |
| 0.98       | 980       | Vermouth        |
| 1.00       | 1000      | Water           |

### 3. Column Headers

**Ingredients Table:**
- When "Weight" is enabled: **"Density (g/L)"**
- When "Sugar" is enabled: **"Sugar Conc. (g/L)"**

**Batch Breakdown Table:**
- When "Weight" is enabled: **"Weight (g)"**
- When "Sugar" is enabled: **"Sugar (g)"**

### 4. Input Field Changes

**Density Input:**
- Step value: 10 (was 0.01)
- Default value: 1000 g/L (was 1.0 g/mL)
- Example values: 940 (spirits), 980 (vermouth), 1000 (water)

**Sugar Input:**
- Step value: 10 (was 1)
- Placeholder: "0"
- Example values: 100-200 g/L for sweet vermouths, liqueurs

### 5. Calculation Updates

The weight calculation now converts density from g/L to g/mL:
```typescript
const weightG = volumeMl * (densityGPerL / 1000);
```

This ensures accurate weight calculations while using the more intuitive g/L input unit.

## User Impact

- **Existing users**: Will need to re-enter density values (940 instead of 0.94)
- **New users**: More intuitive interface with larger, easier-to-read numbers
- **Functionality**: All calculations remain accurate after unit conversion
