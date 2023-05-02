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
import { CloseCircleOutlined } from "@ant-design/icons";

function TypeProductPage() {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState("");
  const [productsViews, setProductsView] = useState("");
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
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
    setPaginate({ ...paginate, page: current - 1, limit: pageSize });
  };

  const handleSearchPrice = (type) => {
    let result;
    switch (type) {
      case "2to4":
        result = products.filter((item) => {
          return item.price >= 2000000 && item.price <= 4000000;
        });
        return setProductsView(result);
      case "4to7":
        result = products.filter((item) => {
          return item.price >= 4000000 && item.price <= 7000000;
        });
        return setProductsView(result);
      case "7to13":
        result = products.filter((item) => {
          return item.price >= 7000000 && item.price <= 13000000;
        });
        return setProductsView(result);
      case "13to20":
        result = products.filter((item) => {
          return item.price >= 13000000 && item.price <= 20000000;
        });
        return setProductsView(result);
      case "20upto":
        result = products.filter((item) => {
          return item.price >= 20000000;
        });
        return setProductsView(result);

      default:
        console.log("hhh");
    }
  };

  console.log({ products }, { productsViews });

  const handleSliderPrice = (value) => {
    setProductsView(products);
    setMinValue(value[0]);
    setMaxValue(value[1]);
    const productFilter = products.filter((item) => {
      return item.price >= minValue + "000" && item.price <= maxValue + "000";
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
              min={300}
              max={40000}
              range
              defaultValue={[300, 40000]}
              onChange={handleSliderPrice}
              tooltip={false}
            />
          </div>
          <div className="flex gap-5 justify-between">
            <button
              onClick={() => {
                setActive(false);
                fetchProductType(state, paginate.page, paginate.limit);
              }}
              className="px-3 py-1 border border-blue-500 rounded-md font-medium text-red-400 w-1/2"
            >
              Bỏ chọn
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium w-1/2">
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
      <div>
        <div className="max-w-7xl m-auto">
          <div
            style={{
              flexWrap: "nowrap",
              paddingTop: "10px",
              height: "calc(100% - 50px)",
            }}
          >
            <div className="relative md:pb-10">
              <div className="filter fixed md:absolute top-0 left-0 right-0 bg-white z-10 md:p-0 px-5 py-2">
                <div className="scroll-main overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
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
              <div
                className={`hidden w-screen h-[45vh] p-5 fixed md:shadow-xl md:absolute md:h-auto md:!w-[30vw] md:rounded-xl top-11 md:top-9 left-0 right-0 z-10 bg-white ${
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="mt-6 md:mt-0 grid gap-3 p-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-[80px]">
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

              <Pagination
                showQuickJumper
                defaultCurrent={paginate?.page + 1}
                total={paginate?.total}
                onChange={onChange}
                style={{ textAlign: "center", marginTop: "20px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default TypeProductPage;
