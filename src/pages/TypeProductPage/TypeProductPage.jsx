import React from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Collapse, Pagination, Slider } from "antd";
import { useLocation, useParams } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import {
  CloseOutlined,
  FilterOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { convertPrice } from "../../until";

function TypeProductPage() {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { type, id } = useParams();
  const { Panel } = Collapse;

  const { state } = useLocation();
  const [products, setProducts] = useState("");
  const [brandsOfType, setBrandsOfType] = useState("");
  const [productsViews, setProductsView] = useState("");
  const [minValue, setMinValue] = useState(300000);
  const [maxValue, setMaxValue] = useState(50000000);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const [active, setActive] = useState("");
  const [isToggle, setIsToggle] = useState("");
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  console.log(type, id);
  const fetchProductType = async (type) => {
    setLoading(true);
    const res = await ProductService.getProductByType(type);
    console.log(res);
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setProductsView(res?.data);
      setPaginate({
        ...paginate,
        total: res?.totalPage,
      });
    } else {
      setLoading(false);
    }
  };

  const fetchBrandByType = async () => {
    setLoading(true);
    const res = await ProductService.getBrandByType(id);
    console.log(res);
    setBrandsOfType(res.data);
  };

  useEffect(() => {
    if (type) {
      fetchProductType(type);
      fetchBrandByType();
    }
  }, [type]);

  // const onChange = (current, pageSize) => {
  //   setPaginate({ ...paginate, page: current, limit: pageSize });
  // };

  const handleSearchPrice = (type) => {
    let result;
    switch (type) {
      case "2to4":
        result = products.filter((item) => {
          return (
            item.price - (item.price * item.discount) / 100 >= 2000000 &&
            item.price - (item.price * item.discount) / 100 <= 4000000
          );
        });
        return setProductsView(result);
      case "4to7":
        result = products.filter((item) => {
          return (
            item.price - (item.price * item.discount) / 100 >= 4000000 &&
            item.price - (item.price * item.discount) / 100 <= 7000000
          );
        });
        return setProductsView(result);
      case "7to13":
        result = products.filter((item) => {
          return (
            item.price - (item.price * item.discount) / 100 >= 7000000 &&
            item.price - (item.price * item.discount) / 100 <= 13000000
          );
        });
        return setProductsView(result);
      case "13to20":
        result = products.filter((item) => {
          return (
            item.price - (item.price * item.discount) / 100 >= 13000000 &&
            item.price - (item.price * item.discount) / 100 <= 20000000
          );
        });
        return setProductsView(result);
      case "20upto":
        result = products.filter((item) => {
          return item.price - (item.price * item.discount) / 100 >= 20000000;
        });
        return setProductsView(result);

      default:
        console.log("hhh");
    }
  };

  const handleFilterByBrand = async (brand) => {
    const res = await ProductService.getProductByBrandAndType(brand, type);
    setProductsView(res.data);
    return res;
  };
  const handleOnChangeSliderPrice = (value) => {
    setProductsView(products);
    setMinValue(value[0]);
    setMaxValue(value[1]);
    const productFilter = products.filter((item) => {
      return (
        item.price - (item.price * item.discount) / 100 >= minValue &&
        item.price - (item.price * item.discount) / 100 <= maxValue
      );
    });
    setProductsView(productFilter);
  };

  // const handleToggleClass = () => {
  //   setIsToggle((current) => !current);
  // };

  // const handleActive = (type) => {};

  const itemsFilter = [
    {
      label: "Khuyến mãi tốt nhất",
      type: "discount",
    },
    {
      label: "Bán chạy",
      type: "sold",
    },
    {
      label: "Giá giảm dần",
      type: "pricedown",
    },
    {
      label: "Giá tăng dần",
      type: "priceup",
    },
  ];

  const items = [
    {
      label: "Từ 2-4 triệu",
      type: "2to4",
    },
    {
      label: "Từ 4-7 triệu",
      type: "4to7",
    },
    {
      label: "Từ 7-13 triệu",
      type: "7to13",
    },
    {
      label: "Từ 13-20 triệu",
      type: "13to20",
    },
    {
      label: "Trên 20 triệu",
      type: "20upto",
    },
  ];

  const formatter = (value) => `${convertPrice(value)}`;
  function renderFilter() {
    return itemsFilter.map((item) => {
      return (
        <div className="item inline-block mr-2">
          <button
            className={`py-1 px-5 border border-gray-300 rounded-md hover:bg-zinc-200 ${
              activeFilter === item.type &&
              "!bg-purple-600 rounded-md text-white"
            }`}
            onClick={() => handleButton(item.type)}
          >
            {item.label}
          </button>
        </div>
      );
    });
  }

  const handleButton = (type) => {
    if (type) {
      setIsToggle(type);
      setActiveFilter(type);
    }
    console.log({ type }, { activeFilter });
    if (type === activeFilter) {
      setActiveFilter("");
    }
  };

  return (
    <Loading isLoading={loading}>
      <div className="bg-slate-100">
        <div className="max-w-7xl m-auto">
          <div className="flex gap-5 mt-5">
            <div className="min-w-[15%] w-[15%] rounded-xl overflow-hidden hidden md:block">
              <Collapse defaultActiveKey={["1", "2"]}>
                <Panel header="Khoảng giá" key="1" className="font-medium">
                  <div>
                    {items.map((item) => {
                      return (
                        <div
                          className={`item inline-block mr-2 mb-2 ${
                            active === item.type &&
                            "bg-purple-600 rounded-md text-white"
                          }`}
                          onClick={() => setActive(item.type)}
                        >
                          <button
                            className="py-1 px-2 border border-gray-300 rounded-md"
                            onClick={() => handleSearchPrice(item?.type)}
                          >
                            {item?.label}
                          </button>
                        </div>
                      );
                    })}
                    <div>
                      <h1 className="mt-2">Hoặc chọn mức giá phù hợp</h1>
                      <Slider
                        step={10000}
                        min={300000}
                        max={50000000}
                        range
                        value={[minValue, maxValue]}
                        defaultValue={[300000, 50000000]}
                        onChange={handleOnChangeSliderPrice}
                        tooltip={{ formatter }}
                      />
                    </div>
                  </div>
                </Panel>
                <Panel header="Thương hiệu" key="2" className="font-medium">
                  {Array.isArray(brandsOfType) &&
                    brandsOfType?.map((item) => {
                      return (
                        <div onClick={() => setActive(item._id)}>
                          <button
                            className={`item inline-block w-full !py-2 text-left${
                              active === item._id &&
                              "border bg-purple-600 rounded-md text-white"
                            }`}
                            onClick={() => handleFilterByBrand(item?.name)}
                          >
                            {item?.name}
                          </button>
                        </div>
                      );
                    })}
                </Panel>
              </Collapse>
            </div>

            <div className="py-5 md:pt-0 min-h-screen">
              <div className="flex flex-col justify-between gap-4">
                <div className="fixed top-0 right-0 left-0 z-10 bg-white py-2 shadow-sm px-4 md:hidden">
                  <div className="flex justify-between border-none bg-slate-100 w-full rounded-lg overflow-hidden">
                    <div className="flex items-center flex-1">
                      <input
                        type="text"
                        placeholder="Bạn tìm gì..."
                        className="outline-none px-3 py-2 h-10 w-full bg-transparent "
                        // onChange={onSearch}
                        // onKeyDown={handleSearchEnter}
                        // value={searchText}
                      />
                      {/* {searchText && (
                        <CloseOutlined
                          className="p-2"
                          onClick={handleClearSearchText}
                        />
                      )} */}
                    </div>
                    <div>
                      <button
                        className="outline-none w-10 h-10"
                        // onClick={handleSearch}
                      >
                        <SearchOutlined className="text-xl text-zinc-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <div>Mặc định</div>
                    <div>Bộ lọc</div>
                  </div>
                  {false && (
                    <div className="w-full mt-3">
                      <ul>
                        {itemsFilter.map((item) => {
                          return (
                            <li
                              className="py-2 border-b-[1px] w-full flex items-center justify-between"
                              onClick={() => handleButton(item.type)}
                            >
                              <span>{item.label}</span>
                              {activeFilter === item.type && (
                                <CheckOutlined className="text-blue-500" />
                              )}
                            </li>
                            // <div className="item inline-block mr-2">
                            //   <button
                            //     className={`py-1 px-5 border border-gray-300 rounded-md hover:bg-zinc-200 ${
                            //       activeFilter === item.type &&
                            //       "!bg-purple-600 rounded-md text-white"
                            //     }`}
                            //     onClick={() => handleButton(item.type)}
                            //   >
                            //     {item.label}
                            //   </button>
                            // </div>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <FilterOutlined className="text-base" />
                    <span className="font-medium md:block md:text-base">
                      Bộ lọc:
                    </span>
                  </div>
                  <div className="scroll-main overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-item">
                    {/* <div className="item inline-block mr-2">
                  <button
                    className="py-1 px-5 border border-gray-300 rounded-md"
                    onClick={() => handleButton("price")}
                  >
                    Giá
                  </button>
                </div> */}
                    {renderFilter()}
                  </div>
                </div>
                <div className="mt-6 md:mt-0 grid gap-3 p-4 md:p-0 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                  {productsViews?.length > 0 &&
                    productsViews
                      ?.filter((pro) => {
                        if (searchDebounce === "") {
                          return pro;
                        } else if (
                          pro?.name
                            ?.toLowerCase()
                            .includes(searchDebounce.toLowerCase())
                        ) {
                          return pro;
                        }
                      })
                      ?.map((product) => {
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

                {/* <Pagination
                // showQuickJumper
                defaultCurrent={paginate?.page}
                total={paginate?.total}
                onChange={onChange}
                style={{ textAlign: "center", margin: "20px 0" }}
              /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default TypeProductPage;
