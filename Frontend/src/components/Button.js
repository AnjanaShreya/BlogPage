import React from "react";

const Button = ({ onClick, title }) => {
  return (
    <button
      className="bg-[#002a32d5] text-white px-6 py-2 rounded-full hover:bg-[#002a32ed] transition-all duration-300"
      onClick={(e) => {
        onClick();
      }}
    >
      {title}
    </button>
  );
};

export default Button;
