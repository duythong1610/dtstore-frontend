import React, { useEffect, useState } from "react";
import { WrapperAutoComplete, WrapperUploadFile } from "./style";
import storage from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  UnlockOutlined,
} from "@ant-design/icons";
import Loading from "../../components/LoadingComponent/Loading";
import default_avatar from "../../assets/img/default_avatar.png";
import { AutoComplete, Form } from "antd";
import InputComponent from "../../components/InputComponent/InputComponent";
import axios from "axios";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsRender, setDistrictsRender] = useState([]);
  const [userAvatarUpload, setUserAvatarUpload] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    phone: user?.phone || "",
    address: user?.address || "",
    district: user?.district || "",
    city: user?.city || "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.name) {
      const pageTitle = `Tài khoản | ${user?.name}`;
      document.title = pageTitle;
    }
  }, [user?.name]);

  useEffect(() => {
    setStateUserDetails({
      avatar: user?.avatar,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      district: user?.district,
      city: user?.city,
    });
  }, [user]);

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    const res = UserService.updateUser(id, rests, access_token);
    return res;
  });

  const { data, isLoading, isSuccess, isError } = mutation;

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
  // const handleChangeName = (e) => {
  //   setName(e.target.value);
  // };

  // const handleChangeEmail = (e) => {
  //   setEmail(e.target.value);
  // };

  // const handleChangePhone = (e) => {
  //   setPhone(e.target.value);
  // };

  // const handleChangeAddress = (e) => {
  //   setAddress(e.target.value);
  // };

  const handleOnChangeProvince = (data, option) => {
    setStateUserDetails({
      ...stateUserDetails,
      city: data,
    });

    const res = districts.filter((dis) => {
      return dis?.province_code === option?.code;
    });
    setDistrictsRender(res);
  };

  const handleOnChangeDistrict = (data) => {
    setStateUserDetails({
      ...stateUserDetails,
      district: data,
    });
  };

  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setUserAvatarUpload(file.originFileObj);
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };

  const fetchProvince = async () => {
    const res = await axios.get("https://provinces.open-api.vn/api/");
    setProvinces(res.data);
  };

  const fetchDistrict = async () => {
    const res = await axios.get("https://provinces.open-api.vn/api/d");
    setDistricts(res.data);
  };

  useEffect(() => {
    fetchProvince();
    fetchDistrict();
  }, []);

  const province = provinces.map((pro) => {
    return { value: pro?.name, code: pro.code };
  });

  const district = districtsRender?.map((dis) => {
    return { value: dis?.name };
  });

  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true);
      const imageRef = ref(storage, `images/${userAvatarUpload.name}`);
      let imageURL;
      if (userAvatarUpload) {
        await uploadBytes(imageRef, userAvatarUpload);
        imageURL = await getDownloadURL(imageRef);
      }
      mutation.mutate({
        id: user?.id,
        email: stateUserDetails?.email,
        name: stateUserDetails?.name,
        phone: stateUserDetails?.phone,
        address: stateUserDetails?.address,
        district: stateUserDetails?.district,
        city: stateUserDetails?.city,
        avatar: imageURL ?? user?.avatar,
        access_token: user?.access_token,
      });
      setLoadingUpdate(false);
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh và lấy URL:", error);
    }
  };

  return (
    <div className="main h-auto">
      <div className="max-w-7xl m-auto min-h-[80vh]">
        <div className="content gap-5 pt-16 md:py-5 px-5 md:px-0 flex flex-col md:flex-row md:h-[80vh]">
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
            <ul className="grid gap-2">
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
                  className="py-2 px-3 w-full bg-gray-200 rounded-md flex items-center justify-between"
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
                  to="/don-hang-cua-toi"
                  state={{ id: user?.id, token: user?.access_token }}
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
                  to="/san-pham-da-xem"
                  className="py-2 px-3 w-full hover:bg-gray-200 rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center justify-center gap-3">
                    <EyeFilled className="text-gray-500" />
                    <span>Sản phẩm đã xem</span>
                  </div>
                  <RightOutlined className="md:hidden text-gray-500" />
                </Link>
              </li>

              <li>
                <Link
                  to="/doi-mat-khau"
                  className="py-2 px-3 w-full hover:bg-gray-200 rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center justify-center gap-3">
                    <UnlockOutlined className="text-gray-500" />
                    <span>Đổi mật khẩu</span>
                  </div>
                  <RightOutlined className="md:hidden text-gray-500" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="content-right mb-[80px] md:mb-0 w-full bg-white p-5 rounded-xl">
            <div className="relative z-[11]"></div>

            <div className="fixed flex items-center py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-[1] bg-white">
              <div className="flex justify-center items-center">
                <LeftOutlined
                  onClick={() => navigate(-1)}
                  className={"w-8 h-8 text-lg text-blue-500 text-center"}
                />
              </div>
              <div className="text-center w-full mr-8">
                <h1 className="text-xl font-medium m-0">THÔNG TIN TÀI KHOẢN</h1>
              </div>
            </div>
            <div className="hidden md:block text-start">
              <h1 className="mb-5 text-lg md:text-xl">Thông tin tài khoản</h1>
            </div>
            <div className="info flex flex-col-reverse md:flex-row items-center">
              <div className="left md:border-r-[1px] md:pr-5 border-zinc-300 w-full">
                <div className="text-sm md:text-base">
                  <Loading isLoading={loadingUpdate}>
                    <Form
                      name="basic"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      onFinish={handleUpdate}
                      autoComplete="on"
                      form={form}
                    >
                      <Form.Item
                        className="font-medium p-0"
                        label="Email"
                        // name="email"
                      >
                        <InputComponent
                          value={stateUserDetails.email}
                          onChange={handleOnchangeDetails}
                          name="email"
                          disabled
                          className="!text-black !border-[#E0E5F2] !h-10"
                        />
                      </Form.Item>
                      <Form.Item
                        className="font-medium p-0"
                        label="Họ và tên"
                        // name="name"
                      >
                        <InputComponent
                          value={stateUserDetails.name}
                          onChange={handleOnchangeDetails}
                          name="name"
                          className="!text-black !border-[#E0E5F2] !h-10 "
                        />
                      </Form.Item>

                      <Form.Item
                        className="font-medium p-0"
                        label="Số điện thoại"
                        // name="phone"
                      >
                        <InputComponent
                          value={stateUserDetails.phone}
                          onChange={handleOnchangeDetails}
                          name="phone"
                          className="!text-black !border-[#E0E5F2] !h-10"
                        />
                      </Form.Item>

                      <Form.Item
                        className="font-medium p-0"
                        label="Tỉnh, thành phố"
                        // name="city"
                      >
                        <WrapperAutoComplete
                          options={province}
                          placeholder="Chọn tỉnh, thành phố"
                          filterOption={(inputValue, option) =>
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                          onChange={handleOnChangeProvince}
                          value={stateUserDetails["city"]}
                          name="city"
                          className="!text-black !border-[#E0E5F2] !h-10"
                        />
                      </Form.Item>
                      <Form.Item
                        className="font-medium p-0"
                        label="Quận, huyện"
                        // name="district"
                      >
                        <WrapperAutoComplete
                          options={district}
                          placeholder="Chọn quận, huyện"
                          filterOption={(inputValue, option) =>
                            option.value
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                          onChange={handleOnChangeDistrict}
                          value={stateUserDetails["district"]}
                          name="district"
                          className="!text-black !border-[#E0E5F2] !h-10"
                        />
                      </Form.Item>
                      <Form.Item
                        className="font-medium p-0"
                        label="Địa chỉ"
                        // name="address"
                      >
                        <InputComponent
                          value={stateUserDetails.address}
                          onChange={handleOnchangeDetails}
                          name="address"
                          className="!text-black !border-[#E0E5F2] !h-10"
                        />
                      </Form.Item>

                      <div className="text-end">
                        <button
                          type="submit"
                          className="py-2 mt-7 md:mt-0 w-full bg-purple-600 text-sm md:text-base font-medium text-white h-10 md:w-1/3 rounded-lg"
                        >
                          Cập nhật
                        </button>
                      </div>
                    </Form>
                  </Loading>

                  {/* <div className="form-control mb-5 flex items-center ">
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
                    </div> */}

                  {/* <div className="form-control mb-5 flex items-center">
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
                    </div> */}
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
                      src={stateUserDetails?.avatar || default_avatar}
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
  );
};

export default ProfilePage;
