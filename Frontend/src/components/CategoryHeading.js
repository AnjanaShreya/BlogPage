import React from "react";
import img2 from "../assets/img2.jpg";

const CategoryHeading = ({ title, category, date }) => {
  return (
    <div className="relative overflow-hidden">
      <img src={img2} alt="Hero" className="w-full h-72 object-cover" />

      {/* Overlay with Centered Text */}
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 ml-28">
          <p className="text-white text-3xl font-bold">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeading;
