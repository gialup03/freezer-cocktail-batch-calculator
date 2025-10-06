import { Droplet } from 'lucide-react';
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
  ingredients 
}: DilutionControlProps) {
  
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
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Droplet className="text-blue-700" size={20} />
        <h3 className="font-semibold text-blue-900">Dilution Control</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="dilution-slider" className="text-sm font-medium text-slate-900">
            Water Volume
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
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>No dilution</span>
          <span>Maximum dilution</span>
        </div>
      </div>
    </div>
  );
}
