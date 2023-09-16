import React, { useState } from 'react';

function ContentInput({ onGenerateContent }) {
  // State to track user input
  const [destination, setDestination] = useState('');

  // Function to handle input changes
  const handleInputChange = (event) => {
    setDestination(event.target.value);
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
          onChange={handleInputChange}
        />
        <button
          onClick={() => onGenerateContent(destination)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Generate
        </button>
      </div>
    </div>
  );
}

export default ContentInput;
