import React, { useState } from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "antd";
import Comment from "../../components/Comment/Comment";

function ProductDetailsPage() {
  const [productDetails, setProductDetails] = useState("");
  const { id } = useParams();
  const cbProductDetailsData = (productDetails) => {
    setProductDetails(productDetails);
  };

  return (
    <div style={{ padding: "0 120px", background: "#efefef", height: "100%" }}>
      <div
        style={{
          display: "flex",
          borderRadius: "8px",
          maxWidth: "1270px",
          margin: "0 auto",
        }}
      >
        <Breadcrumb
          style={{ padding: "8px 0", fontSize: 16 }}
          items={[
            {
              title: <Link to="/">Trang chủ</Link>,
            },
            {
              title: ` ${productDetails?.type ? productDetails?.type : ""}`,
            },
            {
              title: `${productDetails?.name ? productDetails?.name : ""}`,
            },
          ]}
        />
      </div>
      <div
        style={{
          display: "flex",
          borderRadius: "8px",
          background: "#fff",
          maxWidth: "1270px",
          margin: "0 auto",
        }}
      >
        <ProductDetailsComponent
          cbProductDetails={cbProductDetailsData}
          idProduct={id}
        />
      </div>
      <Comment idProduct={id} />
    </div>
  );
}

export default ProductDetailsPage;
