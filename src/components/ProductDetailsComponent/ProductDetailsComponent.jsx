import { Col, Image, Rate, Row, notification } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, StarFilled, MinusOutlined } from "@ant-design/icons";
import {
  WrapperAddressProduct,
  WrapperBtnQuantityProduct,
  WrapperDescriptionProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuantityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlice";
import { convertPrice, priceDiscount } from "../../until";

function ProductDetailsComponent({ idProduct, cbProductDetails }) {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [numProduct, setNumProduct] = useState(1);
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
  console.log({ productDetails });

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
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInstock: productDetails?.countInStock,
          },
        })
      );
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <Row
        style={{
          width: "1270px",
          padding: "16px",
          background: "#fff",
          borderRadius: "12px",
          margin: "0 auto",
        }}
      >
        {contextHolder}
        <Col
          span={12}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "10px" }}
        >
          <img
            style={{
              height: "400px",
              width: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: "12px",
            }}
            src={productDetails?.image}
            alt="img product"
            preview={false}
          />

          <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src="https://img4.thuthuatphanmem.vn/uploads/2020/03/07/hinh-anh-con-de-dep_031137505.jpg"
                alt="img product small"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src="https://img4.thuthuatphanmem.vn/uploads/2020/03/07/hinh-anh-con-de-dep_031137505.jpg"
                alt="img product small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src="https://img4.thuthuatphanmem.vn/uploads/2020/03/07/hinh-anh-con-de-dep_031137505.jpg"
                alt="img product small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src="https://img4.thuthuatphanmem.vn/uploads/2020/03/07/hinh-anh-con-de-dep_031137505.jpg"
                alt="img product small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src="https://img4.thuthuatphanmem.vn/uploads/2020/03/07/hinh-anh-con-de-dep_031137505.jpg"
                alt="img product small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src="https://img4.thuthuatphanmem.vn/uploads/2020/03/07/hinh-anh-con-de-dep_031137505.jpg"
                alt="img product small"
                preview={false}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>

        <Col span={12} style={{ paddingLeft: "20px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>

          <div style={{ marginBottom: "10px" }}>
            <Rate
              value={productDetails?.rating}
              style={{ fontSize: "12px", color: "yellow" }}
            />
            <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
          </div>

          <WrapperPriceProduct>
            <WrapperPriceTextProduct
              style={{
                color: productDetails?.discount ? "rgb(255, 66, 78)" : "#333",
              }}
            >
              {productDetails?.discount
                ? convertPrice(
                    priceDiscount(productDetails?.price, productDetails)
                  )
                : convertPrice(productDetails?.price)}
            </WrapperPriceTextProduct>

            {productDetails?.discount && (
              <WrapperPriceTextProduct
                style={{
                  textDecorationLine: "line-through",
                  fontSize: "16px",
                  lineHeight: "40px",
                  color: "#808089",
                  fontWeight: 400,
                }}
              >
                {convertPrice(productDetails?.price)}
              </WrapperPriceTextProduct>
            )}
            {productDetails?.discount && (
              <div
                style={{
                  color: "rgb(255, 66, 78)",
                  fontWeight: 500,
                  lineHeight: "40px",
                }}
              >
                -{productDetails?.discount}%
              </div>
            )}
          </WrapperPriceProduct>

          <WrapperDescriptionProduct>
            <span style={{ fontSize: "16px" }}>
              Mô tả sản phẩm: {productDetails?.description}
            </span>
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
                onClick={() => handleChangeCount("decrease")}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </WrapperBtnQuantityProduct>

              <WrapperInputNumber
                size="small"
                min={1}
                max={productDetails?.countInStock}
                defaultValue={1}
                value={numProduct}
                onChange={onChange}
              />
              <WrapperBtnQuantityProduct
                onClick={() => handleChangeCount("increase")}
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </WrapperBtnQuantityProduct>
            </WrapperQuantityProduct>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <ButtonComponent
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
      </Row>
    </Loading>
  );
}

export default ProductDetailsComponent;
