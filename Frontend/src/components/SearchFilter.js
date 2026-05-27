import React from 'react';
import searchIcon from '../assets/serach.svg';

const SearchFilter = ({ searchQuery, handleSearch }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto my-8 px-4 md:px-0">
      <div className="w-full relative shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-full group focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-150 transition-all bg-white">
        {/* Search Icon */}
        <span className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center text-gray-400">
          <img src={searchIcon} alt="Search Icon" className="w-5 h-5 opacity-60" />
        </span>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Heading, Keyword, or Author..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-400 font-sans text-sm focus:outline-none border-none transition-colors"
        />
      </div>
    </div>
  );
};

export default SearchFilter;
