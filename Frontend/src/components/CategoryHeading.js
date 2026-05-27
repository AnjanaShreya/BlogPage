import React from "react";
import img2 from "../assets/img2.jpg";

const CategoryHeading = ({ title, category, date, description }) => {
  return (
    <div className="relative overflow-hidden">
      <img src={img2} alt="Hero" className="w-full h-64 object-cover" />

      {/* Overlay with Centered Text */}
      <div className="absolute inset-0 bg-black bg-opacity-50 font-serif">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 ml-28">
          <p className="text-white text-4xl font-semibold">{title}</p>
          {description && (
            <p className="text-white font-serif text-lg md:text-base mt-2 max-w-xl opacity-90 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryHeading;
