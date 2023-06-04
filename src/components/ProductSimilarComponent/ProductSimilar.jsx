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
    setLoading(true);
    const res = await ProductService.getAllProductSimilar(idProduct);
    setLoading(false);
    setProductSimilar(res.data);
    return res.data;
  };

  useEffect(() => {
    fetchProductSimilar();
  }, [idProduct]);

  const handleProductDetails = (id) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate(`/chi-tiet-san-pham/${id}`);
  };

  const isMobile = window.innerWidth <= 768;

  const itemLength = isMobile ? 2 : 5;

  return (
    <>
      <div className="md:p-0 max-w-7xl m-auto">
        <p className="text-base font-medium -mb-2 mt-5 md:text-2xl pl-4 md:pl-0">
          Sản phẩm tương tự
        </p>

        {loading ? (
          <div className="flex gap-5 w-full flex-wrap min-h-[290px] md:min-h-[376px] px-4 md:px-0 pt-4">
            {Array.from({ length: itemLength }).map((_, index) => {
              return (
                <div
                  className="flex flex-col gap-2 pb-[18px] basis-[calc(50%-10px)] md:basis-[calc(20%-16px)] min-h-[290px] md:min-h-[431px]"
                  key={index}
                >
                  <div className="skeleton h-36 md:h-60 w-full rounded-md" />
                  <div className="skeleton h-6 w-full rounded-md" />
                  <div className="skeleton h-[18px] w-full rounded-md" />
                  <div className="skeleton h-[18px] w-2/3 rounded-md" />
                  <div className="skeleton h-5 w-full rounded-md" />
                </div>
              );
            })}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            // autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation
            slidesPerView="auto"
            slidesPerGroupAuto
            spaceBetween={20}
            // loop
            className="!p-4 !min-h-[330px] md:!py-4 md:!px-0"
          >
            {productSimilar?.length > 0 &&
              productSimilar?.map((product) => {
                return (
                  <SwiperSlide
                    key={product?._id}
                    // key={film.id}
                    className="!w-[calc(50%-10px)] md:!w-[calc(20%-16px)]"
                    // onClick={() =>
                    //   navigate(`/${film.media_type || endpoint}/${film.id}`)
                    // }
                  >
                    <WrapperCardStyle
                      className="rounded-xl min-h-[290px] md:min-h-[392px] border-none"
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
                              alt="soldout-img"
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
          </Swiper>
        )}

        {/* <div className="overflow-y-hidden scrollbar-item md:overflow-y-auto flex w-full gap-3 py-2"> */}

        {/* </div> */}
      </div>
    </>
  );
};

export default React.memo(ProductSimilar);
