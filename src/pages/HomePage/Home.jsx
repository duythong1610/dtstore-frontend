import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore } from "./index";
import SliderComponent from "../../components/Slider/SliderComponent";
import Slider1 from "../../assets/img/slider1.png";
import Slider2 from "../../assets/img/slider2.png";
import Slider3 from "../../assets/img/slider3.png";
import Slider4 from "../../assets/img/slider4.png";
import Slider5 from "../../assets/img/slider5.png";
import Slider6 from "../../assets/img/slider6.png";

import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import useDebounce from "../../hooks/useDebounce";
import { SearchOutlined } from "@ant-design/icons";
import { searchProduct } from "../../redux/slides/productSlice";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

function Home() {
  const searchProductMobile = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProductMobile, 1000);
  const [typeProduct, setTypeProduct] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();

  const fetchAllProduct = async (context) => {
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

  const onSearch = (e) => {
    setSearchText(e.target.value);
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
      <Loading isLoading={isLoading}>
        <div className="hidden md:flex my-2 text-base h-10 font-normal m-auto text-zinc-400 max-w-7xl ">
          {typeProduct.map((item, index) => {
            return <TypeProduct key={index} name={item} />;
          })}
        </div>
        <div className="px-5 py-3 fixed top-0 left-0 right-0 z-10 bg-white md:hidden">
          <div className="flex justify-between border border-zinc-300 w-full rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Bạn tìm gì..."
              className="outline-none px-3 py-2 h-10 w-full"
              onChange={onSearch}
              onKeyDown={handleSearchEnter}
            />
            <div>
              <button className="outline-none w-10 h-10" onClick={handleSearch}>
                <SearchOutlined className="text-xl text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
        <div className="min-h-screen h-full w-full bg-slate-100">
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

            <div className="grid gap-3 p-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-[80px]">
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

            <div className="flex justify-center -mt-[80px]">
              <WrapperButtonMore
                textButton={isPreviousData ? "Loading..." : "Xem thêm"}
                type="outline"
                styleButton={{
                  backgroundColor: "#422AFB",
                  marginBottom: "20%",
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

            {/* <NavbarComponent /> */}
          </div>
        </div>
      </Loading>
    </>
  );
}

export default Home;
