# Spec Provenance

**User Request**: Develop a static web calculator for batched "freezer door" cocktails that converts between ingredient volume ratios, absolute volumes (per batch/per serving), and weights (per batch). Must calculate final ABV. Primary use case: determining dilution for recipes like a 3:1 martini to hit 30–33% ABV target, and measuring by weight for batch production.

**Mode**: New project, static calculator (no persistence required)

---

# Spec Header

## Name
Freezer Cocktail Calculator

## Smallest Acceptable Scope (v1)
A single-page web calculator that:
- Accepts a list of ingredients, each with:
  - Name
  - Volume ratio (e.g., 3 for gin, 1 for vermouth in a 3:1 martini)
  - ABV (% alcohol by volume, user-entered)
  - Specific density (g/mL, user-entered)
- Allows user to specify:
  - Target batch size (total volume in mL or oz)
  - **OR** number of servings + serving size
- Outputs:
  - **Per-ingredient breakdown**: volume (mL/oz), weight (g)
  - **Final batch ABV** (weighted average based on volumes and ABVs)
  - **Suggested dilution** to hit 30–33% ABV target (if current ABV is higher)
- Works offline once loaded (pure client-side logic)
- Responsive design (works on phone in kitchen or desktop)

## Non-Goals (Defer or Exclude)
- Saving/loading recipes (no localStorage, no backend)
- Recipe library or sharing
- Ingredient database (user manually enters ABV/density)
- Mobile app (web-first, can wrap later if needed)
- User accounts or authentication
- Advanced features: cost calculation, ingredient substitutions, stirring/shaking dilution estimates

---

# Paths to Supplementary Guidelines

- **Tech Stack**: https://raw.githubusercontent.com/memextech/templates/refs/heads/main/stack/react_website.md
- **Design System**: https://raw.githubusercontent.com/memextech/templates/refs/heads/main/design/minimalist-b2b-professional.md

---

# Decision Snapshot

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Static single-page React app (Vite + TypeScript) | No backend needed; pure calculation logic. Fast to ship, works offline. |
| **Hosting** | Netlify | Zero-config SPA hosting with instant deploy from Git. |
| **Styling** | Tailwind CSS (Minimalist B2B Professional theme) | Clean, readable, professional. High contrast for kitchen use. |
| **State** | Local React state (useState) | No persistence needed; recalculates on input change. |
| **Units** | mL (metric) primary; oz secondary | Standard in cocktail recipes; allow toggle or dual display. |
| **ABV Calculation** | Weighted average by volume | `(Σ volume_i × ABV_i) / total_volume` |
| **Dilution Logic** | Calculate water needed to reach target ABV | `water_volume = (current_ABV - target_ABV) / target_ABV × current_total_volume` |

---

# Architecture at a Glance

