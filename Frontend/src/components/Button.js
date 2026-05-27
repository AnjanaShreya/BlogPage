import React from "react";

const Button = ({ onClick, title }) => {
  return (
    <button
      className="bg-[#002a32] text-white px-6 py-2.5 rounded font-sans font-semibold text-sm hover:bg-[#001a1f] transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95"
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
    >
      {title}
    </button>
  );
};

export default Button;
