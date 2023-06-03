import React, { useState } from "react";
import * as message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";

import {
  CheckCircleFilled,
  UserOutlined,
  EyeFilled,
  OrderedListOutlined,
  SettingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Loading from "../LoadingComponent/Loading";
import { resetUser } from "../../redux/slides/userSlice";

const AccountNavMobile = ({ handleToggleClass }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    handleToggleClass();
    message.success("Đăng xuất thành công!");
    dispatch(resetUser());
    setLoading(false);
  };

  const handleNavigate = (type) => {
    // if (type === "profile") {
    //   navigate("/profile-user");
    //   handleToggleClass();
    // }
    // if (type === "admin") {
    //   navigate("/system-admin");
    //   handleToggleClass();
    // }
    if (type === "don-hang-cua-toi") {
      navigate("/don-hang-cua-toi", {
        state: { id: user?.id, token: user?.access_token },
      });
      handleToggleClass();
    } else {
      navigate(type);
      handleToggleClass();
    }
  };
  return (
    <Loading isLoading={loading}>
      <div className="main h-auto md:h-screen">
        <div className="max-w-7xl m-auto">
          <div className="content pt-5 px-5 flex flex-col md:flex-row">
            <div className="content-left md:w-1/4 md:px-5">
              <div className="flex gap-5 mb-10">
                <img
                  src={user?.avatar}
                  alt="user-avatar"
                  className="w-20 rounded-full h-20"
                />
                <div className="info flex flex-col">
                  <span>Tài khoản của</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xl">{user?.name}</span>
                    {user?.isAdmin && (
                      <CheckCircleFilled className="text-blue-500" />
                    )}
                  </div>
                  <span>
                    Thành viên từ:{" "}
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="h-[70vh] flex flex-col justify-between">
                <ul>
                  {user?.isAdmin && (
                    <li
                      className="cursor-pointer"
                      onClick={() => handleNavigate("/system-admin")}
                    >
                      <div className="py-5 w-full hover:bg-gray-200 rounded-md flex items-center justify-between">
                        <div className="flex items-center justify-center gap-3">
                          <SettingOutlined />
                          <span>Quản lý hệ thống</span>
                        </div>
                        <RightOutlined className="md:hidden text-gray-500" />
                      </div>
                      <hr />
                    </li>
                  )}
                  <li
                    onClick={() => handleNavigate("/thong-tin-tai-khoan")}
                    className="cursor-pointer"
                  >
                    <div className="py-5 w-full hover:bg-gray-200 rounded-md flex items-center justify-between">
                      <div className="flex items-center justify-center gap-3">
                        <UserOutlined />
                        <span>Thông tin tài khoản</span>
                      </div>
                      <RightOutlined className="md:hidden text-gray-500" />
                    </div>
                    <hr />
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => handleNavigate("don-hang-cua-toi")}
                  >
                    <div className="py-5 w-full hover:bg-gray-200 rounded-md flex items-center justify-between">
                      <div className="flex items-center justify-center gap-3">
                        <OrderedListOutlined />
                        <span>Quản lý đơn hàng</span>
                      </div>
                      <RightOutlined className="md:hidden text-gray-500" />
                    </div>
                    <hr />
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => handleNavigate("san-pham-da-xem")}
                  >
                    <div className="py-5  w-full hover:bg-gray-200 rounded-md flex items-center justify-between">
                      <div className="flex items-center justify-center gap-3">
                        <EyeFilled className="text-gray-500" />
                        <span>Sản phẩm đã xem</span>
                      </div>
                      <RightOutlined className="md:hidden text-gray-500" />
                    </div>
                    <hr />
                  </li>
                  {/* <li
                    className="cursor-pointer"
                    onClick={() => handleNavigate("viewed-products")}
                  >
                    <div className="py-5  w-full hover:bg-gray-200 rounded-md flex items-center justify-between">
                      <div className="flex items-center justify-center gap-3">
                        <EyeFilled className="text-gray-500" />
                        <span>Yêu cầu xóa tài khoản</span>
                      </div>
                      <RightOutlined className="md:hidden text-gray-500" />
                    </div>
                    <hr />
                  </li> */}
                </ul>
                <button
                  onClick={handleLogout}
                  className="h-12 w-full bg-purple-600 text-sm font-medium text-white rounded-lg"
                  // onClick={handleUpdate}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default AccountNavMobile;
