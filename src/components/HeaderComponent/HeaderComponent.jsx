import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Popover } from "antd";
// import Search from "antd/lib/transfer/search";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperHeaderAccountText,
} from "./style";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlice";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlice";
import { HomeOutlined } from "@ant-design/icons";
function HeaderComponent() {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const order = useSelector((state) => state.order);
  const [searchText, setSearchText] = useState("");
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  console.log(pathname);

  const handleNavigate = () => {
    navigate("/sign-in");
  };

  console.log({ active });

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    dispatch(searchProduct(searchText));
  };

  console.log({ user });

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const content = (
    <div>
      <WrapperContentPopup
        onClick={() => {
          navigate("/profile-user");
        }}
      >
        Thông tin tài khoản
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
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader
        className={pathname === "/order" ? "!hidden md:!flex" : "flex"}
      >
        <Col span={4}>
          <span className="hidden md:block">Logo nhe anh em</span>
        </Col>
        <Col
          span={8}
          className="flex-none md:flex-initial max-w-none m-auto md:m-0"
        >
          <ButtonInputSearch
            border="none"
            placeholder="Tìm sản phẩm "
            textButton="Tìm kiếm"
            enterButton="Search"
            size="large"
            onChange={onSearch}
            onClick={handleSearch}
          />
        </Col>
        <Col
          className="flex flex-none justify-center gap-3 md:justify-end max-w-none md:flex-auto fixed md:static bottom-0 left-0 right-0 bg-white z-10"
          span={10}
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
          <Loading isLoading={loading}>
            <WrapperHeaderAccount className="flex-col md:flex-row gap-1 md:gap-2">
              {userAvatar ? (
                <img
                  src={userAvatar}
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

              {user?.access_token ? (
                <>
                  <Popover
                    trigger="click"
                    content={content}
                    style={{ padding: "0px" }}
                  >
                    <span className="text-sm md:text-base cursor-pointer">
                      Tài khoản
                    </span>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigate}>
                  <span className="text-sm md:text-base cursor-pointer">
                    Tài khoản
                  </span>
                </div>
              )}
            </WrapperHeaderAccount>
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
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;
