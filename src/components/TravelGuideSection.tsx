import React from 'react';
import { Lightbulb, Clock, Info } from 'lucide-react';
import type { TravelGuide } from '../types/types.ts';

interface TravelGuideSectionProps {
  guide: TravelGuide;
}

export function TravelGuideSection({ guide }: TravelGuideSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Your Travel Guide</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-yellow-500" />
            <h3 className="text-xl font-semibold">Highlights</h3>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {guide.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="text-blue-500" />
            <h3 className="text-xl font-semibold">Travel Tips</h3>
          </div>
          <ul className="list-disc list-inside space-y-2">
            {guide.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="text-green-500" />
            <h3 className="text-xl font-semibold">Best Time to Visit</h3>
          </div>
          <p>{guide.bestTimeToVisit}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Custom Recommendations</h3>
          <p>{guide.customRecommendations}</p>
        </div>
      </div>
    </div>
  );
}