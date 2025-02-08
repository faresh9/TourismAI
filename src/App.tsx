import { useState } from 'react';
import { Compass } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { PlaceCard } from './components/PlaceCard';
import { TravelGuideSection } from './components/TravelGuideSection';
import { searchPlaces, getPlaceDetails } from './services/tripAdvisor';
import { selectBestPlaces, generateTravelGuide } from './services/llama';
import type {SearchResult} from './types/types.ts';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = async (destination: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Step 1: Search places on TripAdvisor (basic info)
      const searchResults = await searchPlaces(destination);
      
      // Step 2: Get best place IDs using Llama
      const selectedIds = await selectBestPlaces(searchResults);
      
      // Step 3: Fetch detailed information for selected places
      const placeDetailsPromises = selectedIds.map(id => getPlaceDetails(id));
      const selectedPlaces = await Promise.all(placeDetailsPromises);
      
      // Step 4: Generate travel guide using Llama with detailed place information
      const guide = await generateTravelGuide(selectedPlaces);
      
      setResult({ places: selectedPlaces, guide });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass size={48} className="text-blue-500" />
            <h1 className="text-4xl font-bold">Travel Guide AI</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Discover the perfect destinations with AI-powered recommendations
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding the best places for you...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-12">
            <TravelGuideSection guide={result.guide} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {result.places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App