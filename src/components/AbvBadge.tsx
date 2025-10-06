interface AbvBadgeProps {
  abv: number;
}

export function AbvBadge({ abv }: AbvBadgeProps) {
  const getColorClass = () => {
    if (abv >= 30 && abv <= 33) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if ((abv >= 25 && abv < 30) || (abv > 33 && abv <= 40)) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className={`text-center py-6 rounded-lg border-2 ${getColorClass()}`}>
      <div className="text-sm font-medium uppercase tracking-wide mb-1">Final ABV</div>
      <div className="text-5xl font-bold">{abv.toFixed(1)}%</div>
      {abv >= 30 && abv <= 33 && (
        <div className="mt-2 text-sm">Optimal freezer range</div>
      )}
    </div>
  );
}
