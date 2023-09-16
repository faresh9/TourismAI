import React from 'react';

function Header() {
  return (
    <header className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Logo and Site Title */}
          <div className="flex items-center mb-4 lg:mb-0">
            <img
              src="https://img.icons8.com/dusk/64/ghost--v1.png"
              alt="Your Logo"
              className="h-10 w-10 rounded-full mr-2"
            />
            <h1 className="text-3xl font-extrabold">Your Tourism App</h1>
          </div>

          {/* Navigation Links */}
          <nav className="mb-4 lg:mb-0">
            <ul className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6 text-lg font-medium">
              <li><a href="#" className="hover:text-blue-200">Home</a></li>
              <li><a href="#" className="hover:text-blue-200">Destinations</a></li>
              <li><a href="#" className="hover:text-blue-200">Events</a></li>
              <li><a href="#" className="hover:text-blue-200">Restaurants</a></li>
              {/* Add more navigation links as needed */}
            </ul>
          </nav>

          {/* Search Bar (Optional) */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search for a destination"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
