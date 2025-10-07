import { Droplet } from 'lucide-react';
import type { Ingredient } from '../types';

interface DilutionControlProps {
  dilutionPercent: number;
  onChange: (percent: number) => void;
  finalAbv: number;
  waterMl: number;
  ingredients: Ingredient[];
  sugarGPerL?: number;
  showSugar?: boolean;
}

export function DilutionControl({ 
  dilutionPercent, 
  onChange, 
  finalAbv,
  ingredients,
  sugarGPerL,
  showSugar
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

  const getAbvColorClass = () => {
    if (finalAbv >= 33) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (finalAbv >= 30) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      return 'bg-amber-200 text-amber-900 border-amber-400';
    }
  };

  const getSugarStyle = (sugar: number) => {
    if (sugar < 10) {
      return {
        colorClass: 'bg-amber-50 text-amber-800 border-amber-100',
        label: 'Dry'
      };
    } else if (sugar < 20) {
      return {
        colorClass: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Off-dry'
      };
    } else if (sugar < 40) {
      return {
        colorClass: 'bg-amber-200 text-amber-900 border-amber-300',
        label: 'Medium-dry'
      };
    } else if (sugar < 80) {
      return {
        colorClass: 'bg-amber-300 text-amber-900 border-amber-400',
        label: 'Medium-sweet'
      };
    } else if (sugar < 140) {
      return {
        colorClass: 'bg-amber-400 text-amber-950 border-amber-500',
        label: 'Sweet'
      };
    } else {
      return {
        colorClass: 'bg-amber-500 text-amber-950 border-amber-600',
        label: 'Luscious'
      };
    }
  };

  const showSugarBox = showSugar && sugarGPerL !== undefined && sugarGPerL > 0;
  const sugarStyle = showSugarBox ? getSugarStyle(sugarGPerL) : null;
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Droplet className="text-blue-700" size={20} />
          <h3 className="font-semibold text-blue-900">Batch Dilution Control</h3>
        </div>
        <span className="text-sm font-semibold text-slate-900">
          {dilutionPercent}% ({getWaterParts()})
        </span>
      </div>
      
      <div className="mb-3">
        
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

      <div className={showSugarBox ? "grid grid-cols-1 md:grid-cols-2 gap-3" : ""}>
        <div className={`py-2 px-3 rounded-lg border ${getAbvColorClass()} text-center`}>
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <div className="text-xs font-medium uppercase tracking-wide">Batch ABV</div>
            <div className="text-xl font-bold">{finalAbv.toFixed(1)}%</div>
          </div>
          {finalAbv >= 33 ? (
            <div className="text-xs">Optimal freezer range</div>
          ) : finalAbv >= 30 ? (
            <div className="text-xs">Could result in ice crystals</div>
          ) : (
            <div className="text-xs">May result in solid/slushy texture</div>
          )}
        </div>
        
        {showSugarBox && sugarStyle && (
          <div className={`py-2 px-3 rounded-lg border ${sugarStyle.colorClass} text-center`}>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <div className="text-xs font-medium uppercase tracking-wide">Batch Sugar</div>
              <div className="text-xl font-bold">{sugarGPerL.toFixed(0)} g/L</div>
            </div>
            <div className="text-xs">{sugarStyle.label}</div>
          </div>
        )}
      </div>
    </div>
  );
}
