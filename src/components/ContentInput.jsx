import React, { useState } from 'react';

function ContentInput({ onGenerateContent }) {
  // State to track user input
  const [destination, setDestination] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');

  // Function to handle input changes
  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold">Find Information About Your Destination</h2>
      <div className="flex items-center space-x-4 mt-4">
        <input
          type="text"
          placeholder="Enter a destination"
          className="px-3 py-2 border rounded-lg flex-grow focus:outline-none focus:ring focus:ring-blue-300"
          value={destination}
          onChange={handleDestinationChange}
        />
        <select
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedPlace}
          onChange={handlePlaceChange}
        >
          <option value="">Select a place</option>
          <option value="cafe">Cafe</option>
          <option value="grocery store">Grocery Store</option>
          <option value="tourist attractions">Tourist Attractions</option>
          {/* Add more options as needed */}
        </select>
        <button
          onClick={() => onGenerateContent(destination, selectedPlace)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Generate
        </button>
      </div>
    </div>
  );
}

export default ContentInput;
