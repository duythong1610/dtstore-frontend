import React, { useEffect, useState } from "react";
import { WrapperUploadFile } from "./style";

import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlice";
import { getBase64 } from "../../until";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleFilled,
  UserOutlined,
  EyeFilled,
  OrderedListOutlined,
  SettingOutlined,
  EditOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import Loading from "../../components/LoadingComponent/Loading";
import default_avatar from "../../assets/img/default_avatar.png";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [district, setDistrict] = useState(user?.district || "");
  const [city, setCity] = useState(user?.city || "");
  const [avatar, setAvatar] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.name) {
      const pageTitle = `Tài khoản - ${user?.name}`;
      document.title = pageTitle;
    }
  }, [user?.name]);

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserService.updateUser(id, rests, access_token);
  });

  const { data, isLoading, isSuccess, isError } = mutation;
  useEffect(() => {
    setName(user?.name),
      setEmail(user?.email),
      setPhone(user?.phone),
      setAddress(user?.address),
      setDistrict(user?.district),
      setCity(user?.city),
      setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success("Cập nhật thành công");
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error("Cập nhật thông tin thất bại");
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(updateUser({ ...res?.data, access_token: access_token }));
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleChangeDistrict = (e) => {
    setDistrict(e.target.value);
  };
  const handleChangeCity = (e) => {
    setCity(e.target.value);
  };

  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      district,
      city,
      avatar,
      access_token: user?.access_token,
    });
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="main h-auto">
        <div className="max-w-7xl m-auto">
          <div className="content gap-5 pt-16 md:py-5 px-5 md:px-0 flex flex-col md:flex-row">
            <div className="content-left md:w-1/4 md:p-5 rounded-xl hidden md:block bg-white">
              <div className="flex gap-2 mb-3">
                <img
                  src={user?.avatar || default_avatar}
                  alt="user-avatar"
                  className="w-10 rounded-full h-10"
                />
                <div className="info flex flex-col">
                  <span>Tài khoản của</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {user?.name || "Chưa cập nhật tên"}
                    </span>
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
                    to="/my-order"
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
                    to="/viewed-products"
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
            <div className="content-right mb-[80px] md:mb-0 w-full bg-white p-5 rounded-xl">
              <div className="fixed flex items-center py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-10 bg-white">
                <div className="flex justify-center items-center">
                  <LeftOutlined
                    onClick={() => navigate(-1)}
                    className={"w-8 h-8 text-lg text-blue-500 text-center"}
                  />
                </div>
                <div className="text-center w-full mr-8">
                  <h1 className="text-xl font-medium m-0">
                    THÔNG TIN TÀI KHOẢN
                  </h1>
                </div>
              </div>
              <div className="hidden md:block text-start">
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

                    <div className="form-control mb-5 flex items-center ">
                      <label className="w-40 font-medium" htmlFor="address">
                        Quận, huyện:
                      </label>
                      <input
                        className="px-3 py-2 outline-none rounded-lg border border-zinc-300 focus:border-blue-500  w-full"
                        id="address"
                        type="text"
                        value={district}
                        onChange={handleChangeDistrict}
                      />
                    </div>

                    <div className="form-control mb-5 flex items-center ">
                      <label className="w-40 font-medium" htmlFor="address">
                        Thành phố:
                      </label>
                      <input
                        className="px-3 py-2 outline-none rounded-lg border border-zinc-300 focus:border-blue-500  w-full"
                        id="address"
                        type="text"
                        value={city}
                        onChange={handleChangeCity}
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
                      className="py-2 mt-7 md:mt-0 w-full bg-blue-600 text-sm md:text-base font-medium text-white h-10 md:w-1/3 rounded-lg"
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
                      <img
                        src={avatar || default_avatar}
                        style={{
                          height: "150px",
                          width: "150px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        alt="avatar"
                      />

                      <EditOutlined className="absolute flex items-center justify-center right-2 bottom-2 w-6 h-6 text-white  bg-slate-600 text-sm rounded-full" />
                    </WrapperUploadFile>
                    <div className="hidden md:block">
                      <h1>Dung lượng file tối đa 1 MB</h1>
                      <div>
                        <span className="font-medium">Định dạng: </span>{" "}
                        <span>.JPEG, .PNG</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default ProfilePage;
