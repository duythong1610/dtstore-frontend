import React, { useEffect, useState } from "react";
import { Badge, Col, Popover, Row } from "antd";
// import Search from "antd/lib/transfer/search";
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

function HeaderComponent() {
  const [loading, setLoading] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const [isToggleContent, setIsToggleContent] = useState(false);

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
    setLoading(false);
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    dispatch(searchProduct(searchText));
  };

  const handleToggleClass = () => {
    setIsToggle((current) => !current);
  };

  const handleToggleClassContent = () => {
    setIsToggleContent((current) => !current);
    setActiveCategory((current) => !current);
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
    <div className="hidden md:block">
      <WrapperContentPopup
        onClick={() => {
          navigate("/profile-user");
        }}
      >
        Thông tin tài khoản
      </WrapperContentPopup>

      <WrapperContentPopup
        onClick={() => {
          navigate("/my-order", {
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
  );

  return (
    <>
      <div className="bg-white">
        <div className="h-0 md:h-full md:max-w-7xl md:m-auto md:py-3 bg-white">
          <Row
            className={
              pathname !== "/" &&
              pathname !== "/profile-user" &&
              !pathname.startsWith("/product/")
                ? "!hidden md:!flex md:items-center"
                : "md:flex flex-nowrap md:items-center md:w-7xl"
            }
          >
            <Col span={4}>
              <span className="hidden md:block">
                <img
                  onClick={() => navigate("/")}
                  src={logo}
                  alt="logo"
                  className="w-16 h-16 object-contain cursor-pointer"
                />
              </span>
            </Col>
            <Col
              span={11}
              // className="flex-none md:flex-initial m-auto md:m-0"
            >
              <ButtonInputSearch
                className={
                  pathname === "/profile-user" && pathname === "/"
                    ? "hidden md:block"
                    : "hidden md:block"
                }
                border="none"
                placeholder="Bạn tìm sản phẩm gì... "
                textButton="Tìm kiếm"
                enterButton="Search"
                size="large"
                onChange={onSearch}
                onClick={handleSearch}
              />
            </Col>
            <Col
              className="flex flex-none justify-center md:gap-3 md:justify-end max-w-none md:flex-auto fixed md:static bottom-0 left-0 right-0 bg-white z-10"
              span={7}
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "flex-col md:flex-row text-blue-600 font-medium hover:text-blue-600 hover:bg-blue-200 rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2"
                    : "flex-col md:flex-row rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
                }
              >
                <HomeOutlined style={{ fontSize: "22px" }} />

                <span className="text-sm md:text-base">Trang chủ</span>
              </NavLink>
              <NavLink
                onClick={handleToggleClassContent}
                className={
                  activeCategory
                    ? "flex md:hidden flex-col md:flex-row text-blue-600 font-medium hover:text-blue-600 hover:bg-blue-200 rounded-xl px-4 py-2 items-center justify-center gap-1 md:gap-2"
                    : "flex md:hidden flex-col md:flex-row rounded-xl px-4 py-2 items-center justify-center gap-1 md:gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
                }
              >
                <AppstoreOutlined style={{ fontSize: "22px" }} />

                <span className="text-sm md:text-base">Danh mục</span>
              </NavLink>
              <Loading isLoading={loading}>
                <div className="hidden md:block">
                  <Popover
                    trigger="click"
                    content={content}
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

                      <span className="text-base cursor-pointer">
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
                        <span className="text-sm md:text-base md:hidden cursor-pointer">
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
                to="/order"
                className={({ isActive }) =>
                  setActive(isActive) ?? active
                    ? "flex-col md:flex-row text-blue-600 font-medium hover:text-blue-600 hover:bg-blue-200 rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2"
                    : "flex-col md:flex-row rounded-xl px-4 py-2 flex items-center justify-center gap-1 md:gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
                }
                //  active
                //    ? "text-blue-600 font-medium hover:text-blue-600 hover:bg-blue-200 rounded-xl px-4 py-2 flex items-center justify-center gap-2"
                //    : "rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200")
              >
                <Badge count={order?.orderItems?.length} size="small">
                  <ShoppingCartOutlined
                    className={
                      active
                        ? "text-blue-600 font-medium hover:text-blue-600"
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
              <div className="grid grid-cols-2">
                {typeProduct.map((item, index) => {
                  return (
                    <TypeProduct
                      key={index}
                      name={item}
                      // thumbnail={thumb}
                      handleToggleClassContent={handleToggleClassContent}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderComponent;
