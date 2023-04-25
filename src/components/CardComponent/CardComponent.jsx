import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperImageCard,
  WrapperPriceOriginText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./style";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../until";
import Soldout from "../../assets/img/sold_out.png";
import { Rate } from "antd";

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
      style={{ padding: "10px" }}
      bodyStyle={{ padding: 0 }}
      cover={<WrapperImageCard src={image} />}
      onClick={() => handleProductDetails(id)}
    >
      {countInStock === 0 && (
        <span style={{ position: "absolute", top: "30%", left: 0, right: 0 }}>
          <img
            src={Soldout}
            alt=""
            style={{ width: "150px", margin: "0 auto" }}
          />
        </span>
      )}

      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
          <Rate
            disabled
            value={rating}
            style={{ fontSize: "12px", color: "#e83a45" }}
          />
        </span>

        <WrapperStyleTextSell>
          {sold && `| Đã bán ${sold}`}{" "}
        </WrapperStyleTextSell>
      </WrapperReportText>

      <div
        style={{
          display: "flex",
          gap: 5,
          alignItems: "center",
          marginTop: "5px",
        }}
      >
        <WrapperPriceOriginText
          style={
            discount > 0
              ? {
                  fontWeight: 400,
                  fontSize: "14px",
                  textDecorationLine: "line-through",
                }
              : { fontWeight: 500, color: " rgb(255, 66, 78)" }
          }
        >
          <span style={{ marginRight: "8px" }}>{convertPrice(price)}</span>
        </WrapperPriceOriginText>
        {discount > 0 && (
          <WrapperDiscountText>{`-${discount}%` || "-5%"}</WrapperDiscountText>
        )}
      </div>

      {discount > 0 && (
        <WrapperPriceText>
          <span style={{ marginRight: "8px" }}>
            {convertPrice(price - (price * discount) / 100)}
          </span>
        </WrapperPriceText>
      )}
    </WrapperCardStyle>
  );
};

export default CardComponent;
