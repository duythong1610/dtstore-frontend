import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlice";
import { getBase64 } from "../../until";
import { Link } from "react-router-dom";
import {
  CheckCircleFilled,
  UserOutlined,
  EyeFilled,
  OrderedListOutlined,
  SettingOutlined,
  RightOutlined,
} from "@ant-design/icons";

const AccountNavMobile = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="main h-auto md:h-screen">
      <div className="max-w-7xl m-auto">
        <div className="content pt-5 px-5 flex flex-col md:flex-row">
          <div className="content-left md:w-1/4 md:px-5">
            <div className="flex gap-2 mb-10">
              <img
                src={user?.avatar}
                alt="user-avatar"
                className="w-20 rounded-full h-20"
              />
              <div className="info flex flex-col">
                <span>Tài khoản của</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{user?.name}</span>
                  {user?.isAdmin && (
                    <CheckCircleFilled className="text-blue-500" />
                  )}
                </div>
                <span>
                  Thành viên từ {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="h-[80vh] flex flex-col justify-between">
              <ul>
                {user?.isAdmin && (
                  <li>
                    <Link
                      to="/system-admin"
                      className="py-2 px-3 w-full hover:bg-gray-200 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <SettingOutlined />
                        <span>Quản lý hệ thống</span>
                      </div>
                      <RightOutlined className="md:hidden text-gray-500" />
                    </Link>
                    <hr />
                  </li>
                )}
                <li>
                  <Link
                    to=""
                    className="py-2 px-3 w-full hover:bg-gray-200 rounded-md flex items-center justify-between"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <UserOutlined />
                      <span>Thông tin tài khoản</span>
                    </div>
                    <RightOutlined className="md:hidden text-gray-500" />
                  </Link>
                  <hr />
                </li>
                <li>
                  <Link
                    to=""
                    className="py-2 px-3 w-full hover:bg-gray-200 rounded-md flex items-center justify-between"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <OrderedListOutlined />
                      <span>Quản lý đơn hàng</span>
                    </div>
                    <RightOutlined className="md:hidden text-gray-500" />
                  </Link>
                  <hr />
                </li>
                <li>
                  <Link
                    to=""
                    className="py-2 px-3 w-full hover:bg-gray-200 rounded-md flex items-center justify-between"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <EyeFilled className="text-gray-500" />
                      <span>Sản phẩm đã xem</span>
                    </div>
                    <RightOutlined className="md:hidden text-gray-500" />
                  </Link>
                  <hr />
                </li>
              </ul>
              <button
                className="py-2 w-full bg-blue-600 text-sm md:text-base font-medium text-white h-10 md:w-1/4 rounded-lg"
                // onClick={handleUpdate}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountNavMobile;
