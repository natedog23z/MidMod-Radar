import React, { createContext, useContext, useReducer } from 'react';
import { HouseFilters } from '../lib/houseService';

// Define action types
type FilterAction =
  | { type: 'ADD_STYLE'; payload: string }
  | { type: 'REMOVE_STYLE'; payload: string }
  | { type: 'ADD_ARCHITECT'; payload: string }
  | { type: 'REMOVE_ARCHITECT'; payload: string }
  | { type: 'ADD_STATE'; payload: string }
  | { type: 'REMOVE_STATE'; payload: string }
  | { type: 'ADD_CITY'; payload: string }
  | { type: 'REMOVE_CITY'; payload: string }
  | { type: 'SET_YEAR_RANGE'; payload: { min?: number; max?: number } }
  | { type: 'SET_VALUATION_RANGE'; payload: { min?: number; max?: number } }
  | { type: 'CLEAR_FILTERS' };

// Define the filter state interface
export interface FilterState extends HouseFilters {
  styles: string[];
  architects: string[];
  states: string[];
  cities: string[];
  yearBuiltRange: {
    min?: number;
    max?: number;
  };
  valuationRange: {
    min?: number;
    max?: number;
  };
}

// Initial filter state
const initialFilterState: FilterState = {
  styles: [],
  architects: [],
  states: [],
  cities: [],
  yearBuiltRange: {},
  valuationRange: {},
};

// Create filter reducer function
const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'ADD_STYLE':
      return {
        ...state,
        styles: state.styles.includes(action.payload)
          ? state.styles
          : [...state.styles, action.payload],
      };
    case 'REMOVE_STYLE':
      return {
        ...state,
        styles: state.styles.filter((style) => style !== action.payload),
      };
    case 'ADD_ARCHITECT':
      return {
        ...state,
        architects: state.architects.includes(action.payload)
          ? state.architects
          : [...state.architects, action.payload],
      };
    case 'REMOVE_ARCHITECT':
      return {
        ...state,
        architects: state.architects.filter((architect) => architect !== action.payload),
      };
    case 'ADD_STATE':
      return {
        ...state,
        states: state.states.includes(action.payload)
          ? state.states
          : [...state.states, action.payload],
      };
    case 'REMOVE_STATE':
      return {
        ...state,
        states: state.states.filter((state) => state !== action.payload),
      };
    case 'ADD_CITY':
      return {
        ...state,
        cities: state.cities.includes(action.payload)
          ? state.cities
          : [...state.cities, action.payload],
      };
    case 'REMOVE_CITY':
      return {
        ...state,
        cities: state.cities.filter((city) => city !== action.payload),
      };
    case 'SET_YEAR_RANGE':
      return {
        ...state,
        yearBuiltRange: {
          ...state.yearBuiltRange,
          ...action.payload,
        },
      };
    case 'SET_VALUATION_RANGE':
      return {
        ...state,
        valuationRange: {
          ...state.valuationRange,
          ...action.payload,
        },
      };
    case 'CLEAR_FILTERS':
      return initialFilterState;
    default:
      return state;
  }
};

// Define the filter context interface
interface FilterContextType {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  activeFiltersCount: number;
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Create provider component
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  // Calculate the total number of active filters
  const activeFiltersCount =
    filters.styles.length +
    filters.architects.length +
    filters.states.length +
    filters.cities.length +
    (filters.yearBuiltRange.min !== undefined || filters.yearBuiltRange.max !== undefined ? 1 : 0) +
    (filters.valuationRange.min !== undefined || filters.valuationRange.max !== undefined ? 1 : 0);

  return (
    <FilterContext.Provider value={{ filters, dispatch, activeFiltersCount }}>
      {children}
    </FilterContext.Provider>
  );
};

// Create custom hook for using the filter context
export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}; 