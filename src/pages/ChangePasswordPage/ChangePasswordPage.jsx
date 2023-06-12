import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import {
  FormControl,
  FormLabel,
  Icon,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  UserOutlined,
  EyeFilled,
  OrderedListOutlined,
  SettingOutlined,
  RightOutlined,
  LeftOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import Loading from "../../components/LoadingComponent/Loading";
import default_avatar from "../../assets/img/default_avatar.png";
import * as message from "../../components/Message/Message";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { resetUser } from "../../redux/slides/userSlice";

const ChangePasswordPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  ({ bg: "gray.200" }), { bg: "whiteAlpha.300" };

  // Handle Logic
  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [isShowNewPassWord, setIsShowNewPassWord] = useState(false);
  const [isShowConfirmNewPassWord, setIsShowConfirmNewPassWord] =
    useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [error, setError] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    message.success("Hãy đăng nhập lại!");
    dispatch(resetUser());
    navigate("/");
  };

  useEffect(() => {
    let timer;
    if (isOpenModal) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown === 0) {
      // setIsOpenModal(false);
      handleLogout();
    }

    return () => clearInterval(timer);
  }, [isOpenModal, countdown]);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmNewPassword = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    console.log(name);
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "password":
          if (!value) {
            stateObj[name] = "Vui lòng nhập mật khẩu hiện tại.";
          }
          break;
        case "newPassword":
          if (!newPassword) {
            stateObj[name] = "Vui lòng nhập mật khẩu mới.";
          }
          break;

        case "confirmNewPassword":
          if (!confirmNewPassword) {
            stateObj[name] = "Vui lòng xác nhận lại mật khẩu mới.";
          } else if (newPassword !== confirmNewPassword) {
            stateObj["confirmNewPassword"] = "Mật khẩu không khớp.";
          } else {
            stateObj["confirmNewPassword"] = confirmNewPassword
              ? ""
              : error.confirmNewPassword;
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  console.log(error);

  const handleUpdate = async () => {
    const payload = {
      currentPassword: password,
      newPassword,
      confirmNewPassword,
      userId: user?.id,
    };
    setLoading(true);
    const res = await UserService.changePassword(payload, user?.access_token);
    if (res.status === "SUCCESS") {
      setIsOpenModal(true);
    }
    if (res.status === "ERROR") {
      message.error(res.message);
    }
    setLoading(false);

    return res;
  };

  const isValidButton =
    password.trim() === "" ||
    newPassword.trim() === "" ||
    confirmNewPassword.trim() === "";

  const checkPassword = () => {
    if (
      /\d/.test(newPassword) &&
      /[!@#$%]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword)
    )
      return true;
    else {
      return `Mật khẩu ít nhất 8 ký tự bao gồm số, chữ cái thường, chữ cái viết
    hoa, kí tự đặc biệt.`;
    }
  };

  console.log(checkPassword());
  return (
    // <Loading isLoading={loadingUpdate}>
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
                  to="/thong-tin-tai-khoan"
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
                  className="py-2 px-3 w-full bg-gray-200 rounded-md flex items-center justify-between"
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
            <div className="fixed flex items-center py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-10 bg-white">
              <div className="flex justify-center items-center">
                <LeftOutlined
                  onClick={() => navigate(-1)}
                  className={"w-8 h-8 text-lg text-blue-500 text-center"}
                />
              </div>
              <div className="text-center w-full mr-8">
                <h1 className="text-xl font-medium m-0">ĐỔI MẬT KHẨU</h1>
              </div>
            </div>
            <div className="hidden md:block text-start">
              <h1 className="mb-5 text-lg md:text-xl">Đổi mật khẩu</h1>
            </div>

            <div className="md:w-1/2 m-auto">
              <div className="text-sm md:text-base ">
                <Loading isLoading={loading}>
                  <FormControl>
                    <FormLabel
                      ms="4px"
                      fontSize="md"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Mật khẩu hiện tại
                      <Text color={brandStars} marginBottom="0px">
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup size="md">
                      <Input
                        name="password"
                        borderRadius={6}
                        onChange={handleChangePassword}
                        onBlur={validateInput}
                        isRequired={true}
                        fontSize="sm"
                        placeholder="Nhập mật khẩu hiện tại"
                        mb="24px"
                        size="md"
                        type={isShowPassWord ? "text" : "password"}
                        variant="auth"
                        value={password}
                      />
                      {/* <InputForm
                placeholder="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={handleChangePassword}
              /> */}
                      <InputRightElement display="flex" alignItems="center">
                        <Icon
                          color={textColorSecondary}
                          _hover={{ cursor: "pointer" }}
                          as={
                            isShowPassWord
                              ? RiEyeCloseLine
                              : MdOutlineRemoveRedEye
                          }
                          onClick={() => setIsShowPassWord(!isShowPassWord)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {error.password && (
                      <p className="-mt-5 text-xs text-purple-600">
                        {error.password}
                      </p>
                    )}
                    <FormLabel
                      ms="4px"
                      fontSize="md"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Mật khẩu mới
                      <Text color={brandStars} marginBottom="0px">
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup size="md">
                      <Input
                        name="newPassword"
                        borderRadius={6}
                        onChange={handleChangeNewPassword}
                        onBlur={validateInput}
                        isRequired={true}
                        fontSize="sm"
                        placeholder="Nhập mật khẩu mới"
                        mb="24px"
                        size="md"
                        type={isShowNewPassWord ? "text" : "password"}
                        variant="auth"
                        value={newPassword}
                      />
                      {/* <InputForm
                placeholder="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={handleChangePassword}
              /> */}
                      <InputRightElement display="flex" alignItems="center">
                        <Icon
                          color={textColorSecondary}
                          _hover={{ cursor: "pointer" }}
                          as={
                            isShowNewPassWord
                              ? RiEyeCloseLine
                              : MdOutlineRemoveRedEye
                          }
                          onClick={() =>
                            setIsShowNewPassWord(!isShowNewPassWord)
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                    {error.newPassword ? (
                      <p className="-mt-5 text-xs text-purple-600">
                        {error.newPassword}
                      </p>
                    ) : (
                      <p className="-mt-5 text-xs text-purple-600">
                        {checkPassword() ? checkPassword() : ""}
                      </p>
                    )}

                    <FormLabel
                      ms="4px"
                      fontSize="md"
                      fontWeight="500"
                      color={textColor}
                      display="flex"
                    >
                      Xác nhận mật khẩu mới
                      <Text color={brandStars} marginBottom="0px">
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup size="md">
                      <Input
                        name="confirmNewPassword"
                        borderRadius={6}
                        onChange={handleChangeConfirmNewPassword}
                        onBlur={validateInput}
                        isRequired={true}
                        fontSize="sm"
                        placeholder="Nhập lại mật khẩu mới"
                        mb="24px"
                        size="md"
                        type={isShowConfirmNewPassWord ? "text" : "password"}
                        variant="auth"
                        value={confirmNewPassword}
                      />
                      {/* <InputForm
                placeholder="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={handleChangePassword}
              /> */}
                      <InputRightElement display="flex" alignItems="center">
                        <Icon
                          color={textColorSecondary}
                          _hover={{ cursor: "pointer" }}
                          as={
                            isShowConfirmNewPassWord
                              ? RiEyeCloseLine
                              : MdOutlineRemoveRedEye
                          }
                          onClick={() =>
                            setIsShowConfirmNewPassWord(
                              !isShowConfirmNewPassWord
                            )
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                    {error.confirmNewPassword && (
                      <p className="-mt-5 text-xs text-purple-600">
                        {error.confirmNewPassword}
                      </p>
                    )}

                    <div className="text-end">
                      <button
                        type="submit"
                        className={
                          isValidButton
                            ? "py-2 mt-7 md:mt-0 w-full bg-zinc-400 text-sm md:text-base font-medium text-white h-10  rounded-lg cursor-not-allowed"
                            : "py-2 mt-7 md:mt-0 w-full bg-purple-600 text-sm md:text-base font-medium text-white h-10  rounded-lg"
                        }
                        disabled={isValidButton}
                        onClick={handleUpdate}
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </FormControl>
                </Loading>
                <ModalComponent
                  closable={false}
                  footer={null}
                  title={null}
                  open={isOpenModal}
                  // onOk={handleUpdateInfoUser}
                  className="custom-modal"
                >
                  <div className="text-center">
                    <CheckCircleOutlined className="text-6xl md:text-7xl mb-5 text-green-500" />
                    <h1 className="text-xl">Đổi mật khẩu thành công!</h1>
                    <p>Vui lòng đăng nhập lại sau {countdown} giây</p>
                  </div>
                </ModalComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </Loading>
  );
};

export default ChangePasswordPage;
