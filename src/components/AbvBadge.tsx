interface AbvBadgeProps {
  abv: number;
  sugarGPerL?: number;
  showSugar?: boolean;
}

export function AbvBadge({ abv, sugarGPerL, showSugar }: AbvBadgeProps) {
  const getColorClass = () => {
    if (abv >= 33) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (abv >= 30) {
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
    <div className={showSugarBox ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
      <div className={`text-center py-6 rounded-lg border-2 ${getColorClass()}`}>
        <div className="text-sm font-medium uppercase tracking-wide mb-1">Batch ABV</div>
        <div className="text-5xl font-bold">{abv.toFixed(1)}%</div>
        {abv >= 33 ? (
          <div className="mt-2 text-sm">Optimal freezer range</div>
        ) : abv >= 30 ? (
          <div className="mt-2 text-sm">Could result in ice crystals forming based on freezer temperatures</div>
        ) : (
          <div className="mt-2 text-sm">May result in solid/slushy texture unless sugar content and/or freezer temperatures are high.</div>
        )}
      </div>
      
      {showSugarBox && sugarStyle && (
        <div className={`text-center py-6 rounded-lg border-2 ${sugarStyle.colorClass}`}>
          <div className="text-sm font-medium uppercase tracking-wide mb-1">Batch Sugar Concentration</div>
          <div className="text-5xl font-bold">{sugarGPerL.toFixed(0)} g/L</div>
          <div className="mt-2 text-sm">{sugarStyle.label}</div>
        </div>
      )}
    </div>
  );
}
