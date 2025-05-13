import { supabase } from './supabase';
import { House, HousePhoto, Architect, Style } from './types';

/**
 * Fetches all houses from the database
 */
export async function getHouses() {
  const { data, error } = await supabase
    .from('houses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching houses:', error);
    throw error;
  }
  
  return data as House[];
}

/**
 * Fetches houses with filters
 */
export interface HouseFilters {
  styles?: string[];
  architects?: string[];
  states?: string[];
  cities?: string[];
  yearBuiltRange?: {
    min?: number;
    max?: number;
  };
  valuationRange?: {
    min?: number;
    max?: number;
  };
}

export async function getFilteredHouses(filters?: HouseFilters) {
  // Start with a basic query
  let query = supabase
    .from('houses')
    .select(`
      *,
      architect:architect_id(*),
      house_styles!inner(
        style_id,
        style:style_id(*)
      )
    `)
    .eq('is_valid', true);
  
  // Apply filters if provided
  if (filters) {
    // Filter by architects
    if (filters.architects && filters.architects.length > 0) {
      query = query.in('architect_id', filters.architects);
    }
    
    // Filter by states
    if (filters.states && filters.states.length > 0) {
      query = query.in('state', filters.states);
    }
    
    // Filter by cities
    if (filters.cities && filters.cities.length > 0) {
      query = query.in('city_std', filters.cities);
    }
    
    // Filter by year built range
    if (filters.yearBuiltRange) {
      if (filters.yearBuiltRange.min !== undefined) {
        query = query.gte('year_built', filters.yearBuiltRange.min);
      }
      if (filters.yearBuiltRange.max !== undefined) {
        query = query.lte('year_built', filters.yearBuiltRange.max);
      }
    }
    
    // Filter by valuation range
    if (filters.valuationRange) {
      if (filters.valuationRange.min !== undefined) {
        query = query.gte('estimated_value', filters.valuationRange.min);
      }
      if (filters.valuationRange.max !== undefined) {
        query = query.lte('estimated_value', filters.valuationRange.max);
      }
    }
    
    // Filter by styles
    if (filters.styles && filters.styles.length > 0) {
      query = query.in('house_styles.style_id', filters.styles);
    }
  }
  
  // Execute the query
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching filtered houses:', error);
    throw error;
  }
  
  // Format the houses to match the House interface
  const houses: House[] = data.map((house: any) => {
    const styles = house.house_styles.map((styleRel: any) => ({
      house_id: house.id,
      style_id: styleRel.style_id,
      style: styleRel.style
    }));
    
    return {
      ...house,
      styles
    };
  });
  
  return houses;
}

/**
 * Fetches all architects for filter options
 */
export async function getAllArchitects() {
  // First get all houses with their architect IDs
  const { data: houses, error: housesError } = await supabase
    .from('houses')
    .select('architect_id')
    .eq('is_valid', true)
    .not('architect_id', 'is', null);
  
  if (housesError) {
    console.error('Error fetching houses for architect counts:', housesError);
    throw housesError;
  }
  
  // Count occurrences of each architect
  const architectCounts: Record<string, number> = {};
  houses.forEach((house) => {
    const architectId = house.architect_id;
    if (architectId) {
      architectCounts[architectId] = (architectCounts[architectId] || 0) + 1;
    }
  });
  
  // Get architect details
  const { data: architects, error: architectsError } = await supabase
    .from('architects')
    .select('*')
    .order('name', { ascending: true });
  
  if (architectsError) {
    console.error('Error fetching architects:', architectsError);
    throw architectsError;
  }
  
  // Add counts to architect data
  return architects.map((architect) => ({
    ...architect,
    count: architectCounts[architect.id] || 0
  }));
}

/**
 * Fetches all styles for filter options
 */
export async function getAllStyles() {
  // First we need to get all house_styles relations to count occurrences
  const { data: houseStyles, error: houseStylesError } = await supabase
    .from('house_styles')
    .select('style_id, house_id');
  
  if (houseStylesError) {
    console.error('Error fetching house_styles for style counts:', houseStylesError);
    throw houseStylesError;
  }
  
  // Count occurrences of each style
  const styleCounts: Record<string, number> = {};
  houseStyles.forEach((relation) => {
    const styleId = relation.style_id;
    styleCounts[styleId] = (styleCounts[styleId] || 0) + 1;
  });
  
  // Get style details
  const { data: styles, error: stylesError } = await supabase
    .from('styles')
    .select('*')
    .order('name', { ascending: true });
  
  if (stylesError) {
    console.error('Error fetching styles:', stylesError);
    throw stylesError;
  }
  
  // Add counts to style data
  return styles.map((style) => ({
    ...style,
    count: styleCounts[style.id] || 0
  }));
}

/**
 * Fetches all unique states with house counts
 */
