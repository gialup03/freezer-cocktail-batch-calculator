import { useState, useRef, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { 
  INGREDIENT_TEMPLATES, 
  type IngredientTemplate
} from '../utils/ingredientTemplates';

interface TemplateSelectorProps {
  onSelect: (template: IngredientTemplate) => void;
  onAddCustom: (name: string) => void;
}

export function TemplateSelector({ onSelect, onAddCustom }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredTemplates = INGREDIENT_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (template: IngredientTemplate) => {
    onSelect(template);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleAddCustom = () => {
    onAddCustom(searchQuery);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} />
        Add Ingredient
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[500px] flex flex-col">
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ingredients..."
                className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Template List */}
          <div className="overflow-y-auto flex-1">
            {filteredTemplates.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-slate-500 mb-4">
                  No ingredients found{searchQuery && ` for "${searchQuery}"`}
                </p>
                <button
                  onClick={handleAddCustom}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  Add Custom Ingredient
                </button>
              </div>
            ) : (
              <div className="p-2">
                {filteredTemplates.map((template, index) => (
                  <button
                    key={`${template.name}-${index}`}
                    onClick={() => handleSelect(template)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900 group-hover:text-blue-600">
                        {template.name}
                      </div>
                      <div className="text-sm text-slate-500 ml-4">
                        {template.abv}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
