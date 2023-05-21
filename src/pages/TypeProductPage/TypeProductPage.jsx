import React from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Pagination, Slider } from "antd";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import { CloseCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { convertPrice } from "../../until";

function TypeProductPage() {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState("");
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

  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(type, page, limit);
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
    console.log(res);
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, paginate.page, paginate.limit);
    }
  }, [state]);

  const onChange = (current, pageSize) => {
    console.log(current, pageSize);
    setPaginate({ ...paginate, page: current, limit: pageSize });
  };

  console.log(paginate);
  console.log(products);
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

  console.log({ minValue }, { maxValue });

  const itemsFilter = [
    {
      label: "Giá",
      type: "price",
    },
    {
      label: "Tên",
      type: "name",
    },
    {
      label: "Đánh giá",
      type: "rating",
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
            className={`py-1 px-5 border border-gray-300 rounded-md ${
              activeFilter === item.type && "!border-blue-500 rounded-md"
            }`}
            onClick={() => handleButton(item.type)}
          >
            {item.label}
          </button>
        </div>
      );
    });
  }

  function renderItem(type) {
    if (type === "price") {
      return (
        <div>
          {items.map((item) => {
            return (
              <div
                className={`item inline-block mr-2 mb-2 ${
                  active === item.type && "border border-blue-500 rounded-md"
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
          <div className="flex gap-5 justify-between">
            <button
              onClick={() => {
                setActive(false);
                setMinValue(300000);
                setMaxValue(50000000);
                fetchProductType(state, paginate.page, paginate.limit);
              }}
              className="px-3 py-1 border border-blue-500 rounded-md font-medium text-red-400 w-1/2"
            >
              Bỏ chọn
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium w-1/2"
              // onClick={handleViewResult}
            >
              Xem {productsViews.length} kết quả
            </button>
          </div>
        </div>
      );
    }
    if (type === "name") {
      return <div>Hello Quý Dị</div>;
    }

    if (type === "rating") {
      return <div>Hello Quý Dị rating</div>;
    }
  }

  const handleButton = (type) => {
    if (type === "price") {
      setIsToggle(type);
      setActiveFilter(type);
    }
    if (type === "name") {
      setIsToggle(type);
      setActiveFilter(type);
    }
    if (type === "rating") {
      setIsToggle(type);
      setActiveFilter(type);
    }
  };

  console.log({ active }, { activeFilter });
  return (
    <Loading isLoading={loading}>
      <div className="bg-slate-100">
        <div className="max-w-7xl m-auto">
          <div className="relative">
            <div className="filter fixed md:static top-0 left-0 right-0 bg-white md:bg-transparent z-10 md:py-5 md:px-0 py-2 px-5">
              <div className="flex items-center gap-2">
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
            </div>
            <div
              className={`hidden w-screen h-[45vh] p-5 fixed md:shadow-xl md:absolute md:h-auto md:!w-[30vw] md:rounded-xl top-11 md:top-[71px] left-0 right-0 z-10 bg-white ${
                isToggle && "!block"
              } `}
            >
              <div className="text-right -mt-5">
                <CloseCircleOutlined
                  className="text-zinc-300 w-5 h-5 text-2xl"
                  onClick={() => setIsToggle("")}
                />
              </div>
              {renderItem(activeFilter)}
            </div>
          </div>
          <div className="min-h-[912px] pt-5 md:pt-0">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="mt-6 md:mt-0 grid gap-3 p-5 md:p-0 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {productsViews.length > 0 &&
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
    </Loading>
  );
}

export default TypeProductPage;
