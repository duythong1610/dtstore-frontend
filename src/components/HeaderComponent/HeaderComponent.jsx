import React, { useCallback, useEffect, useState } from "react";
import { Badge, Col, Popover, Row } from "antd";
import { WrapperContentPopup, WrapperHeaderAccount } from "./style";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  CloseCircleFilled,
  HomeOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as message from "../../components/Message/Message";
import * as UserService from "../../services/UserService";
import * as ProductService from "../../services/ProductService";

import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlice";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlice";
import AccountNavMobile from "../AccountNavMobile/AccountNavMobile";
import logo from "../../assets/img/logo.png";
import default_avatar from "../../assets/img/default_avatar.png";
import TypeProduct from "../TypeProduct/TypeProduct";
import { convertPrice } from "../../until";

function HeaderComponent() {
  const [loading, setLoading] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const [isToggleContent, setIsToggleContent] = useState(false);
  const [allProducts, setAllProducts] = useState();
  const [suggestions, setSuggestions] = useState([]);

  const [active, setActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState(false);
  const order = useSelector((state) => state.order);
  const [searchText, setSearchText] = useState("");
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const [typeProduct, setTypeProduct] = useState([]);
  const [userAvatar, setUserAvatar] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = () => {
    if (!user?.access_token) {
      navigate("/sign-in");
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    message.success("Đăng xuất thành công!");
    dispatch(resetUser());
    navigate("/");
    setLoading(false);
  };

  const onSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    const res = await ProductService.getAllProduct(value, 5);
    setSuggestions(res.data);
  };

  const handleSearch = () => {
    dispatch(searchProduct(searchText));
    setSearchText("");
  };

  const handleToggleClass = () => {
    setIsToggle((current) => !current);
  };

  const handleToggleClassContent = useCallback(() => {
    setIsToggleContent((current) => !current);
    setActiveCategory(true);
  }, [activeCategory]);

  const handleClearSearchText = () => {
    setSearchText("");
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    setTypeProduct(res.data);
    return res;
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const content = (
    <>
      {user.id && (
        <div className="hidden md:block">
          <WrapperContentPopup
            onClick={() => {
              navigate("/thong-tin-tai-khoan");
            }}
          >
            Thông tin tài khoản
          </WrapperContentPopup>

          <WrapperContentPopup
            onClick={() => {
              navigate("/don-hang-cua-toi", {
                state: { id: user?.id, token: user?.access_token },
              });
            }}
          >
            Đơn hàng của tôi
          </WrapperContentPopup>

          {user?.isAdmin && (
            <WrapperContentPopup
              onClick={() => {
                navigate("/system-admin");
              }}
            >
              Quản lý hệ thống
            </WrapperContentPopup>
          )}
          <WrapperContentPopup onClick={handleLogout}>
            Đăng xuất
          </WrapperContentPopup>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="bg-white sticky top-0 right-0 left-0 z-10 shadow-sm">
        <div className="h-0 md:h-full md:max-w-7xl md:m-auto md:py-3 bg-white">
          <Row
            className={
              pathname !== "/" &&
              pathname !== "/thong-tin-tai-khoan" &&
              !pathname.startsWith("/reset-password/") &&
              !pathname.startsWith("/san-pham/")
                ? "!hidden md:!flex md:items-center"
                : "md:flex flex-nowrap md:items-center md:w-7xl"
            }
          >
            <Col span={5} className="hidden md:block">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <span className="hidden md:block">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-12 h-12 object-contain "
                  />
                </span>
                <div className="text-center">
                  <span className="text-2xl !mb-0 text-purple-600 font-sigmar">
                    OTB16TH
                  </span>
                  <h1 className="text-sm -mt-2 !mb-0 text-zinc-400">
                    october16th.store
                  </h1>
                </div>
              </div>
            </Col>
            <Col span={10} className="relative hidden md:block">
              <ButtonInputSearch
                className={
                  pathname === "/thong-tin-tai-khoan" && pathname === "/"
                    ? "hidden md:block"
                    : "hidden md:block"
                }
                onClearSearchText={handleClearSearchText}
                searchText={searchText}
                border="none"
                placeholder="Bạn tìm sản phẩm gì... "
                textButton="Tìm kiếm"
                size="large"
                value={searchText}
                onChange={onSearch}
                onClick={handleSearch}
              />
              {searchText && (
                <ul className="absolute bg-white z-50 p-4 w-full shadow-lg rounded-md max-h-[50vh] overflow-auto">
                  {Array.isArray(suggestions) && suggestions.length > 0 && (
                    <h1 className="pl-2">
                      Hiển thị {suggestions.length} kết quả tìm kiếm
                    </h1>
                  )}
                  {searchText &&
                    (Array.isArray(suggestions) && suggestions.length > 0 ? (
                      suggestions.map((product) => (
                        <li
                          key={product._id}
                          className="cursor-pointer p-2 hover:bg-slate-100 rounded-md"
                          onClick={() => {
                            navigate(`/chi-tiet-san-pham/${product?._id}`);
                            setSearchText("");
                          }}
                        >
                          <div className="flex gap-2 items-center">
                            <div>
                              <img
                                src={product.image}
                                alt="product-image"
                                width={32}
                                height={32}
                                className="object-contain mix-blend-multiply"
                              />
                            </div>
                            <div>
                              <h1 className="mb-0">{product.name}</h1>
                              <p className="text-red-500 mb-0">
                                {convertPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <h1 className="text-center">
                        Không tìm thấy kết quả tương ứng
                      </h1>
                    ))}
                </ul>
              )}
            </Col>
            <Col
              className="flex flex-none justify-center md:gap-3 md:justify-end max-w-none md:flex-auto fixed md:static bottom-0 left-0 right-0 bg-white z-10"
              span={7}
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "flex-col md:flex-row text-purple-600 font-medium hover:text-purple-600 hover:md:bg-purple-100 rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2"
                    : "flex-col md:flex-row rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
                }
              >
                <HomeOutlined style={{ fontSize: "22px" }} />

                <span className="text-sm md:text-base">Trang chủ</span>
              </NavLink>
              <div
                onClick={handleToggleClassContent}
                className={
                  pathname.startsWith("/san-pham/")
                    ? "flex md:hidden flex-col md:flex-row text-purple-600 font-medium hover:text-purple-600 hover:md:bg-purple-100 rounded-xl px-4 py-2 items-center justify-center gap-1 md:gap-2"
                    : "flex md:hidden flex-col md:flex-row rounded-xl px-4 py-2 items-center justify-center gap-1 md:gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
                }
              >
                <AppstoreOutlined style={{ fontSize: "22px" }} />

                <span className="text-sm md:text-base">Danh mục</span>
              </div>
              <Loading isLoading={loading}>
                <div className="hidden md:block">
                  <Popover
                    trigger={["hover", "click"]}
                    content={content}
                    placement="bottom"
                    style={{ padding: "0px" }}
                    className="hidden md:block"
                  >
                    <WrapperHeaderAccount
                      className="flex-col md:flex-row gap-1 md:gap-2"
                      onClick={handleNavigate}
                    >
                      {userAvatar || user.id ? (
                        <img
                          src={userAvatar ? userAvatar : default_avatar}
                          alt="avatar"
                          style={{
                            height: "30px",
                            width: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        ></img>
                      ) : (
                        <UserOutlined style={{ fontSize: "22px" }} />
                      )}

                      <span
                        className={`text-base text-slate-500 cursor-pointer" ${
                          pathname === "/thong-tin-tai-khoan" &&
                          `!text-purple-600 font-medium`
                        }`}
                      >
                        Tài khoản
                      </span>
                    </WrapperHeaderAccount>
                  </Popover>
                </div>
                <div className="md:hidden">
                  <WrapperHeaderAccount
                    className="flex-col md:flex-row gap-1 md:gap-2"
                    onClick={handleToggleClass}
                  >
                    {userAvatar ? (
                      <img
                        src={userAvatar ? userAvatar : default_avatar}
                        alt="avatar"
                        style={{
                          height: "22px",
                          width: "22px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      ></img>
                    ) : (
                      <UserOutlined style={{ fontSize: "22px" }} />
                    )}

                    {user?.access_token ? (
                      <>
                        <span
                          className={`text-sm text-slate-500 cursor-pointer" ${
                            pathname === "/thong-tin-tai-khoan" &&
                            `!text-purple-600 font-medium`
                          }`}
                        >
                          Tài khoản
                        </span>
                      </>
                    ) : (
                      <div onClick={handleNavigate}>
                        <span className="text-sm md:text-base cursor-pointer">
                          Tài khoản
                        </span>
                      </div>
                    )}
                  </WrapperHeaderAccount>
                </div>
              </Loading>
              <NavLink
                to="/gio-hang"
                className={({ isActive }) =>
                  isActive
                    ? "flex-col md:flex-row text-purple-600 font-medium hover:text-purple-600 hover:bg-purple-100 rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2"
                    : "flex-col md:flex-row rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
                }
                //  active
                //    ? "text-purple-600 font-medium hover:text-purple-600 hover:bg-blue-200 rounded-xl px-4 py-2 flex items-center justify-center gap-2"
                //    : "rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200")
              >
                <Badge count={order?.orderItems?.length} size="small">
                  <ShoppingCartOutlined
                    className={
                      pathname === "/gio-hang"
                        ? "text-purple-600 font-medium hover:text-purple-600"
                        : "text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
                    }
                    style={{ fontSize: "22px" }}
                  />
                </Badge>

                <span className="text-sm md:text-base">Giỏ hàng</span>
              </NavLink>
            </Col>
          </Row>

          <div
            className={!isToggle ? "nav nav-black" : "nav visible nav-black"}
          >
            <div
              className={!isToggle ? "nav nav-pink" : "nav visible nav-pink"}
            >
              <div
                className={
                  !isToggle ? "nav nav-white relative" : "nav visible nav-white"
                }
              >
                <CloseCircleFilled
                  className="z-30 absolute top-2 right-5 text-zinc-300 w-5 h-5 text-2xl"
                  onClick={handleToggleClass}
                />
                <AccountNavMobile handleToggleClass={handleToggleClass} />
              </div>
            </div>
          </div>

          <div
            className={
              !isToggleContent
                ? "content-typepro content-bg"
                : "content-typepro visible content-bg"
            }
          >
            <CloseCircleFilled
              className="z-30 absolute top-2 right-5 text-zinc-300 w-5 h-5 text-2xl"
              onClick={handleToggleClassContent}
            />
            <div className="p-5">
              <h1 className="text-xl">Danh mục sản phẩm</h1>
              <div className="grid grid-cols-2 max-h-[80vh] overflow-auto scrollbar-item">
                <TypeProduct
                  items={typeProduct}
                  // thumbnail={thumb}
                  handleToggleClassContent={handleToggleClassContent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(HeaderComponent);
