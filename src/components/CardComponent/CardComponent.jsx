import React, { useEffect, useState } from "react";
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
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const CardComponent = ({
  discount,
  sold,
  countInStock,
  description,
  image,
  price,
  priceAfterDiscount,
  rating,
  type,
  name,
  id,
  userInfo,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleProductDetails = async () => {
    const isExisted = userInfo?.viewedProducts.includes(id);
    if (user?.id && !isExisted) {
      await UserService.viewedProducts(id, user?.id, user?.access_token);
      navigate(`/chi-tiet-san-pham/${id}`);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    navigate(`/chi-tiet-san-pham/${id}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <WrapperCardStyle
      hoverable
      style={{ padding: "10px" }}
      bodyStyle={{ padding: 0 }}
      onClick={() => handleProductDetails()}
    >
      <div className="relative">
        <LazyLoadImage
          effect="blur"
          src={image}
          className="mb-2 md:my-4 object-contain h-[150px] md:h-[190px] aspect-square mx-auto"
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
            {convertPrice(priceAfterDiscount)}
          </span>
        </WrapperPriceText>
      )}
    </WrapperCardStyle>
  );
};

export default React.memo(CardComponent);
