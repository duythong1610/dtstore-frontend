import React from "react";

const DescriptionProduct = ({ productDescription }) => {
  return (
    <div className="max-w-7xl m-auto p-4 md:p-0">
      <h1 className="font-medium text-base md:text-2xl mt-3">
        Thông tin sản phẩm
      </h1>
      <p className="text-sm md:text-base bg-white rounded-xl p-5">
        {productDescription}
      </p>
    </div>
  );
};

export default DescriptionProduct;