```
┌─────────────────────────────────────────────┐
│  Freezer Cocktail Calculator (SPA)          │
│  ┌───────────────────────────────────────┐  │
│  │  Input Section                        │  │
│  │  • Ingredient list (name, ratio,      │  │
│  │    ABV, density)                      │  │
│  │  • Batch size OR servings × size      │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  Calculation Engine (pure functions)  │  │
│  │  • normalizeRatios()                  │  │
│  │  • calculateVolumes()                 │  │
│  │  • calculateWeights()                 │  │
│  │  • calculateABV()                     │  │
│  │  • suggestDilution()                  │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  Output Section                       │  │
│  │  • Per-ingredient table (vol, weight) │  │
│  │  • Final ABV badge                    │  │
│  │  • Dilution recommendation            │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Key Calculation Flow**:
1. User enters ratios (e.g., 3:1:0 for gin:vermouth:water)
2. User enters batch size (e.g., 750 mL)
3. App normalizes ratios to percentages
4. App calculates per-ingredient volumes: `volume_i = (ratio_i / Σ ratios) × batch_size`
5. App calculates weights: `weight_i = volume_i × density_i`
6. App calculates final ABV: `(Σ volume_i × ABV_i) / batch_size`
7. If ABV > 33%, suggest water volume to dilute to 30–33% range

---

# Implementation Plan

## 1. Project Setup
```bash
npm create vite@latest freezer-cocktail-calculator -- --template react-ts
cd freezer-cocktail-calculator
npm install -D tailwindcss@^3.4.17 postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react
```

**File**: `tailwind.config.js`
- Extend theme with Minimalist B2B Professional colors (slate palette, blue accent)
- Configure content paths: `["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`

**File**: `src/index.css`
- Import Tailwind base, components, utilities
- Add Inter font from Google Fonts
- Set body background to `#ffffff`, text to `#0f172a`

## 2. Type Definitions

**File**: `src/types/index.ts`
```typescript
export interface Ingredient {
  id: string;
  name: string;
  ratio: number; // e.g., 3 for gin in 3:1 martini
  abv: number;   // 0-100 (e.g., 40 for 40% ABV)
  density: number; // g/mL (e.g., 0.95 for vodka, 1.0 for water)
}

export interface BatchConfig {
  batchSizeMl: number; // total batch size in mL
}

export interface IngredientCalculation {
  ingredient: Ingredient;
  volumeMl: number;
  volumeOz: number;
  weightG: number;
}

export interface BatchResult {
  ingredients: IngredientCalculation[];
  finalAbv: number;
  dilutionSuggestion: {
    needsDilution: boolean;
    waterMl?: number;
    targetAbv?: number;
  };
}
```

## 3. Core Calculation Functions

**File**: `src/utils/calculations.ts`
```typescript
export function calculateBatch(
  ingredients: Ingredient[],
  config: BatchConfig
): BatchResult {
  // 1. Normalize ratios to total volume
  const totalRatio = ingredients.reduce((sum, ing) => sum + ing.ratio, 0);
  
  // 2. Calculate per-ingredient volumes
  const calculations: IngredientCalculation[] = ingredients.map(ing => {
    const volumeMl = (ing.ratio / totalRatio) * config.batchSizeMl;
    const volumeOz = volumeMl * 0.033814; // mL to oz conversion
    const weightG = volumeMl * ing.density;
    
    return { ingredient: ing, volumeMl, volumeOz, weightG };
  });
  
  // 3. Calculate weighted ABV
  const totalAlcoholMl = calculations.reduce(
    (sum, calc) => sum + (calc.volumeMl * calc.ingredient.abv / 100),
    0
  );
  const finalAbv = (totalAlcoholMl / config.batchSizeMl) * 100;
  
  // 4. Suggest dilution if ABV > 33%
  const dilutionSuggestion = calculateDilution(finalAbv, config.batchSizeMl);
  
  return { ingredients: calculations, finalAbv, dilutionSuggestion };
}

function calculateDilution(currentAbv: number, currentVolumeMl: number) {
  const targetAbv = 31.5; // midpoint of 30-33% target
  
  if (currentAbv <= 33) {
    return { needsDilution: false };
  }
  
  // Formula: water_needed = (current_ABV - target_ABV) / target_ABV × current_volume
  const waterMl = ((currentAbv - targetAbv) / targetAbv) * currentVolumeMl;
  
  return {
    needsDilution: true,
    waterMl: Math.round(waterMl),
    targetAbv
  };
}
```

## 4. UI Components

**File**: `src/components/IngredientInput.tsx`
- Small component (<50 lines) for a single ingredient row
- Fields: name (text), ratio (number), ABV (number, 0-100), density (number, default 1.0)
- Delete button (Lucide `X` icon)
- Styling: slate-200 border, rounded-lg, p-4, grid layout for inputs

**File**: `src/components/IngredientList.tsx`
- Maps over ingredients array, renders `IngredientInput` for each
- "Add Ingredient" button (primary accent blue, Inter SemiBold)
- Manages add/remove/update logic via props from parent

**File**: `src/components/BatchConfig.tsx`
- Input for batch size (mL)
- Optional: toggle for "servings mode" (number × serving size)
- Styling: card with secondary background (#f8fafc), 24px padding, 8px border-radius

**File**: `src/components/ResultsTable.tsx`
- Table with columns: Ingredient | Volume (mL) | Volume (oz) | Weight (g)
- Styling: alternating row backgrounds, Inter Regular for body, Inter SemiBold for headers
- Footer row: "Total" with sum of volumes/weights

**File**: `src/components/AbvBadge.tsx`
- Large display of final ABV (e.g., "28.5% ABV")
- Color coding:
  - Green (#10b981) if 30-33%
  - Yellow (#f59e0b) if 25-29% or 34-40%
  - Red (#ef4444) if <25% or >40%
- Styling: Inter Bold, 32px (2rem), centered

**File**: `src/components/DilutionSuggestion.tsx`
- Conditional render if `needsDilution === true`
- Message: "Add [X] mL of water to reach ~31.5% ABV"
- Styling: info alert with blue-50 background, blue-600 border, 16px padding

## 5. Main App Component

**File**: `src/App.tsx`
```typescript
function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    // Example: 3:1 martini starting template
    { id: '1', name: 'Gin', ratio: 3, abv: 40, density: 0.94 },
    { id: '2', name: 'Dry Vermouth', ratio: 1, abv: 18, density: 0.98 },
  ]);
  const [batchSizeMl, setBatchSizeMl] = useState(750);
  
  const result = calculateBatch(ingredients, { batchSizeMl });
  
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-slate-900">
            Freezer Cocktail Calculator
          </h1>
          <p className="text-slate-600 mt-2">
            Calculate volumes, weights, and ABV for batched cocktails
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <section className="mb-8">
          <IngredientList 
            ingredients={ingredients}
            onChange={setIngredients}
          />
        </section>
        
        <section className="mb-8">
          <BatchConfig 
            batchSizeMl={batchSizeMl}
            onChange={setBatchSizeMl}
          />
        </section>
        
        <section className="mb-8">
          <AbvBadge abv={result.finalAbv} />
          {result.dilutionSuggestion.needsDilution && (
            <DilutionSuggestion suggestion={result.dilutionSuggestion} />
          )}
        </section>
        
        <section>
          <ResultsTable calculations={result.ingredients} />
        </section>
      </main>
    </div>
  );
}
```

## 6. Responsive Behavior
- Mobile (<768px): single column, stack ingredient inputs, increase input padding to 48px min touch targets
- Tablet (768-1199px): maintain single column, reduce container padding to 20px
- Desktop (1200px+): max-width 1024px, 24px padding

## 7. Netlify Deployment Setup

**File**: `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deployment**:
1. Push to GitHub
2. Connect repo to Netlify
3. Auto-deploy on push to main branch

---

# Verification & Demo Script

## Local Development
```bash
npm run dev
# Should start on http://localhost:5173 without errors
```

## Build Verification
```bash
npm run build
# Must complete without TypeScript or Tailwind errors

npx tsc --noEmit
# Must pass with zero errors
```

## Manual Testing Checklist

### Test Case 1: Classic 3:1 Martini
**Inputs**:
- Ingredient 1: Gin, ratio=3, ABV=40, density=0.94
- Ingredient 2: Dry Vermouth, ratio=1, ABV=18, density=0.98
- Batch size: 750 mL

**Expected Output**:
- Gin: 562.5 mL, ~528.8 g
- Vermouth: 187.5 mL, ~183.8 g
- Final ABV: ~34.5%
- Dilution suggestion: "Add ~80 mL water to reach 31.5% ABV"

### Test Case 2: Pre-Diluted Martini (Target ABV)
**Inputs**:
- Ingredient 1: Gin, ratio=3, ABV=40, density=0.94
- Ingredient 2: Dry Vermouth, ratio=1, ABV=18, density=0.98
- Ingredient 3: Water, ratio=1, ABV=0, density=1.0
- Batch size: 750 mL

**Expected Output**:
- Final ABV: ~26-27%
- No dilution suggestion (or suggest less water)

### Test Case 3: Edge Cases
- [ ] Zero ingredients → show empty state
- [ ] Single ingredient → correct calculation
- [ ] Batch size = 0 → validation message
- [ ] Negative ratio/ABV → validation (prevent negative numbers in inputs)
- [ ] ABV > 100 → validation message

### Responsive Testing
- [ ] Desktop (1200px+): full layout, readable table
- [ ] Tablet (768-1199px): stacked layout, touch-friendly
- [ ] Mobile (375px): single column, 48px min touch targets, no horizontal scroll

### Accessibility Testing
- [ ] Keyboard navigation: tab through all inputs, Enter to submit
- [ ] Screen reader: form labels properly associated
- [ ] Color contrast: text meets WCAG AA (4.5:1 for body text)

---

# Deploy

## Netlify Setup
1. **Create Netlify Account**: Sign up at netlify.com
2. **Connect Repository**: 
   - "Add new site" → "Import existing project"
   - Authorize GitHub, select `freezer-cocktail-calculator` repo
3. **Build Settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy**: Click "Deploy site"
5. **Custom Domain** (optional): 
   - Settings → Domain management → Add custom domain
   - Or use Netlify subdomain: `[your-site-name].netlify.app`

## Post-Deploy Verification
- [ ] Visit live URL, calculator loads without errors
- [ ] Enter test case, verify calculations match expected
- [ ] Test on mobile device (responsive layout works)
- [ ] Check browser console for errors (should be clean)

## Iteration Path (Post-v1)
If user finds the calculator useful and wants enhancements:
- **Phase 2**: Add localStorage to remember last recipe (non-goal for v1, but easy add)
- **Phase 3**: Ingredient presets (common spirits with ABV/density pre-filled)
- **Phase 4**: Export to shopping list or recipe card (PDF/print)
- **Later**: Backend for recipe library, sharing (requires nextjs_fullstack.md stack)

---

**Plan complete.** Ready to build when you switch to Build mode.