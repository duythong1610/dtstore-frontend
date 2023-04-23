import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import officialLogo from "../../assets/img/official.png";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../until";

const CardComponent = ({
  discount,
  sold,
  countInStock,
  description,
  image,
  price,
  rating,
  type,
  name,
  id,
}) => {
  const navigate = useNavigate();
  const handleProductDetails = () => {
    navigate(`/product-detail/${id}`);
  };
  return (
    <WrapperCardStyle
      hoverable
      bodyStyle={{ padding: "10px" }}
      cover={
        <img style={{ height: "250px", objectFit: "cover" }} src={image} />
      }
      onClick={() => handleProductDetails(id)}
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
          <span style={{ fontSize: "16px", marginRight: "5px" }}>{rating}</span>
          <StarFilled style={{ fontSize: "16px", color: "yellow" }} />
        </span>

        <WrapperStyleTextSell>| đã bán {sold || "1000+"} </WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>{convertPrice(price)}</span>
        <WrapperDiscountText>{discount || "-5%"}</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
