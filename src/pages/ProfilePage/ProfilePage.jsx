import React, { useEffect, useState } from "react";
import { WrapperUploadFile } from "./style";

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
  EditOutlined,
  RightOutlined,
} from "@ant-design/icons";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserService.updateUser(id, rests, access_token);
  });

  const { data, isLoading, isSuccess, isError } = mutation;
  console.log({ data }, { user }, { mutation });
  useEffect(() => {
    setName(user?.name),
      setEmail(user?.email),
      setPhone(user?.phone),
      setAddress(user?.address),
      setAvatar(user?.avatar);
  }, [data, user]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(updateUser({ ...res?.data, access_token: access_token }));
  };
  const handleChangeName = (value) => {
    setName(value);
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
  };

  const handleChangePhone = (value) => {
    setPhone(value);
  };

  const handleChangeAddress = (value) => {
    setAddress(value);
  };

  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    console.log({ file }, { fileList });
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
    // handleUpdate();
  };

  console.log({ avatar });

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };
  return (
    <div className="main bg-gray-100 h-auto md:h-screen">
      <div className="max-w-7xl m-auto">
        {/* <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <WrapperContentProfile>
        <WrapperInput>
          <WrapperLabel htmlFor="name">Name</WrapperLabel>
          <InputForm
            id="name"
            style={{ width: "500px" }}
            value={name}
            onChange={handleChangeName}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="email">Email</WrapperLabel>
          <InputForm
            id="email"
            style={{ width: "500px" }}
            value={email}
            onChange={handleChangeEmail}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
          <InputForm
            id="phone"
            style={{ width: "500px" }}
            value={phone}
            onChange={handleChangePhone}
          />
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel htmlFor="address">Address</WrapperLabel>
          <InputForm
            id="address"
            style={{ width: "500px" }}
            value={address}
            onChange={handleChangeAddress}
          />
        </WrapperInput>

        <WrapperInput>
          <WrapperUploadFile maxCount={1} onChange={handleChangeAvatar}>
            {avatar ? (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
            ) : (
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/account/avatar.png"
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
            )}
          </WrapperUploadFile>
        </WrapperInput>
        <ButtonComponent
          onClick={handleUpdate}
          size={40}
          styleButton={{
            color: "rgb(26,148,255)",
            fontSize: "15px",
            fontWeight: "700",
            height: "30px",
            width: "fit-content",
            border: "1px solid rgb(26,148,255)",
            borderRadius: "4px",
            padding: "4px 8px",
          }}
          textButton={"Cập nhật"}
        />
      </WrapperContentProfile> */}

        <div className="content pt-5 px-5 flex flex-col md:flex-row">
          <div className="content-left md:w-1/4 md:px-5">
            <div className="flex gap-2 mb-3">
              <img
                src={user?.avatar}
                alt="user-avatar"
                className="w-10 rounded-full h-10"
              />
              <div className="info flex flex-col">
                <span>Tài khoản của</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{user?.name}</span>
                  {user?.isAdmin && (
                    <CheckCircleFilled className="text-blue-500" />
                  )}
                </div>
              </div>
            </div>
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
              </li>
            </ul>
          </div>
          <div className="content-right mb-[80px] w-full bg-white p-5 rounded-xl">
            <div className="text-center md:text-start">
              <h1 className="mb-5 text-lg md:text-xl">Thông tin tài khoản</h1>
            </div>
            <div className="info flex flex-col-reverse md:flex-row items-center">
              <div className="left md:border-r-[1px] md:pr-5 border-zinc-300 w-full">
                <div className="text-sm md:text-base">
                  <div className="form-control mb-5 flex items-center">
                    <label className="w-40 font-medium" htmlFor="name">
                      Họ và tên:
                    </label>
                    <input
                      className="px-3 py-2 outline-none rounded-lg border border-zinc-300 focus:border-blue-500  w-full"
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleChangeName}
                    />
                  </div>
                  <div className="form-control mb-5 flex items-center ">
                    <label className="w-40 font-medium" htmlFor="email">
                      Email:
                    </label>
                    <input
                      className="px-3 py-2 outline-none rounded-lg border border-zinc-300 focus:border-blue-500 w-full"
                      id="email"
                      type="text"
                      value={email}
                      onChange={handleChangeEmail}
                    />
                  </div>
                  <div className="form-control mb-5 flex items-center ">
                    <label className="w-40 font-medium" htmlFor="address">
                      Địa chỉ:
                    </label>
                    <input
                      className="px-3 py-2 outline-none rounded-lg border border-zinc-300 focus:border-blue-500  w-full"
                      id="address"
                      type="text"
                      value={address}
                      onChange={handleChangeAddress}
                    />
                  </div>

                  <div className="form-control mb-5 flex items-center">
                    <label className="w-40 font-medium" htmlFor="phone">
                      Số điện thoại:
                    </label>
                    <input
                      className="px-3 py-2 outline-none rounded-lg border border-zinc-300 focus:border-blue-500 w-full"
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={handleChangePhone}
                    />
                  </div>
                </div>
                <div className="text-end">
                  <button
                    className="py-2 w-full bg-blue-600 text-sm md:text-base font-medium text-white h-10 md:w-1/4 rounded-lg"
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>

              <div className="right w-full">
                <div className="text-center mb-5">
                  <WrapperUploadFile
                    className="relative"
                    maxCount={1}
                    onChange={handleChangeAvatar}
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        style={{
                          height: "100px",
                          width: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        alt="avatar"
                      />
                    ) : (
                      <img
                        src="https://frontend.tikicdn.com/_desktop-next/static/img/account/avatar.png"
                        style={{
                          height: "100px",
                          width: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        alt="avatar"
                      />
                    )}
                    <EditOutlined className="absolute flex items-center justify-center right-2 bottom-2 w-6 h-6 text-white  bg-slate-600 text-sm rounded-full" />
                  </WrapperUploadFile>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
