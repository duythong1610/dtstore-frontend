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
  CaretDownOutlined,
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
  const [sort, setSort] = useState({
    sortBy: null,
    sort: null,
  });
  const [products, setProducts] = useState("");
  const [label, setLabel] = useState("Mặc định");
  const [brandsOfType, setBrandsOfType] = useState("");
  const [productsViews, setProductsView] = useState("");
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [activePrice, setActivePrice] = useState("");
  const [isToggleContent, setIsToggleContent] = useState(false);
  const [isOpenFilterMobile, setIsOpenFilterMobile] = useState(false);
  const [isToggle, setIsToggle] = useState("");
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  console.log(type, id);
  const fetchProductType = async (type) => {
    setLoading(true);
    const res = await ProductService.getProductByType(
      type,
      sort,
      activeBrand,
      minValue,
      maxValue
    );
    console.log(res);
    if (res) {
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

  console.log(sort);

  const fetchBrandByType = async () => {
    setLoading(true);
    const res = await ProductService.getBrandByType(id);
    console.log(res);
    setBrandsOfType(res.data);
  };

  useEffect(() => {
    if (type) {
      fetchProductType(type);
    }
  }, [type, sort, activeBrand, minValue, maxValue]);

  useEffect(() => {
    fetchBrandByType();
  }, [type]);

  // const onChange = (current, pageSize) => {
  //   setPaginate({ ...paginate, page: current, limit: pageSize });
  // };

  const handleSearchPrice = (type) => {
    switch (type) {
      case "2to4":
        return setMinValue(2000000), setMaxValue(4000000);
      case "4to7":
        return setMinValue(4000000), setMaxValue(7000000);

      case "7to13":
        return setMinValue(7000000), setMaxValue(13000000);

      case "13to20":
        return setMinValue(13000000), setMaxValue(20000000);

      case "20upto":
        return setMinValue(20000000), setMaxValue("");

      default:
        console.log("hhh");
    }
  };

  // const handleFilterByBrand = async (brand) => {
  //   const res = await ProductService.getProductByBrandAndType(brand, type);
  //   setProductsView(res?.data);
  //   return res;
  // };
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
  console.log(label);
  const itemsFilter = [
    {
      id: 1,
      label: "Mặc định",
    },
    {
      id: 2,
      label: "Khuyến mãi tốt nhất",
      sortBy: "discount",
      sort: "desc",
    },
    {
      id: 3,
      label: "Bán chạy",
      sortBy: "sold",
      sort: "desc",
    },
    {
      id: 4,
      label: "Giá giảm dần",
      sortBy: "price",
      sort: "desc",
    },
    {
      id: 5,
      label: "Giá tăng dần",
      sortBy: "price",
      sort: "asc",
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
            className={`py-1 px-5 shadow-sm bg-white rounded-md hover:bg-zinc-200 ${
              activeFilter === item.id && "!bg-purple-600 rounded-md text-white"
            }`}
            onClick={() => handleButton(item)}
          >
            {item.label}
          </button>
        </div>
      );
    });
  }

  const handleButton = async (item) => {
    console.log(item.id);
    if (item?.id) {
      setActiveFilter(item?.id);
      setLabel(item.label);
      setIsOpenFilterMobile(!isOpenFilterMobile);
      setSort({
        sortBy: item?.sortBy,
        sort: item.sort,
      });
    }
    if (item.id === activeFilter) {
      setSort("");
      setActiveFilter("");
    }
  };

  const handleFilterPrice = (item) => {
    setActivePrice(item.type);
    if (item.type === activePrice) {
      setActivePrice("");
    }
  };

  const handleFilterBrand = (item) => {
    setActiveBrand(item._id);
    if (item._id === activeBrand) {
      setActiveBrand(null);
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
                            activePrice === item.type &&
                            "bg-purple-600 rounded-md text-white"
                          }`}
                          onClick={() => {
                            handleFilterPrice(item);
                          }}
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
                        <div
                          onClick={() => {
                            handleFilterBrand(item);
                          }}
                        >
                          <button
                            className={`item inline-block w-full !py-2 text-left${
                              activeBrand === item._id &&
                              "border bg-purple-600 rounded-md text-white"
                            }`}
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
                <div className="fixed top-0 right-0 left-0 z-[4] bg-white py-3 shadow-sm px-4 md:hidden">
                  <div className="flex justify-between">
                    <div
                      className="flex items-center gap-1"
                      onClick={() => setIsOpenFilterMobile(!isOpenFilterMobile)}
                    >
                      <h1 className="mb-0 text-base">{label}</h1>
                      <CaretDownOutlined />
                    </div>
                    <div
                      className="flex items-center gap-1"
                      onClick={() => setIsToggleContent(!isToggleContent)}
                    >
                      <h1 className="mb-0 text-base">Bộ lọc</h1>
                      <FilterOutlined />
                    </div>
                  </div>
                  <div
                    className={
                      !isToggleContent
                        ? "content-typepro content-bg"
                        : "content-typepro visible content-bg"
                    }
                  >
                    <div className="p-5">
                      <div>
                        <h1 className="text-xl">Theo giá</h1>
                        {items.map((item) => {
                          return (
                            <div
                              className={`item inline-block mr-2 mb-2 ${
                                activePrice === item.type &&
                                "bg-purple-600 rounded-md text-white"
                              }`}
                              onClick={() => {
                                handleFilterPrice(item);
                                setIsToggleContent(!isToggleContent);
                              }}
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
                      <div>
                        <h1 className="text-xl">Thương hiệu</h1>
                        {Array.isArray(brandsOfType) &&
                          brandsOfType?.map((item) => {
                            return (
                              <div
                                onClick={() => {
                                  setActiveBrand(item._id);
                                  setIsToggleContent(!isToggleContent);
                                }}
                              >
                                <button
                                  className={`item inline-block w-full !py-2 text-left${
                                    activeBrand === item._id &&
                                    "border bg-purple-600 rounded-md text-white"
                                  }`}
                                  onClick={() => handleFilterBrand(item?.name)}
                                >
                                  {item?.name}
                                </button>
                              </div>
                            );
                          })}
                      </div>

                      {/* <div className="grid grid-cols-2 max-h-[80vh] overflow-auto scrollbar-item">
                        <TypeProduct
                          items={typeProduct}
                          // thumbnail={thumb}
                          handleToggleClassContent={handleToggleClassContent}
                        />
                      </div> */}
                    </div>
                  </div>
                  {isOpenFilterMobile && (
                    <div className="w-full mt-3">
                      <ul>
                        {itemsFilter.map((item) => {
                          return (
                            <li
                              className="py-2 border-b-[1px] w-full flex items-center justify-between"
                              onClick={() => handleButton(item)}
                            >
                              <span>{item.label}</span>
                              {activeFilter === item.id && (
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
                    <span className="font-medium md:block md:text-base">
                      Sắp xếp theo:
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
                <div className="mt-1 md:mt-0 grid gap-3 p-4 md:p-0 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
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
