import React, { useState } from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "antd";
import Comment from "../../components/Comment/Comment";
import ProductSimilar from "../../components/ProductSimilarComponent/ProductSimilar";
import DescriptionProduct from "../../components/DescriptionProduct/DescriptionProduct";

function ProductDetailsPage() {
  const [productDetails, setProductDetails] = useState("");
  const { id } = useParams();
  const cbProductDetailsData = (productDetails) => {
    setProductDetails(productDetails);
  };

  return (
    <div style={{ background: "#efefef", height: "100%" }}>
      <div className="hidden md:flex flex-col max-w-7xl rounded-lg m-auto">
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
      <div className="flex md:flex-row flex-col max-w-7xl rounded-lg m-auto">
        <ProductDetailsComponent
          cbProductDetails={cbProductDetailsData}
          idProduct={id}
        />
      </div>
      <DescriptionProduct productDescription={productDetails?.description} />
      <ProductSimilar idProduct={id} />
      <Comment idProduct={id} />
    </div>
  );
}

export default ProductDetailsPage;
