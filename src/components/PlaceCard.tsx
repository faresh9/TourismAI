import { Place} from "../types/types.ts";
import { MapPin, Star, DollarSign } from 'lucide-react';

interface PlaceCardProps {
    place: Place;
    }

export function PlaceCard({place}: PlaceCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
      {place.photos[0] && (
        <img
          src={place.photos[0]}
          alt={place.name}
          className="h-48 w-full object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{place.name}</h3>
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <MapPin size={16} />
          <span>{place.address}</span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-gray-300">
            <Star size={16} className="text-yellow-400" />
            <span>{typeof place.rating === 'number' ? place.rating.toFixed(1) : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-300">
            <DollarSign size={16} className="text-green-400" />
            <span>{place.priceLevel}</span>
          </div>
        </div>
        <p className="text-gray-400">{place.description}</p>
      </div>
    </div>
  );
}

export default PlaceCard