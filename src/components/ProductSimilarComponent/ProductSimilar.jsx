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
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const ProductSimilar = ({ idProduct }) => {
  const [productSimilar, setProductSimilar] = useState("");
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const fetchProductSimilar = async () => {
    const res = await ProductService.getAllProductSimilar(idProduct);
    setProductSimilar(res.data);
    return res.data;
  };

  useEffect(() => {
    setLoading(true);
    fetchProductSimilar();
    setLoading(false);
  }, [idProduct]);

  console.log(loading);

  const handleProductDetails = (id) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate(`/product-detail/${id}`);
  };

  console.log(productSimilar.length);

  return (
    <>
      <div className="p-4 md:p-0 max-w-7xl m-auto">
        <p className="text-base font-medium mb-0 md:text-2xl">
          Sản phẩm tương tự
        </p>
        {/* <div className="overflow-y-hidden scrollbar-item md:overflow-y-auto flex w-full gap-3 py-2"> */}
        <Swiper
          modules={[Navigation, Autoplay]}
          // autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation
          slidesPerView="auto"
          slidesPerGroupAuto
          spaceBetween={20}
          // loop
          className=""
        >
          {loading ? (
            Array.from({ length: productSimilar?.length || 0 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 md:min-w-[20%] min-w-[40vw] overflow-y-hidden "
                >
                  <div className="skeleton h-36 w-full rounded-md" />
                  <div className="skeleton h-6 w-full rounded-md" />
                  <div className="skeleton h-[18px] w-full rounded-md" />
                  <div className="skeleton h-[18px] w-2/3 rounded-md" />
                  <div className="skeleton h-5 w-full rounded-md" />
                </div>
              )
            )
          ) : (
            <>
              {productSimilar?.length > 0 &&
                productSimilar?.map((product) => {
                  return (
                    <SwiperSlide
                      // key={film.id}
                      className="!w-[calc(50%-10px)] md:!w-[calc(20%-15px)]"
                      // onClick={() =>
                      //   navigate(`/${film.media_type || endpoint}/${film.id}`)
                      // }
                    >
                      <WrapperCardStyle
                        key={product?._id}
                        className="rounded-xl"
                        hoverable
                        bodyStyle={{ padding: 10 }}
                        onClick={() => handleProductDetails(product?._id)}
                      >
                        <div className="relative">
                          <img
                            src={product?.image}
                            className="my-2 md:my-4 mx-0 object-contain"
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

                          <span className="text-[11px] md:text-sm">
                            {product?.sold > 0 && `| Đã bán ${product?.sold}`}{" "}
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
                    </SwiperSlide>
                  );
                })}
            </>
          )}
        </Swiper>
        {/* </div> */}
      </div>
    </>
  );
};

export default ProductSimilar;
