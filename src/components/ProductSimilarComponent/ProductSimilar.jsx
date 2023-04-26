import React, { useEffect, useState } from "react";
import * as ProductService from "../../services/ProductService";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
} from "./style";
import Soldout from "../../assets/img/sold_out.png";
import { convertPrice } from "../../until";
import { Rate } from "antd";

const ProductSimilar = ({ idProduct }) => {
  const [productSimilar, setProductSimilar] = useState("");
  const fetchProductSimilar = async () => {
    const res = await ProductService.getAllProductSimilar(idProduct);
    setProductSimilar(res.data);
    return res.data;
  };

  useEffect(() => {
    fetchProductSimilar();
  }, [idProduct]);

  const handleProductDetails = (id) => {
    navigate(`/product-detail/${id}`);
  };

  console.log(productSimilar);

  return (
    <>
      <div className="p-4">
        <p className="text-base font-medium mb-0 md:text-2xl">
          Sản phẩm tương tự
        </p>
        <div className="overflow-y-hidden scrollbar-hide flex w-full gap-3 py-2">
          {productSimilar.length > 0 &&
            productSimilar?.map((product) => {
              return (
                <WrapperCardStyle
                  className="w-[40vw]"
                  hoverable
                  bodyStyle={{ padding: 10, width: "40vw" }}
                  onClick={() => handleProductDetails(product?._id)}
                >
                  <div className="relative">
                    <img
                      src={product?.image}
                      className="my-2 md:my-4 mx-0 h-36 md:h-60 object-contain"
                    />
                    {product?.countInStock === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "30%",
                          left: 0,
                          right: 0,
                        }}
                      >
                        <img
                          src={Soldout}
                          alt=""
                          className="w-24 md:w-36 m-auto"
                        />
                      </span>
                    )}
                  </div>

                  <StyleNameProduct className="text-sm md:text-lg">
                    {product?.name}
                  </StyleNameProduct>
                  <WrapperReportText className="md:text-sm">
                    <span style={{ marginRight: "4px" }}>
                      <Rate
                        disabled
                        value={product?.rating}
                        style={{ fontSize: "11px", color: "#e83a45" }}
                        className="md:!text-sm"
                      />
                    </span>

                    <span className="text-xs md:text-sm">
                      {product?.sold && `| Đã bán ${product?.sold}`}{" "}
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
                        product?.discount > 0
                          ? "font-normal text-xs text-zinc-400 line-through"
                          : "font-medium text-sm md:text-base text-red-500"
                      }
                    >
                      <span>{convertPrice(product?.price)}</span>
                    </div>
                    {product?.discount > 0 && (
                      <WrapperDiscountText>
                        {`-${product?.discount}%` || "-5%"}
                      </WrapperDiscountText>
                    )}
                  </div>

                  {product?.discount > 0 && (
                    <WrapperPriceText className="text-red-500 text-sm md:text-base">
                      <span style={{ marginRight: "8px" }}>
                        {convertPrice(
                          product?.price -
                            (product?.price * product?.discount) / 100
                        )}
                      </span>
                    </WrapperPriceText>
                  )}
                </WrapperCardStyle>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ProductSimilar;
