import { Droplet } from 'lucide-react';

interface DilutionSuggestionProps {
  suggestion: {
    needsDilution: boolean;
    waterMl?: number;
    targetAbv?: number;
  };
  onApplyDilution?: () => void;
}

export function DilutionSuggestion({ suggestion, onApplyDilution }: DilutionSuggestionProps) {
  if (!suggestion.needsDilution) {
    return null;
  }

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Droplet className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">Dilution Recommendation</h3>
          <p className="text-blue-800 mb-3">
            Add <strong>{suggestion.waterMl} mL</strong> of water to reach approximately <strong>{suggestion.targetAbv}% ABV</strong> (optimal freezer range: 30-33%)
          </p>
          {onApplyDilution && (
            <button
              onClick={onApplyDilution}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Add Water to Recipe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
