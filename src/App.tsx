import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import type { Ingredient, ColumnVisibility } from './types';
import { calculateBatch } from './utils/calculations';
import { IngredientList } from './components/IngredientList';
import { AbvBadge } from './components/AbvBadge';
import { DilutionControl } from './components/DilutionControl';
import { ResultsTable } from './components/ResultsTable';
import { ServingInfo } from './components/ServingInfo';

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Gin', ratio: 3, abv: 40, densityGPerL: 940, sugarGPerL: 0 },
    { id: '2', name: 'Dry Vermouth', ratio: 1, abv: 18, densityGPerL: 980, sugarGPerL: 40 },
  ]);
  const [batchSizeMl, setBatchSizeMl] = useState(750);
  const [dilutionPercent, setDilutionPercent] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    weight: false,
    sugar: false
  });
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const result = calculateBatch(ingredients, { batchSizeMl, dilutionPercent });
  
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 py-6 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4">
            <img src="/martini.svg" alt="Martini" className="w-10 h-10" />
            <h1 className="text-4xl font-bold text-slate-900">
              Batch Cocktail Calculator
            </h1>
          </div>
          <div className="mt-4 relative" ref={optionsRef}>
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 flex items-center gap-2 text-slate-700"
            >
              <Settings size={16} />
              Options
            </button>
            
            {isOptionsOpen && (
              <div className="absolute top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-10 min-w-[200px]">
                <div className="text-sm font-semibold text-slate-700 mb-3">
                  Show Info On:
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={columnVisibility.weight}
                      onChange={(e) => setColumnVisibility({ ...columnVisibility, weight: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Weight</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={columnVisibility.sugar}
                      onChange={(e) => setColumnVisibility({ ...columnVisibility, sugar: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Sugar</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <section className="mb-8">
          <IngredientList 
            ingredients={ingredients}
            onChange={setIngredients}
            columnVisibility={columnVisibility}
          />
        </section>
        
        {ingredients.length > 0 && (
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
              <AbvBadge 
                abv={result.finalAbv} 
                sugarGPerL={result.sugarGPerL}
                showSugar={columnVisibility.sugar}
              />
            </section>
            
            <section className="mb-8">
              <ResultsTable 
                calculations={result.ingredients} 
                columnVisibility={columnVisibility}
                totalSugarG={result.totalSugarG}
                sugarGPerL={result.sugarGPerL}
                batchSizeMl={batchSizeMl}
                onBatchSizeChange={setBatchSizeMl}
              />
            </section>

            <section>
              <ServingInfo 
                batchSizeMl={batchSizeMl}
                finalAbv={result.finalAbv}
                calculations={result.ingredients}
                columnVisibility={columnVisibility}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
