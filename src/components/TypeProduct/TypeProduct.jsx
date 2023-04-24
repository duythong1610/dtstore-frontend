import React from "react";
import { useNavigate } from "react-router-dom";
import { TypeProductItem } from "./style";

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(
      `product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "-")}`,
      { state: type }
    );
  };
  return (
    <TypeProductItem onClick={() => handleNavigateType(name)}>
      {name}
    </TypeProductItem>
  );
};

export default TypeProduct;
