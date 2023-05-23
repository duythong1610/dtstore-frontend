import { Badge, Col, Rate, Row, notification } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {
  WrapperAddressProduct,
  WrapperBtnQuantityProduct,
  WrapperDescriptionProduct,
  WrapperInputNumber,
  WrapperQuantityProduct,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlice";
import { convertPrice, priceDiscount } from "../../until";
import { LeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import SkeletonComponent from "../SkeletonComponent/SkeletonComponent";
import history from "../../history";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function ProductDetailsComponent({ idProduct, cbProductDetails }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  // const [isNavigatedBack, setIsNavigatedBack] = useState(false);
  const [numProduct, setNumProduct] = useState(1);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onChange = () => {};
  const fetchProductDetails = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { isLoading, data: productDetails } = useQuery(
    ["product-details", idProduct],
    fetchProductDetails,
    {
      enabled: !!idProduct,
    }
  );

  const sendData = () => {
    cbProductDetails(productDetails);
  };

  useEffect(() => {
    sendData();
  }, [productDetails]);

  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumProduct(numProduct + 1);
    } else if (type === "decrease") {
      setNumProduct(numProduct - 1);
    }
  };

  const handleBackPage = () => {
    window.scrollTo(0, 0);
    history.back();
  };

  const handleAddOrderProduct = () => {
    api.success({
      message: "Thêm vào giỏ hàng thành công",
      description: "Vào giỏ hàng xem sản phẩm đã chọn và thanh toán",
    });
    if (!user?.id) {
      navigate("/sign-in", { state: location.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            priceDiscount:
              productDetails?.price -
              (productDetails?.price * productDetails?.discount) / 100,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInstock: productDetails?.countInStock,
          },
        })
      );
    }
  };

  return (
    <>
      <Row className="flex flex-col w-full md:flex-row md:flex-nowrap md:flex max-w-7xl p-4 bg-white md:rounded-xl">
        {contextHolder}
        <div
          className="fixed flex items-center justify-between py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-10"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${(
              scrollPosition / 150
            ).toFixed(1)})`,
          }}
        >
          <div className="flex justify-center items-center">
            <LeftOutlined
              onClick={() => {
                handleBackPage();
              }}
              className={
                scrollPosition === 0
                  ? "w-8 h-8 text-lg text-white text-center !block rounded-full bg-zinc-400 opacity-80"
                  : "w-8 h-8 text-lg text-blue-500 text-center !block"
              }
            />
          </div>
          <div>
            <NavLink to={"/order"}>
              <Badge
                className="top-1"
                count={order?.orderItems?.length}
                size="small"
              >
                <ShoppingCartOutlined
                  // onClick={navigate("/order")}
                  className={
                    scrollPosition === 0
                      ? "w-8 h-8 text-lg text-white text-center rounded-full bg-zinc-400 opacity-80 !block"
                      : "w-8 h-8 text-lg text-blue-500 text-center !block"
                  }
                />
              </Badge>
            </NavLink>
          </div>
        </div>
        {isLoading ? (
          <SkeletonComponent />
        ) : (
          <>
            <Col className="max-w-full md:pr-3" span={12}>
              <LazyLoadImage
                effect="blur"
                className="h-60 md:h-96 w-full object-contain block rounded-xl"
                src={productDetails?.image}
                alt="img product"
                preview={false}
              />
            </Col>

            <Col span={12} className="max-w-full md:pl-5">
              <WrapperStyleNameProduct className="text-slate-900 md:text-2xl text-xl md:mt-0 mt-3">
                {productDetails?.name}
              </WrapperStyleNameProduct>
              {productDetails?.countInStock === 0 && (
                <p style={{ color: "#e83a45", marginTop: "-10px" }}>
                  TẠM THỜI HẾT HÀNG
                </p>
              )}

              <div style={{ marginBottom: "10px" }}>
                <Rate
                  disabled
                  value={productDetails?.rating}
                  style={{ fontSize: "12px", color: "#e83a45" }}
                />
                {productDetails?.sold > 0 && (
                  <WrapperStyleTextSell>
                    {` | Đã bán ${productDetails?.sold}`}
                  </WrapperStyleTextSell>
                )}
              </div>

              <div className="flex items-end bg-gray-100 md:px-3 px-2 md:py-5 py-3 rounded">
                <div
                  className={
                    productDetails?.discount
                      ? "md:text-3xl text-2xl font-medium mr-2 text-red-500"
                      : "md:text-3xl text-2xl font-medium mr-2 text-black"
                  }
                >
                  {productDetails?.discount
                    ? convertPrice(
                        priceDiscount(productDetails?.price, productDetails)
                      )
                    : convertPrice(productDetails?.price)}
                </div>

                {productDetails?.discount > 0 && (
                  <div className="flex items-center -mb-2">
                    <span className="line-through text-sm md:text-base font-medium mr-2 text-gray-400">
                      {convertPrice(productDetails?.price)}
                    </span>

                    {productDetails?.discount > 0 && (
                      <span
                        style={{
                          color: "rgb(255, 66, 78)",
                          fontWeight: 500,
                          lineHeight: "40px",
                        }}
                      >
                        -{productDetails?.discount}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              <WrapperDescriptionProduct>
                {/* <span style={{ fontSize: "16px" }}>
              Mô tả sản phẩm: {productDetails?.description}
            </span> */}
              </WrapperDescriptionProduct>
              <WrapperAddressProduct>
                <span style={{ fontSize: "16px" }}>Giao đến </span>
                <span className="address">
                  {user?.address
                    ? user?.address
                    : "43 Hồ văn Huê, Quận Phú Nhuận, Hồ Chí Minh"}{" "}
                </span>

                <span className="change-address"> - Đổi địa chỉ</span>
              </WrapperAddressProduct>

              <div
                style={{
                  margin: "10px 0 20px",
                  padding: "10px 0",
                  borderTop: "1px solid #e5e5e5",
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div
                  style={{
                    marginBottom: "10px",
                    fontSize: "16px",
                  }}
                >
                  Số lượng
                </div>
                <WrapperQuantityProduct>
                  <WrapperBtnQuantityProduct
                    disabled={numProduct <= 1}
                    onClick={() => handleChangeCount("decrease")}
                  >
                    <MinusOutlined
                      style={{ color: "#000", fontSize: "20px" }}
                    />
                  </WrapperBtnQuantityProduct>

                  <WrapperInputNumber
                    size="small"
                    defaultValue={1}
                    value={numProduct}
                    onChange={onChange}
                    min={1}
                    max={productDetails?.countInStock}
                  />
                  <WrapperBtnQuantityProduct
                    onClick={() => handleChangeCount("increase")}
                  >
                    <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
                  </WrapperBtnQuantityProduct>
                </WrapperQuantityProduct>
              </div>

              <div
                className={
                  productDetails?.countInStock === 0
                    ? "hidden"
                    : "fixed bottom-0 left-0 right-0 z-10 px-5 py-3 bg-white md:static flex flex-row-reverse md:flex-row items-center gap-5"
                }
              >
                <ButtonComponent
                className="hover:opacity-80"
                  size={40}
                  style={{
                    color: "#fff",
                    background: "rgb(66, 42, 251)",
                    fontSize: "15px",
                    fontWeight: "600",
                    height: "48px",
                    width: "220px",
                    border: "none",
                    borderRadius: "12px",
                  }}
                  textButton={"Chọn mua"}
                  onClick={() => handleAddOrderProduct()}
                />
                <ButtonComponent
                  size={40}
                  style={{
                    background: "#fff",
                    border: "1px solid rgb(13, 92, 182)",
                    color: "rgb(13, 92, 182)",
                    fontSize: "15px",
                    fontWeight: "600",
                    height: "48px",
                    width: "220px",
                    borderRadius: "12px",
                  }}
                  textButton={"Mua trả sau"}
                />
              </div>
            </Col>
          </>
        )}
      </Row>
    </>
  );
}

export default ProductDetailsComponent;
