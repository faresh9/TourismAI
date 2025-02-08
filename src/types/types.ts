export interface Place {
    id: string;
    name: string;
    description: string;
    rating: number;
    photos: string[];
    address: string;
    priceLevel: string;
    category: string;
  }
  
  export interface TravelGuide {
    highlights: string[];
    tips: string[];
    bestTimeToVisit: string;
    customRecommendations: string;
  }
  
  export interface SearchResult {
    places: Place[];
    guide: TravelGuide;
  }