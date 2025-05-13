export interface House {
  id: string;
  street: string;
  street_std: string;
  city: string;
  city_std: string;
  state: string;
  zip: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lot_acres: number | null;
  year_built: number | null;
  estimated_value: number | null;
  architect_id: string | null;
  architect_verified: boolean | null;
  description_text: string | null;
  featured_photo_url: string | null;
  address_canonical: string | null;
  slug: string | null;
  
  // Relations (optional for flexibility)
  architect?: Architect;
  photos?: HousePhoto[];
  styles?: HouseStyle[];
  features?: HouseFeature[];
  materials?: HouseMaterial[];
  techniques?: HouseTechnique[];
}

export interface Architect {
  id: string;
  name: string;
  birth_year: number | null;
  death_year: number | null;
  bio: string | null;
  wikipedia_url: string | null;
}

export interface Style {
  id: string;
  name: string;
  description: string | null;
  years_active: string | null;
  region: string | null;
}

export interface Feature {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
}

export interface Material {
  id: string;
  name: string;
  description: string | null;
}

export interface Technique {
  id: string;
  name: string;
  description: string | null;
}

export interface HousePhoto {
  id: string;
  house_id: string;
  photo_url: string;
  storage_key: string | null;
  is_featured: boolean | null;
  vision_tags: any[] | null;
}

export interface HouseStyle {
  house_id: string;
  style_id: string;
  confidence: number | null;
  style?: Style;
}

export interface HouseFeature {
  house_id: string;
  feature_id: string;
  confidence: number | null;
  feature?: Feature;
}

export interface HouseMaterial {
  house_id: string;
  material_id: string;
  confidence: number | null;
  material?: Material;
}

export interface HouseTechnique {
  house_id: string;
  technique_id: string;
  confidence: number | null;
  technique?: Technique;
} 