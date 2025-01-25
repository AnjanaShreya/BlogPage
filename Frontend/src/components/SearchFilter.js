import React from 'react';
import searchIcon from '../assets/serach.svg';

const SearchBar = ({ searchQuery, handleSearch }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto my-4">
      {/* Search Icon */}
      <span className="absolute inset-y-0 left-3 flex items-center">
        <img src={searchIcon} alt="Search Icon" className="w-5 h-5 text-gray-400" />
      </span>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700"
      />
    </div>
  );
};

export default SearchBar;
