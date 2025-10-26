export type PlaceCategory = 'secret' | 'restaurant' | 'art' | 'music' | 'hotel' | 'transport';

export interface Place {
  id: string;
  name: string;
  name_local?: string;
  coords: [number, number];
  category: PlaceCategory;
  emoji: string;
  description: string;
  price?: string;
  time?: string;
  address: string;
  distance_from_user?: string;
  why_recommended: string;
  source_url?: string;
  rating_local?: number;
  tags?: string[];
}

export interface Trip {
  id: string;
  city: string;
  country: string;
  start_date: string;
  end_date: string;
  current_location: [number, number];
  preferences: {
    budget: 'low' | 'medium' | 'high';
    interests: string[];
    avoid: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
