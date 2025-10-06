interface BatchConfigProps {
  batchSizeMl: number;
  onChange: (batchSizeMl: number) => void;
}

export function BatchConfig({ batchSizeMl, onChange }: BatchConfigProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">Batch Configuration</h2>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Batch Size (mL)
        </label>
        <input
          type="number"
          min="0"
          step="10"
          value={batchSizeMl}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg"
          placeholder="e.g., 750"
        />
        <p className="mt-2 text-sm text-slate-500">
          Enter the total volume you want to make in milliliters
        </p>
      </div>
    </div>
  );
}
