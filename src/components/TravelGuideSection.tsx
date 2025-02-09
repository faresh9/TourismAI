import { Lightbulb, Clock, Info } from 'lucide-react';
import type { TravelGuide } from '../types/types.ts';

interface TravelGuideSectionProps {
  guide: TravelGuide;
}

export function TravelGuideSection({ guide }: TravelGuideSectionProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Travel Guide</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">Highlights</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {guide.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="text-blue-500" />
            <h3 className="text-xl font-semibold text-white">Travel Tips</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {guide.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="text-green-500" />
            <h3 className="text-xl font-semibold text-white">Best Time to Visit</h3>
          </div>
          <p className="text-gray-300">{guide.bestTimeToVisit}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">Custom Recommendations</h3>
          <p className="text-gray-300">{guide.customRecommendations}</p>
        </div>
      </div>
    </div>
  );
}