# ABV/Dilution Flow Redesign

## Overview
Redesigned the dilution system to give users direct control over water dilution via a slider, with clear warnings when ABV drops below the freeze threshold.

## Changes Made

### 1. **User Control with Slider (0-50%)**
- Users now control dilution percentage directly via a slider
- Shows real-time water volume (mL) and resulting ABV
- Allows users to balance between high-proof (less dilution) and smooth/balanced (more dilution)

### 2. **Freeze Warning System**
- Displays warning when final ABV < 30%
- Explains that cocktail may turn to slush depending on sugar content
- Recommends 30-33% ABV range for pourable consistency
- Warning is non-blocking - users have full freedom to choose

### 3. **Updated Calculation Logic**
- Dilution is now calculated as percentage of final volume
- Formula: `waterMl = (baseVolume × dilutionPercent) / (100 - dilutionPercent)`
- Water appears as separate line item in results table when added
- ABV recalculates in real-time as slider moves

### 4. **Removed Old System**
- Removed automatic dilution suggestion component
- Removed `needsDilution` logic that automatically triggered at 33% ABV
- No more "Apply Dilution" button that modified recipe

## Files Changed

### Types (`src/types/index.ts`)
- Added `dilutionPercent` to `BatchConfig`
- Replaced `dilutionSuggestion` with simpler `waterMl` and `totalVolumeMl` in `BatchResult`

### Calculations (`src/utils/calculations.ts`)
- Rewrote calculation to handle dilution as percentage of final volume
- Water is added as separate calculation entry when dilution > 0
- Removed old `calculateDilution()` function

### New Component (`src/components/DilutionControl.tsx`)
- Slider control for dilution percentage (0-50%)
- Real-time ABV display
- Amber warning box when ABV < 30%
- Clear guidance text about balancing flavor and texture

### App Component (`src/App.tsx`)
- Added `dilutionPercent` state
- Replaced `DilutionSuggestion` with `DilutionControl`
- Removed `handleApplyDilution` logic

## User Experience Flow

1. User enters cocktail recipe ingredients
2. User sees initial ABV without dilution
3. User adjusts dilution slider to desired level
4. Real-time feedback shows:
   - Water volume being added
   - Final ABV percentage
   - Warning if below freeze threshold (< 30%)
5. Results table shows water as separate line item
6. User has full control to dial in their preferred balance

## Benefits

- **More intuitive**: Direct control vs. automatic suggestions
- **More flexible**: Users can choose any dilution level
- **Better education**: Explains freeze risk without being prescriptive
- **Cleaner UX**: No state-modifying buttons, just simple slider control
- **Real-time feedback**: See effects of dilution instantly
