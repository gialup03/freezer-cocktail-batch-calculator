import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import type { Ingredient, ColumnVisibility, ServingStyle } from './types';
import { calculateBatch } from './utils/calculations';
import { IngredientList } from './components/IngredientList';
import { DilutionControl } from './components/DilutionControl';
import { ResultsTable } from './components/ResultsTable';
import { ServingInfo } from './components/ServingInfo';
import type { PreparationMethod } from './utils/recipeTemplates';

function App() {
  // Detect if device is mobile (screen width < 768px is typical mobile breakpoint)
  const isMobile = () => window.innerWidth < 768;
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Gin', ratio: 3, abv: 40, densityGPerL: 940, sugarGPerL: 0 },
    { id: '2', name: 'Dry Vermouth', ratio: 1, abv: 18, densityGPerL: 980, sugarGPerL: 40 },
  ]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSizeMl, setBatchSizeMl] = useState(750);
  const [dilutionPercent, setDilutionPercent] = useState(5); // Default to Martini's dilution
  const [servingSizeMl, setServingSizeMl] = useState<number | undefined>(undefined);
  const [servingStyle, setServingStyle] = useState<ServingStyle>('up');
  const [preparationMethod, setPreparationMethod] = useState<PreparationMethod | undefined>(undefined);

  // Reset dilution to 0 when batch mode is turned off
  useEffect(() => {
    if (!batchMode) {
      setDilutionPercent(0);
    } else {
      setDilutionPercent(5); // Reset to default when batch mode is turned back on
    }
  }, [batchMode]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => ({
    weight: false,
    sugar: true // Sugar is checked by default on all devices
  }));
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
      <header className="border-b border-slate-200 py-3 sm:py-4 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/martini.svg" alt="Martini" className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Cocktail Calculator
            </h1>
          </div>
          <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-300 rounded-md hover:bg-slate-50 flex items-center gap-1.5 sm:gap-2 text-slate-700 text-sm sm:text-base"
              >
                <Settings size={14} className="sm:w-4 sm:h-4" />
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
            
            <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={batchMode}
                onChange={(e) => setBatchMode(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm sm:text-base text-slate-700">Batch Mode</span>
            </label>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
        <section className="mb-4 sm:mb-6">
          <IngredientList 
            ingredients={ingredients}
            onChange={setIngredients}
            columnVisibility={columnVisibility}
            onDilutionChange={setDilutionPercent}
            onServingSizeChange={setServingSizeMl}
            servingStyle={servingStyle}
            onServingStyleChange={setServingStyle}
            onPreparationMethodChange={setPreparationMethod}
          />
        </section>
        
        {ingredients.length > 0 && (
          <>
            {batchMode && (
              <section className="mb-4 sm:mb-6">
                <div className="border border-slate-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Batch Options</h2>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <label className="text-xs sm:text-sm font-medium text-slate-600">
                        Batch Size (mL)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={batchSizeMl}
                        onChange={(e) => setBatchSizeMl(parseFloat(e.target.value) || 0)}
                        className="w-24 sm:w-32 px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="e.g., 750"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <DilutionControl
                      dilutionPercent={dilutionPercent}
                      onChange={setDilutionPercent}
                      finalAbv={result.finalAbv}
                      waterMl={result.waterMl}
                      ingredients={ingredients}
                      sugarGPerL={result.sugarGPerL}
                      showSugar={columnVisibility.sugar}
                    />
                    
                    <ResultsTable 
                      calculations={result.ingredients} 
                      columnVisibility={columnVisibility}
                      totalSugarG={result.totalSugarG}
                      sugarGPerL={result.sugarGPerL}
                    />
                  </div>
                </div>
              </section>
            )}

            <section>
              <ServingInfo 
                batchSizeMl={batchSizeMl}
                finalAbv={result.finalAbv}
                calculations={result.ingredients}
                columnVisibility={columnVisibility}
                defaultServingSizeMl={servingSizeMl}
                batchMode={batchMode}
                defaultPreparationMethod={preparationMethod}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
