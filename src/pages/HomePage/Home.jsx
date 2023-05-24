import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore } from "./index";
import SliderComponent from "../../components/Slider/SliderComponent";
import Slider1 from "../../assets/img/slider1.png";
import Slider2 from "../../assets/img/slider2.png";
import Slider3 from "../../assets/img/slider3.png";
import Slider4 from "../../assets/img/slider4.png";
import Slider5 from "../../assets/img/slider5.png";
import Slider6 from "../../assets/img/slider6.png";
import Soldout from "../../assets/img/sold_out.png";

import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import useDebounce from "../../hooks/useDebounce";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { searchProduct } from "../../redux/slides/productSlice";
import * as UserService from "../../services/UserService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
} from "../../components/CardComponent/style";
import { Divider, Rate } from "antd";
import { convertPrice } from "../../until";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useMemo } from "react";
import { useCallback } from "react";
import { Helmet } from "react-helmet";

function Home() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const searchProductMobile = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProductMobile, 1000);
  const [typeProduct, setTypeProduct] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allProducts, setAllProducts] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  console.log("re-render");
  const fetchAllProduct = useCallback(
    async (context) => {
      const limit = context?.queryKey && context?.queryKey[1];
      const search = context?.queryKey && context?.queryKey[2];

      const res = await ProductService.getAllProduct(search, limit);
      return res;
    },
    [limit]
  );

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();

    console.log(res);
    setTypeProduct(res.data);
    return res;
  };

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredProducts);
  };

  const handleProductDetails = async (id) => {
    if (user?.id) {
      await UserService.viewedProducts(id, user?.id, user?.access_token);
      navigate(`/product-detail/${id}`);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    navigate(`/product-detail/${id}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClearSearchText = () => {
    setSearchText("");
  };

  const handleSearch = () => {
    dispatch(searchProduct(searchText));
  };

  const handleSearchEnter = (e) => {
    if (e.keyCode == 13) {
      dispatch(searchProduct(searchText));
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
    filteredProducts();
  }, []);

  console.log("re-render");

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchAllProduct, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  console.log(products);

  const filteredProducts = async () => {
    setLoading(true);
    const res = await ProductService.getAllProduct();
    if (res) {
      setLoading(false);
      setAllProducts(res.data);
    }
  };

  const topProducts =
    Array.isArray(allProducts) &&
    allProducts.sort((a, b) => b.sold - a.sold).slice(0, 10);

  const isMobile = window.innerWidth <= 768;

  const itemLength = isMobile ? 2 : 5;
  return (
    <>
      <Helmet>
        <title>Dtstore - Trang chủ</title>
      </Helmet>
      {/* <Loading isLoading={isLoading}> */}
      <div className="hidden md:flex my-2 text-base font-normal m-auto text-zinc-400 max-w-7xl ">
        <TypeProduct items={typeProduct} />
      </div>
      <div className="relative">
        <div className="px-5 py-3 fixed top-0 left-0 right-0 z-50 bg-white md:hidden">
          <div className="flex justify-between border border-zinc-300 w-full rounded-lg overflow-hidden">
            <div className="flex items-center flex-1">
              <input
                type="text"
                placeholder="Bạn tìm gì..."
                className="outline-none px-3 py-2 h-10 w-full"
                onChange={onSearch}
                onKeyDown={handleSearchEnter}
              />
              {searchText && (
                <CloseOutlined
                  className="p-2"
                  onClick={handleClearSearchText}
                />
              )}
            </div>
            <div>
              <button className="outline-none w-10 h-10" onClick={handleSearch}>
                <SearchOutlined className="text-xl text-zinc-400" />
              </button>
            </div>
          </div>
        </div>

        {searchText && (
          <ul className="absolute bg-white top-[65px] z-50 p-4 w-full shadow-lg max-h-[50vh] overflow-auto">
            {suggestions.length > 0 && (
              <h1>Hiển thị {suggestions.length} kết quả tìm kiếm</h1>
            )}
            {searchText &&
              (suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <li
                    key={product._id}
                    className="mb-2 cursor-pointer"
                    onClick={() => {
                      navigate(`/product-detail/${product?._id}`);
                      setSearchText("");
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <div>
                        <img
                          src={product.image}
                          alt=""
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h1 className="mb-0">{product.name}</h1>
                        <p className="text-red-500 mb-0">
                          {convertPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <h1 className="text-center">
                  Không tìm thấy kết quả tương ứng
                </h1>
              ))}
          </ul>
        )}
      </div>
      <div className="h-full w-full bg-slate-100">
        <div
          id="container"
          style={{
            maxWidth: "1270px",
            margin: "0 auto",
          }}
        >
          <SliderComponent
            arrImages={[Slider1, Slider2, Slider3, Slider4, Slider5, Slider6]}
          />

          <div>
            {loading ? (
              <div className="skeleton h-7 md:w-[30%] w-[50%] mt-5 m-auto rounded-3xl"></div>
            ) : (
              <Divider className={`${loading ? "hidden" : "block"} !mb-0`}>
                <p className="font-bold text-xl md:text-[26px] mb-0">
                  {" "}
                  Sản phẩm bán chạy
                </p>
              </Divider>
            )}
            {loading ? (
              <div className="flex gap-5 w-full flex-wrap min-h-[290px] md:min-h-[376px] px-4 md:px-0 pt-4">
                {Array.from({ length: itemLength }).map((_) => {
                  return (
                    <div className="flex flex-col gap-2 pb-[18px] basis-[calc(50%-10px)] md:basis-[calc(20%-16px)] min-h-[290px] md:min-h-[431px]">
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
                className=""
              >
                {topProducts?.length > 0 &&
                  topProducts?.map((product) => {
                    return (
                      <SwiperSlide
                        // key={film.id}
                        className="!w-[calc(50%-10px)] md:!w-[calc(20%-16px)]"
                        // onClick={() =>
                        //   navigate(`/${film.media_type || endpoint}/${film.id}`)
                        // }
                      >
                        <WrapperCardStyle
                          key={product?._id}
                          className="rounded-xl min-h-[290px] md:min-h-[392px] border-none"
                          hoverable
                          bodyStyle={{ padding: 10 }}
                          onClick={() => handleProductDetails(product?._id)}
                        >
                          <div className="relative">
                            <LazyLoadImage
                              effect="blur"
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
              </Swiper>
            )}
          </div>

          <div className="min-h-[930px]">
            {isLoading ? (
              <div className="skeleton h-7 md:w-[30%] w-[60%] mt-5 m-auto rounded-3xl"></div>
            ) : (
              <Divider className={`${isLoading ? "hidden" : "block"} !mb-0`}>
                <p className="font-bold text-xl md:text-[26px] mb-0">
                  {" "}
                  Tất cả sản phẩm
                </p>
              </Divider>
            )}
            {isLoading ? (
              <div className="grid gap-5 py-4 px-4 md:px-0 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: products?.data?.length || 0 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 min-h-[351px]"
                    >
                      <div className="skeleton h-36 md:h-60 w-full rounded-md" />
                      <div className="skeleton h-6 w-full rounded-md" />
                      <div className="skeleton h-[18px] w-full rounded-md" />
                      <div className="skeleton h-[18px] w-2/3 rounded-md" />
                      <div className="skeleton h-5 w-full rounded-md" />
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="grid gap-5 py-4 px-4 md:px-0 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {products?.data?.map((product) => {
                  return (
                    <CardComponent
                      key={product._id}
                      name={product.name}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      sold={product.sold}
                      discount={product.discount}
                      id={product._id}
                    />
                  );
                })}
              </div>
            )}

            <div
              className={
                products?.data?.length === 0 || products?.totalPage === 1
                  ? "hidden"
                  : "flex justify-center"
              }
            >
              <WrapperButtonMore
                textButton={isPreviousData ? "Loading..." : "Xem thêm"}
                type="outline"
                styleButton={{
                  backgroundColor: "#422AFB",
                  marginBottom: "20px",
                  color: "#fff",
                  width: "240px",
                  height: "38px",
                  borderRadius: "20px",
                  fontWeight: 500,
                  display:
                    products?.total === products?.data.length
                      ? "none"
                      : "block",
                }}
                onClick={() => setLimit((prev) => prev + 10)}
              />
            </div>
          </div>

          {/* <NavbarComponent /> */}
        </div>
      </div>
      {/* </Loading> */}
    </>
  );
}

export default React.memo(Home);
