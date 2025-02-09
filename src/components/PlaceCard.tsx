import { Place} from "../types/types.ts";
import { MapPin, Star, DollarSign } from 'lucide-react';

interface PlaceCardProps {
    place: Place;
    }

export function PlaceCard({place}: PlaceCardProps) {
  return (
    <div className = 'bg-white rounded-lg shadow-lg overflow-hidden'>
        {place.photos[0] && (
            <img
            src={place.photos[0]}
            alt={place.name}
            className='h-48 w-full object-cover'
            />
        )}
        <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{place.name}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={16} />
          <span>{place.address}</span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            <span>{place.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-green-500" />
            <span>{place.priceLevel}</span>
          </div>
        </div>
        <p className="text-gray-600">{place.description}</p>
      </div>
    </div>
  )
}

export default PlaceCard