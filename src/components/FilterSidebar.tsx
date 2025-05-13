import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { 
  getAllArchitects, 
  getAllStyles, 
  getAllStates, 
  getAllCities 
} from '../lib/houseService';
import { Architect, Style } from '../lib/types';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface FilterSection {
  title: string;
  type: 'style' | 'architect' | 'state' | 'city';
  options: FilterOption[];
  loading: boolean;
}

export const FilterSidebar: React.FC = () => {
  const { filters, dispatch } = useFilters();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [filterSections, setFilterSections] = useState<FilterSection[]>([
    {
      title: 'Style',
      type: 'style',
      options: [],
      loading: true,
    },
    {
      title: 'Architect',
      type: 'architect',
      options: [],
      loading: true,
    },
    {
      title: 'State',
      type: 'state',
      options: [],
      loading: true,
    },
    {
      title: 'City',
      type: 'city',
      options: [],
      loading: true,
    },
  ]);
  
  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        // Load styles
        const styles = await getAllStyles();
        updateFilterSection('Style', styles.map(style => ({ 
          id: style.id, 
          name: style.name 
        })));
        
        // Load architects
        const architects = await getAllArchitects();
        updateFilterSection('Architect', architects.map(architect => ({ 
          id: architect.id, 
          name: architect.name 
        })));
        
        // Load states
        const states = await getAllStates();
        updateFilterSection('State', states.map(state => ({ 
          id: state.name, 
          name: state.name,
          count: state.count
        })));
        
        // Load cities
        const cities = await getAllCities();
        updateFilterSection('City', cities.map(city => ({ 
          id: city.key, 
          name: city.name,
          count: city.count
        })));
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    
    loadFilterOptions();
  }, []);
  
  const updateFilterSection = (title: string, options: FilterOption[]) => {
    setFilterSections(prev => 
      prev.map(section => 
        section.title === title 
          ? { ...section, options, loading: false } 
          : section
      )
    );
  };
  
  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((section) => section !== title)
        : [...prev, title],
    );
  };
  
  const handleCheckboxChange = (sectionType: string, optionId: string, checked: boolean) => {
    switch (sectionType) {
      case 'style':
        if (checked) {
          dispatch({ type: 'ADD_STYLE', payload: optionId });
        } else {
          dispatch({ type: 'REMOVE_STYLE', payload: optionId });
        }
        break;
      case 'architect':
        if (checked) {
          dispatch({ type: 'ADD_ARCHITECT', payload: optionId });
        } else {
          dispatch({ type: 'REMOVE_ARCHITECT', payload: optionId });
        }
        break;
      case 'state':
        if (checked) {
          dispatch({ type: 'ADD_STATE', payload: optionId });
        } else {
          dispatch({ type: 'REMOVE_STATE', payload: optionId });
        }
        break;
      case 'city':
        if (checked) {
          dispatch({ type: 'ADD_CITY', payload: optionId });
        } else {
          dispatch({ type: 'REMOVE_CITY', payload: optionId });
        }
        break;
      default:
        break;
    }
  };
  
  const handleYearRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    dispatch({ 
      type: 'SET_YEAR_RANGE', 
      payload: { [field]: numValue } 
    });
  };
  
  const handleValuationRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    dispatch({ 
      type: 'SET_VALUATION_RANGE', 
      payload: { [field]: numValue } 
    });
  };
  
  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };
  
  const handleRemoveFilter = (type: string, id: string) => {
    switch (type) {
      case 'style':
        dispatch({ type: 'REMOVE_STYLE', payload: id });
        break;
      case 'architect':
        dispatch({ type: 'REMOVE_ARCHITECT', payload: id });
        break;
      case 'state':
        dispatch({ type: 'REMOVE_STATE', payload: id });
        break;
      case 'city':
        dispatch({ type: 'REMOVE_CITY', payload: id });
        break;
      default:
        break;
    }
  };
  
  // Get active filter names for display
  const getActiveFilterName = (type: string, id: string): string => {
    const section = filterSections.find(s => s.type === type);
    if (!section) return id;
    
    const option = section.options.find(o => o.id === id);
    return option ? option.name : id;
  };
  
  // Collect all active filters
  const activeFilters = [
    ...filters.styles.map(id => ({ type: 'style', id, name: getActiveFilterName('style', id) })),
    ...filters.architects.map(id => ({ type: 'architect', id, name: getActiveFilterName('architect', id) })),
    ...filters.states.map(id => ({ type: 'state', id, name: getActiveFilterName('state', id) })),
    ...filters.cities.map(id => ({ type: 'city', id, name: getActiveFilterName('city', id) }))
  ];
  
  return (
    <aside className="w-full lg:w-72 bg-white rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Filters</h2>
        <button 
          className="text-sm text-gray-600 hover:underline"
          onClick={handleClearFilters}
        >
          Clear all
        </button>
      </div>
      
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map(filter => (
            <button 
              key={`${filter.type}-${filter.id}`}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
              onClick={() => handleRemoveFilter(filter.type, filter.id)}
            >
              {filter.name} <X className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}
      
      {/* Filter Sections */}
      {filterSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="font-medium mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              section.options
                .slice(0, expandedSections.includes(section.title) ? undefined : 4)
                .map((option) => (
                  <label key={option.id} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={
                        section.type === 'style' ? filters.styles.includes(option.id) :
                        section.type === 'architect' ? filters.architects.includes(option.id) :
                        section.type === 'state' ? filters.states.includes(option.id) :
                        filters.cities.includes(option.id)
                      }
                      onChange={(e) => handleCheckboxChange(section.type, option.id, e.target.checked)}
                    />
                    <span className="text-sm">
                      {option.name}
                      {option.count !== undefined && (
                        <span className="text-gray-500 text-xs ml-1">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))
            )}
          </div>
          {section.options.length > 4 && (
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center gap-1 text-sm text-gray-600 mt-2 hover:text-gray-900"
            >
              {expandedSections.includes(section.title) ? (
                <>
                  See less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  See more ({section.options.length - 4}){' '}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      ))}
      
      {/* Range Filters */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Year Built</h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="From"
            className="w-full border rounded-lg px-3 py-2"
            value={filters.yearBuiltRange.min || ''}
            onChange={(e) => handleYearRangeChange('min', e.target.value)}
          />
          <input
            type="number"
            placeholder="To"
            className="w-full border rounded-lg px-3 py-2"
            value={filters.yearBuiltRange.max || ''}
            onChange={(e) => handleYearRangeChange('max', e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Valuation</h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min"
            className="w-full border rounded-lg px-3 py-2"
            value={filters.valuationRange.min || ''}
            onChange={(e) => handleValuationRangeChange('min', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full border rounded-lg px-3 py-2"
            value={filters.valuationRange.max || ''}
            onChange={(e) => handleValuationRangeChange('max', e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}; 