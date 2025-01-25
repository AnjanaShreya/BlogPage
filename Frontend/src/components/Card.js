import React from 'react';

const Card = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-5 w-80 shadow-md font-sans text-gray-800 m-5">
      <div className="mb-3">
        <h4 className="text-lg font-semibold">Jessie Holmes</h4>
        <p className="text-sm text-gray-500">29 Jul 2010 • Solutions Architecture</p>
      </div>
      <h2 className="text-xl font-bold my-4">
        Token-based Authentication with JMeter
      </h2>
      <p className="text-blue-500 font-semibold underline cursor-pointer">
        Start reading
      </p>
    </div>
  );
};

export default Card;
