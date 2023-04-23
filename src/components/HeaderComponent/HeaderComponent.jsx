import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Popover } from "antd";
// import Search from "antd/lib/transfer/search";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperHeaderAccountText,
  WrapperHeaderCart,
  WrapperTextHeader,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlice";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlice";
function HeaderComponent() {
  const [loading, setLoading] = useState(false);
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
        <Col span={5}>
          <WrapperTextHeader>Logo nhe anh em</WrapperTextHeader>
        </Col>
        <Col span={12}>
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
          span={7}
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
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
                      {userName?.length ? userName : user.email}
                    </WrapperHeaderAccountText>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigate}>
                  <span>Tài khoản</span>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>
          <WrapperHeaderCart
            onClick={() => navigate("/order")}
            style={{ cursor: "pointer" }}
          >
            <Badge count={order?.orderItems?.length} size="small">
              <ShoppingCartOutlined
                style={{ fontSize: "22px", color: "rgb(128, 128, 137)" }}
              />
            </Badge>
            <WrapperTextHeader>Giỏ hàng</WrapperTextHeader>
          </WrapperHeaderCart>
        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent;
