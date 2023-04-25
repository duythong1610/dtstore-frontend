import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Popover } from "antd";
// import Search from "antd/lib/transfer/search";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperHeaderAccountText,
  WrapperHeaderCart,
  WrapperHeaderHome,
  WrapperHeaderHomeText,
  WrapperTextHeader,
} from "./style";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { NavLink, useNavigate } from "react-router-dom";
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
      <WrapperHeader>
        <Col span={4}>
          <WrapperTextHeader>Logo nhe anh em</WrapperTextHeader>
        </Col>
        <Col span={11}>
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
          span={9}
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium hover:text-blue-600 hover:bg-blue-200 rounded-xl px-4 py-2 flex items-center justify-center gap-2"
                : "rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
            }
          >
            <HomeOutlined style={{ fontSize: "22px" }} />

            <WrapperHeaderHomeText>Trang chủ</WrapperHeaderHomeText>
          </NavLink>
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
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
                    <WrapperHeaderAccountText
                      style={{ cursor: "pointer", fontSize: "16px" }}
                    >
                      Tài khoản
                    </WrapperHeaderAccountText>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigate}>
                  <WrapperHeaderAccountText
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    Tài khoản
                  </WrapperHeaderAccountText>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              setActive(isActive) ?? active
                ? "text-blue-600 font-medium hover:text-blue-600 hover:bg-blue-200 rounded-xl px-4 py-2 flex items-center justify-center gap-2"
                : "rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-500 hover:bg-zinc-200"
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

            <WrapperTextHeader>Giỏ hàng</WrapperTextHeader>
          </NavLink>
        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;
