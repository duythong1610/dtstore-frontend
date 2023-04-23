import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperTypeProduct,
  WrapperButtonMore,
  WrapperProducts,
} from "./index";
import SliderComponent from "../../components/Slider/SliderComponent";
import Slider1 from "../../assets/img/slider1.png";
import Slider2 from "../../assets/img/slider2.jpg";
import Slider3 from "../../assets/img/slider3.png";
import Slider4 from "../../assets/img/slider4.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import useDebounce from "../../hooks/useDebounce";

function Home() {
  const searchProduct = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [typeProduct, setTypeProduct] = useState([]);
  const [limit, setLimit] = useState(10);

  const fetchAllProduct = async (context) => {
    console.log(context);
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();

    setTypeProduct(res.data);
    return res;
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchAllProduct, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  return (
    <>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {typeProduct.map((item, index) => {
            return <TypeProduct key={index} name={item} />;
          })}
        </WrapperTypeProduct>
      </div>

      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{
            width: "1270px",
            margin: "0 auto",
          }}
        >
          <SliderComponent arrImages={[Slider1, Slider2, Slider3, Slider4]} />
          <Loading isLoading={isLoading}>
            <WrapperProducts>
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
            </WrapperProducts>
          </Loading>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
              textButton={isPreviousData ? "Loading..." : "Xem thêm"}
              type="outline"
              styleButton={{
                backgroundColor: "#422AFB",
                color: "#fff",
                width: "240px",
                height: "38px",
                borderRadius: "20px",
                fontWeight: 500,
                display:
                  products?.total === products?.data.length ? "none" : "block",
              }}
              onClick={() => setLimit((prev) => prev + 10)}
            />
          </div>

          {/* <NavbarComponent /> */}
        </div>
      </div>
    </>
  );
}

export default Home;