export async function getAllStates() {
  const { data, error } = await supabase
    .from('houses')
    .select('state')
    .eq('is_valid', true);
  
  if (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
  
  // Count and deduplicate states
  const stateCounts: Record<string, number> = {};
  data.forEach((house) => {
    const state = house.state;
    stateCounts[state] = (stateCounts[state] || 0) + 1;
  });
  
  // Format the result
  return Object.entries(stateCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetches all unique cities with house counts
 */
export async function getAllCities() {
  const { data, error } = await supabase
    .from('houses')
    .select('city_std, city')
    .eq('is_valid', true);
  
  if (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
  
  // Count and deduplicate cities
  const cityCounts: Record<string, {count: number, displayName: string}> = {};
  data.forEach((house) => {
    const cityKey = house.city_std;
    const displayName = house.city;
    
    if (!cityCounts[cityKey]) {
      cityCounts[cityKey] = {count: 1, displayName};
    } else {
      cityCounts[cityKey].count++;
    }
  });
  
  // Format the result
  return Object.entries(cityCounts)
    .map(([key, {count, displayName}]) => ({ key, name: displayName, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetches a single house by ID with all its relations (architect, photos, styles, etc)
 */
export async function getHouseById(id: string) {
  // Get the house details
  const { data: house, error: houseError } = await supabase
    .from('houses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (houseError) {
    console.error('Error fetching house:', houseError);
    throw houseError;
  }

  // Get the architect if available
  let architect = null;
  if (house.architect_id) {
    const { data: architectData, error: architectError } = await supabase
      .from('architects')
      .select('*')
      .eq('id', house.architect_id)
      .single();
    
    if (!architectError) {
      architect = architectData;
    }
  }

  // Get house photos
  const { data: photos, error: photosError } = await supabase
    .from('house_photos')
    .select('*')
    .eq('house_id', id);
  
  if (photosError) {
    console.error('Error fetching house photos:', photosError);
  }

  // Get house styles with style details
  const { data: styleRelations, error: stylesError } = await supabase
    .from('house_styles')
    .select(`
      *,
      style:style_id(*)
    `)
    .eq('house_id', id);
  
  if (stylesError) {
    console.error('Error fetching house styles:', stylesError);
  }

  // Format the result with all relations
  const result: House = {
    ...house,
    architect: architect as Architect,
    photos: (photos || []) as HousePhoto[],
    styles: styleRelations || []
  };

  return result;
}

/**
 * Fetches a single house by SLUG with all its relations (architect, photos, styles, etc)
 */
export async function getHouseBySlug(slug: string): Promise<House | null> {
  // Get the house details by slug
  const { data: house, error: houseError } = await supabase
    .from('houses')
    .select('*') // Select all columns from the house itself
    .eq('slug', slug)
    .single();
  
  if (houseError) {
    if (houseError.code === 'PGRST116') { // PGRST116: "Searched item was not found"
      console.warn(`House with slug "${slug}" not found.`);
      return null; // Return null if house not found
    }
    console.error('Error fetching house by slug:', houseError);
    throw houseError;
  }

  if (!house) { // Should be redundant due to PGRST116 handling, but good practice
    console.warn(`House with slug "${slug}" not found (no data).`);
    return null;
  }

  // Get the architect if available
  let architect = null;
  if (house.architect_id) {
    const { data: architectData, error: architectError } = await supabase
      .from('architects')
      .select('*')
      .eq('id', house.architect_id)
      .single();
    
    if (architectError && architectError.code !== 'PGRST116') {
      console.error('Error fetching architect for house:', architectError);
      // Decide if you want to throw or just skip architect
    } else if (architectData) {
      architect = architectData;
    }
  }

  // Get house photos
  const { data: photos, error: photosError } = await supabase
    .from('house_photos')
    .select('*')
    .eq('house_id', house.id);
  
  if (photosError) {
    console.error('Error fetching house photos:', photosError);
    // Decide if you want to throw or just skip photos
  }

  // Get house styles with style details
  const { data: styleRelations, error: stylesError } = await supabase
    .from('house_styles')
    .select(`
      *,
      style:style_id(*)
    `)
    .eq('house_id', house.id);
  
  if (stylesError) {
    console.error('Error fetching house styles:', stylesError);
    // Decide if you want to throw or just skip styles
  }

  // Format the result with all relations
  const result: House = {
    ...house,
    architect: architect as Architect | null, // Allow architect to be null
    photos: (photos || []) as HousePhoto[],
    styles: styleRelations || []
  };

  return result;
}

/**
 * Fetches the featured house to display on the homepage
 * In a real app, this might be determined by certain criteria
 * For now, we'll just get the most recently added house
 */
export async function getFeaturedHouse() {
  const { data, error } = await supabase
    .from('houses')
    .select(`
      *,
      architect:architect_id(*)
    `)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    console.error('Error fetching featured house:', error);
    throw error;
  }
  
  // Get house photos
  const { data: photos, error: photosError } = await supabase
    .from('house_photos')
    .select('*')
    .eq('house_id', data.id);
  
  if (photosError) {
    console.error('Error fetching house photos:', photosError);
  }
  
  // Get house styles
  const { data: styleRelations, error: stylesError } = await supabase
    .from('house_styles')
    .select(`
      *,
      style:style_id(*)
    `)
    .eq('house_id', data.id);
  
  if (stylesError) {
    console.error('Error fetching house styles:', stylesError);
  }
  
  // Format the result with all relations
  const result: House = {
    ...data,
    photos: (photos || []) as HousePhoto[],
    styles: styleRelations || []
  };
  
  return result;
} 