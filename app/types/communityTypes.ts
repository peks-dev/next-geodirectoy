export interface CourtId {
  id: string;
}
export type CommunityType = 'pickup' | 'club';

export type FloorType = 'cement' | 'parquet' | 'asphalt' | 'synthetic';

export type AgeGroup = 'teens' | 'young_adults' | 'veterans' | 'mixed';

export type Gender = 'male' | 'female' | 'mixed';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Service {
  transport: boolean;
  store: boolean;
  wifi: boolean;
  bathroom: boolean;
}

export interface Schedule {
  days: string[]; // Array de días en inglés, e.g., ["monday", "tuesday"]
  time: {
    start: string; // e.g., "18:00"
    end: string; // e.g., "20:00"
  };
}
export interface Category {
  category: string;
  min_age: number;
  max_age: number | null;
  genders: Gender[];
}
export interface communityData {
  type: CommunityType | null;
  name: string;
  description: string;
  location: Coordinates | null;
  images: (File | string)[]; // URLs after upload
  floor_type: FloorType | null;
  is_covered: boolean;
  schedule: Schedule[];
  services: Service;
  age_group: AgeGroup | null;
  categories: Category[] | null;
}
