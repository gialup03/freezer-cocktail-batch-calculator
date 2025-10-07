import type { ServingStyle } from '../types';
import { useState } from 'react';
// FontAwesome icons - using only confirmed exports
import { FaCocktail, FaGlassMartiniAlt, FaGlassWhiskey, FaWineGlass, FaGlassCheers } from 'react-icons/fa';
// FontAwesome 6 icons
import { FaBeerMugEmpty } from 'react-icons/fa6';
// Material Design icons
import { MdLocalBar, MdLocalDrink } from 'react-icons/md';
// Ionicons
import { IoBeer, IoWine } from 'react-icons/io5';

interface ServingStyleSelectorProps {
  value: ServingStyle;
  onChange: (style: ServingStyle) => void;
}

// Icon options for each serving style
const iconOptions = {
  up: [
    { name: 'Martini Glass Alt', icon: <FaGlassMartiniAlt size={18} /> },
    { name: 'Cocktail', icon: <FaCocktail size={18} /> },
    { name: 'Wine Glass', icon: <FaWineGlass size={18} /> },
    { name: 'Local Bar', icon: <MdLocalBar size={18} /> }
  ],
  rocks: [
    { name: 'Whiskey Glass', icon: <FaGlassWhiskey size={18} /> },
    { name: 'Cocktail Alt', icon: <FaCocktail size={18} /> },
    { name: 'Local Drink', icon: <MdLocalDrink size={18} /> },
    { name: 'Cheers', icon: <FaGlassCheers size={18} /> }
  ],
  crushed: [
    { name: 'Beer Mug Empty', icon: <FaBeerMugEmpty size={18} /> },
    { name: 'Beer/Tall', icon: <IoBeer size={18} /> },
    { name: 'Wine', icon: <IoWine size={18} /> },
    { name: 'Wine Glass Alt', icon: <FaWineGlass size={18} /> }
  ]
};

export function ServingStyleSelector({ value, onChange }: ServingStyleSelectorProps) {
  // Store selected icon index for each style (default to 0)
  const [selectedIcons] = useState({ up: 0, rocks: 0, crushed: 0 });

  const options: { value: ServingStyle; label: string; icon: React.ReactNode }[] = [
    { value: 'up', label: 'Up / Neat', icon: iconOptions.up[selectedIcons.up].icon },
    { value: 'rocks', label: 'On the Rocks', icon: iconOptions.rocks[selectedIcons.rocks].icon },
    { value: 'crushed', label: 'Crushed Ice', icon: iconOptions.crushed[selectedIcons.crushed].icon }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Serving Style
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
              ${value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }
            `}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
