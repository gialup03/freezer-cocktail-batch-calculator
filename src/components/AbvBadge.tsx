interface AbvBadgeProps {
  abv: number;
  sugarGPerL?: number;
  showSugar?: boolean;
}

export function AbvBadge({ abv, sugarGPerL, showSugar }: AbvBadgeProps) {
  const getMessageStyle = () => {
    if (abv >= 33) {
      return {
        colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        message: 'Optimal for freezing'
      };
    } else if (abv >= 30) {
      return {
        colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
        message: 'Could result in ice crystals forming if frozen based on freezer temperatures'
      };
    } else {
      return {
        colorClass: 'bg-amber-200 text-amber-900 border-amber-400',
        message: 'May result in solid/slushy texture if frozen unless sugar content and/or freezer temperatures are high'
      };
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
  const messageStyle = getMessageStyle();

  return (
    <div className={showSugarBox ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
      <div className="flex flex-col justify-center text-center py-6 rounded-lg border-2 bg-slate-50 text-slate-700 border-slate-200">
        <div className="text-sm font-medium uppercase tracking-wide mb-1">Batch ABV</div>
        <div className="text-5xl font-bold mb-3">{abv.toFixed(1)}%</div>
        <div className={`mx-4 px-3 py-2 rounded-md border text-sm ${messageStyle.colorClass}`}>
          {messageStyle.message}
        </div>
      </div>
      
      {showSugarBox && sugarStyle && (
        <div className={`flex flex-col justify-center text-center py-6 rounded-lg border-2 ${sugarStyle.colorClass}`}>
          <div className="text-sm font-medium uppercase tracking-wide mb-1">Batch Sugar Concentration</div>
          <div className="text-5xl font-bold mb-2">{sugarGPerL.toFixed(0)} g/L</div>
          <div className="text-sm">{sugarStyle.label}</div>
        </div>
      )}
    </div>
  );
}
