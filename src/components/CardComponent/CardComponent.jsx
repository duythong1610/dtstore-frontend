import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceOriginText,
  WrapperPriceText,
  WrapperReportText,
} from "./style";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../until";
import Soldout from "../../assets/img/sold_out.png";
import { Rate } from "antd";
import * as UserService from "../../services/UserService";
import { useSelector } from "react-redux";

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
  const user = useSelector((state) => state.user);
  const handleProductDetails = async () => {
    if (user?.id) {
      await UserService.viewedProducts(id, user?.id, user?.access_token);
      navigate(`/product-detail/${id}`);
    }
    navigate(`/product-detail/${id}`);
  };
  return (
    <WrapperCardStyle
      hoverable
      style={{ padding: "10px" }}
      bodyStyle={{ padding: 0 }}
      onClick={() => handleProductDetails()}
    >
      <div className="relative">
        <img
          src={image}
          className="my-2 md:my-4 mx-0 h-36 md:h-60 object-contain"
        />
        {countInStock === 0 && (
          <span style={{ position: "absolute", top: "30%", left: 0, right: 0 }}>
            <img src={Soldout} alt="" className="w-24 md:w-36 m-auto" />
          </span>
        )}
      </div>

      <StyleNameProduct className="text-sm md:text-lg">{name}</StyleNameProduct>
      <WrapperReportText className="md:text-sm">
        <span style={{ marginRight: "4px" }}>
          <Rate
            disabled
            value={rating}
            style={{ fontSize: "11px", color: "#e83a45" }}
            className="md:!text-sm"
          />
        </span>

        <span className="text-xs md:text-sm">
          {sold > 0 && `| Đã bán ${sold}`}{" "}
        </span>
      </WrapperReportText>

      <div
        style={{
          display: "flex",
          gap: 5,
          alignItems: "center",
          marginTop: "5px",
        }}
      >
        <div
          className={
            discount > 0
              ? "font-normal text-xs text-zinc-400 line-through"
              : "font-medium text-sm md:text-base text-red-500"
          }
        >
          <span>{convertPrice(price)}</span>
        </div>
        {discount > 0 && (
          <WrapperDiscountText>{`-${discount}%` || "-5%"}</WrapperDiscountText>
        )}
      </div>

      {discount > 0 && (
        <WrapperPriceText className="text-red-500 text-sm md:text-base">
          <span style={{ marginRight: "8px" }}>
            {convertPrice(price - (price * discount) / 100)}
          </span>
        </WrapperPriceText>
      )}
    </WrapperCardStyle>
  );
};

export default CardComponent;
