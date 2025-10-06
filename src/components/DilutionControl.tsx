import { Droplet, AlertTriangle } from 'lucide-react';
import type { Ingredient } from '../types';

interface DilutionControlProps {
  dilutionPercent: number;
  onChange: (percent: number) => void;
  finalAbv: number;
  waterMl: number;
  ingredients: Ingredient[];
}

export function DilutionControl({ 
  dilutionPercent, 
  onChange, 
  finalAbv,
  ingredients 
}: DilutionControlProps) {
  const showFreezeWarning = finalAbv < 30;
  
  // Calculate water parts relative to recipe parts
  const getWaterParts = () => {
    if (dilutionPercent === 0) return 'No water';
    
    // Calculate total parts from ingredients
    const totalBaseParts = ingredients.reduce((sum, ing) => sum + ing.ratio, 0);
    
    // Calculate water parts using the formula:
    // water = (dilutionPercent / (100 - dilutionPercent)) * baseParts
    const waterParts = (dilutionPercent / (100 - dilutionPercent)) * totalBaseParts;
    
    // Round to 1 decimal place
    const roundedWaterParts = Math.round(waterParts * 10) / 10;
    
    return `${roundedWaterParts} ${roundedWaterParts === 1 ? 'part' : 'parts'} water`;
  };
  
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Droplet className="text-slate-700" size={20} />
        <h3 className="font-semibold text-slate-900">Dilution Control</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="dilution-slider" className="text-sm font-medium text-slate-700">
            Water Dilution
          </label>
          <span className="text-sm font-semibold text-slate-900">
            {dilutionPercent}% ({getWaterParts()})
          </span>
        </div>
        
        <input
          id="dilution-slider"
          type="range"
          min="0"
          max="50"
          step="1"
          value={dilutionPercent}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>No dilution</span>
          <span>Maximum dilution</span>
        </div>
      </div>
      
      {showFreezeWarning && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm">
            <p className="font-semibold text-amber-900">Freeze Warning</p>
            <p className="text-amber-800 mt-1">
              ABV below 30% may result in a slushy texture based on sugar content and freezer temperatures. 
              For a pourable consistency, aim for 30% ABV or higher.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
