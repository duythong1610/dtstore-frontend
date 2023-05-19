import React, { useState } from "react";

const DescriptionProduct = ({ productDescription }) => {
  const [expanded, setExpanded] = useState();

  const toggleExpended = () => {
    setExpanded(!expanded);
  };
  return (
    <div className="max-w-7xl m-auto p-4 md:p-0">
      <h1 className="font-medium text-base md:text-2xl mt-3">
        Thông tin sản phẩm
      </h1>
      <div>
        <div className="bg-white rounded-xl p-5">
          <p
            className={`text-sm md:text-base ${
              !expanded ? "line-clamp-4" : "line-clamp-none"
            }`}
          >
            {productDescription}
          </p>
        </div>
        {!expanded && (
          <div
            className="text-center cursor-pointer"
            onClick={() => toggleExpended()}
          >
            <span className="">Xem thêm</span>
          </div>
        )}
        {expanded && (
          <div
            className="text-center cursor-pointer"
            onClick={() => toggleExpended()}
          >
            <span className="">Ẩn bớt</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionProduct;
