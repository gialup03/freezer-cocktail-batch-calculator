import { useState } from 'react';
import type { Ingredient, ColumnVisibility } from './types';
import { calculateBatch } from './utils/calculations';
import { IngredientList } from './components/IngredientList';
import { BatchConfig } from './components/BatchConfig';
import { AbvBadge } from './components/AbvBadge';
import { DilutionControl } from './components/DilutionControl';
import { ResultsTable } from './components/ResultsTable';

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Gin', ratio: 3, abv: 40, densityGPerL: 940 },
    { id: '2', name: 'Dry Vermouth', ratio: 1, abv: 18, densityGPerL: 980 },
  ]);
  const [batchSizeMl, setBatchSizeMl] = useState(750);
  const [dilutionPercent, setDilutionPercent] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    weight: false,
    sugar: false
  });
  
  const result = calculateBatch(ingredients, { batchSizeMl, dilutionPercent });
  
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 py-6 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold text-slate-900">
            Freezer Cocktail Calculator
          </h1>
          <p className="text-slate-600 mt-2">
            Calculate volumes, weights, and ABV for batched cocktails
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <section className="mb-8">
          <IngredientList 
            ingredients={ingredients}
            onChange={setIngredients}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </section>
        
        {ingredients.length > 0 && batchSizeMl > 0 && (
          <>
            <section className="mb-8">
              <DilutionControl
                dilutionPercent={dilutionPercent}
                onChange={setDilutionPercent}
                finalAbv={result.finalAbv}
                waterMl={result.waterMl}
                ingredients={ingredients}
              />
            </section>
            
            <section className="mb-8">
              <AbvBadge abv={result.finalAbv} />
            </section>
            
            <section className="mb-8">
              <BatchConfig 
                batchSizeMl={batchSizeMl}
                onChange={setBatchSizeMl}
              />
            </section>
            
            <section>
              <ResultsTable 
                calculations={result.ingredients} 
                columnVisibility={columnVisibility}
                totalSugarG={result.totalSugarG}
                sugarGPerL={result.sugarGPerL}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
