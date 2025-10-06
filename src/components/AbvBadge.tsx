interface AbvBadgeProps {
  abv: number;
}

export function AbvBadge({ abv }: AbvBadgeProps) {
  const getColorClass = () => {
    if (abv >= 30) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className={`text-center py-6 rounded-lg border-2 ${getColorClass()}`}>
      <div className="text-sm font-medium uppercase tracking-wide mb-1">Final ABV</div>
      <div className="text-5xl font-bold">{abv.toFixed(1)}%</div>
      {abv >= 30 && (
        <div className="mt-2 text-sm">Optimal freezer range</div>
      )}
    </div>
  );
}
