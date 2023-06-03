import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import CardComponent from "../../components/CardComponent/CardComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const ViewedProductsPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [viewedProduct, setViewedProduct] = useState();
  const fetchDetailsUser = async () => {
    const res = await UserService.getViewedProducts(
      user?.id,
      user?.access_token
    );
    setViewedProduct(res?.data?.viewedProducts);
  };
  useEffect(() => {
    if (user?.id) {
      fetchDetailsUser();
    }
  }, [user?.id]);
  return (
    <div>
      <Helmet>
        <title>Sản phẩm đã xem | October16</title>
      </Helmet>
      <div className="fixed flex items-center py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-10 bg-white">
        <div className="flex justify-center items-center">
          <LeftOutlined
            onClick={() => navigate(-1)}
            className={"w-8 h-8 text-lg text-blue-500 text-center"}
          />
        </div>
        <div className="text-center w-full mr-8">
          <h1 className="text-xl font-medium m-0">
            {" "}
            Đã xem{" "}
            {viewedProduct?.length > 1 && `| ${viewedProduct?.length} sản phẩm`}
          </h1>
        </div>
      </div>
      <div className="max-w-7xl m-auto min-h-screen pt-2">
        <h1 className="hidden md:block text-xl">
          Sản phẩm đã xem{" "}
          {viewedProduct?.length > 1 && `| ${viewedProduct?.length} sản phẩm`}
        </h1>
        <div className="grid gap-3 px-5 md:px-0 md:py-0 py-16 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-[80px]">
          {viewedProduct &&
            viewedProduct?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  name={product.name}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  priceAfterDiscount={product.priceAfterDiscount}
                  rating={product.rating}
                  type={product.type}
                  sold={product.sold}
                  discount={product.discount}
                  id={product._id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ViewedProductsPage;
