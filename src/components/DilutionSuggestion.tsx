import { Droplet } from 'lucide-react';

interface DilutionSuggestionProps {
  suggestion: {
    needsDilution: boolean;
    waterMl?: number;
    targetAbv?: number;
  };
}

export function DilutionSuggestion({ suggestion }: DilutionSuggestionProps) {
  if (!suggestion.needsDilution) {
    return null;
  }

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Droplet className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Dilution Recommendation</h3>
          <p className="text-blue-800">
            Add <strong>{suggestion.waterMl} mL</strong> of water to reach approximately <strong>{suggestion.targetAbv}% ABV</strong> (optimal freezer range: 30-33%)
          </p>
        </div>
      </div>
    </div>
  );
}
