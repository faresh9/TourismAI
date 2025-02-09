import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch(destination.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter a destination (e.g., Paris, France)"
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-blue-500 focus:outline-none focus:border-blue-600 pr-16 text-red-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-amber-50 p-3 rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
}