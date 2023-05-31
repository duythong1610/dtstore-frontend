import React from "react";
import logo from "../../assets/img/logo.png";

const FallBackComponent = () => {
  return (
    <div className="bg-white w-screen h-screen flex items-center justify-center">
      <div>
        <div className="mb-5">
          <img
            src={logo}
            alt="fallback"
            className="w-24 md:w-44 animate-pulse"
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse bg-purple-600"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse bg-purple-600"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse bg-purple-600"></div>
        </div>
      </div>
    </div>
  );
};

export default FallBackComponent;
