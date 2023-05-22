import React from "react";
import { useNavigate } from "react-router-dom";
import laptopThumbnail from "../../assets/img/laptop.jpg";
import phoneThumbnail from "../../assets/img/phone.jpg";
import tabletThumbnail from "../../assets/img/tablet.jpg";
import watchThumbnail from "../../assets/img/watch.jpg";

const TypeProduct = ({ name, handleToggleClassContent }) => {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "-")}`,
      { replace: true, state: type }
    );
    handleToggleClassContent();
  };

  function renderTypeProduct(name) {
    if (name === "Điện thoại") {
      return (
        <div>
          <div className="md:hidden">
            <img
              src={phoneThumbnail}
              alt=""
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-base text-center mt-2 md:m-0">{name}</h1>
        </div>
      );
    }
    if (name === "Laptop") {
      return (
        <div>
          <div className="md:hidden">
            <img
              src={laptopThumbnail}
              alt=""
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-base text-center mt-2 md:m-0">{name}</h1>
        </div>
      );
    }
    if (name === "Đồng hồ") {
      return (
        <div>
          <div className="md:hidden">
            <img
              src={watchThumbnail}
              alt=""
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-base text-center mt-2 md:m-0">{name}</h1>
        </div>
      );
    }
    if (name === "Tablet") {
      return (
        <div>
          <div className="md:hidden">
            <img
              src={tabletThumbnail}
              alt=""
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-base text-center mt-2 md:m-0">{name}</h1>
        </div>
      );
    }
  }

  return (
    <div
      onClick={() => handleNavigateType(name)}
      className="m-auto md:m-0 px-4 py-2 cursor-pointer hover:bg-zinc-200 rounded-lg"
    >
      {renderTypeProduct(name)}
    </div>
  );
};

export default TypeProduct;
