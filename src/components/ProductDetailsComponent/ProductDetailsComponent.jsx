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
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlice";
import { convertPrice } from "../../until";
import {
  LeftOutlined,
  ShoppingCartOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import SkeletonComponent from "../SkeletonComponent/SkeletonComponent";
import history from "../../history";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useCallback } from "react";
import logo from "../../assets/img/logo.png";
import shippingIcon from "../../assets/img/shippingIcon.png";
import protectIcon from "../../assets/img/protectIcon.png";
import changeIcon from "../../assets/img/changeIcon.png";
import * as message from "../Message/Message";

function ProductDetailsComponent({ idProduct, cbProductDetails }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [numProduct, setNumProduct] = useState(1);

  const handleScroll = useCallback(() => {
    const position = window.scrollY;
    setScrollPosition(position);
  }, []);

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
            priceAfterDiscount: productDetails?.priceAfterDiscount,
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
      <div className="flex flex-col-reverse md:flex-row-reverse md:gap-4 w-full max-w-7xl">
        <div className="w-full md:w-[25%]">
          <div className="flex flex-col md:gap-4 md:h-full">
            <div className="bg-white md:rounded-xl p-4">
              <div className="flex items-center gap-3">
                <img src={logo} alt="logo" width={32} height={32} />
                <a href="">
                  <div className="font-medium">
                    CÔNG TY TNHH MTV THƯƠNG MẠI DỊCH VỤ OCTOBER16TH
                    <CheckCircleFilled className="text-green-500 inline-block check-blue" />
                  </div>
                </a>
              </div>
            </div>
            <div className="bg-white md:rounded-xl p-4 h-full">
              <h1>Chính sách bán hàng</h1>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={shippingIcon}
                  alt="shipping-icon"
                  width={24}
                  height={24}
                />
                <h1 className="mb-0">
                  Miễn phí giao hàng cho đơn hàng từ 5 triệu
                </h1>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={protectIcon}
                  alt="protect-icon"
                  width={24}
                  height={24}
                />
                <h1 className="mb-0">Cam kết chính hãng 100%</h1>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={changeIcon}
                  alt="change-icon"
                  width={24}
                  height={24}
                />
                <h1 className="mb-0">Đổi trả trong vòng 10 ngày</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[75%]">
          <Row className="flex flex-col w-full md:flex-row md:flex-nowrap md:flex p-4 bg-white md:rounded-xl">
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
                      : "w-8 h-8 text-lg text-purple-500 text-center !block"
                  }
                />
              </div>
              <div>
                <NavLink to={"/gio-hang"}>
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
                          : "w-8 h-8 text-lg text-purple-500 text-center !block"
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
                <Col className="max-w-full md:pr-3" span={10}>
                  <LazyLoadImage
                    effect="blur"
                    className={`h-60 md:h-80 w-full object-contain block rounded-xl`}
                    src={productDetails?.image}
                    alt="img product"
                    preview={false}
                  />
                </Col>

                <Col span={14} className="max-w-full md:pl-5">
                  <WrapperStyleNameProduct className="text-slate-900 md:text-xl text-xl md:mt-0 mt-3">
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
                          ? "md:text-xl text-xl font-medium mr-2 text-red-500"
                          : "md:text-xl text-xl font-medium mr-2 text-black"
                      }
                    >
                      {productDetails?.discount
                        ? convertPrice(productDetails?.priceAfterDiscount)
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
                      {`${user?.address}${user?.district ? "," : ""} ${
                        user?.district
                      }${user?.city ? "," : ""} ${user?.city}`}{" "}
                    </span>
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
                        <PlusOutlined
                          style={{ color: "#000", fontSize: "20px" }}
                        />
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
                        background: "#9333EA",
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
                        border: "1px solid #9333EA",
                        color: "#9333EA",
                        fontSize: "15px",
                        fontWeight: "600",
                        height: "48px",
                        width: "220px",
                        borderRadius: "12px",
                      }}
                      textButton={"Mua trả sau"}
                      onClick={() =>
                        message.warning("Chức năng đang phát triển")
                      }
                    />
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}

export default React.memo(ProductDetailsComponent);
