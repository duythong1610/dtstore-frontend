import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
// Custom components
import * as message from "../../components/Message/Message";

// // Assets

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";

import { Helmet } from "react-helmet";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
function ResetPasswordPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  console.log(email);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";

  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");

  const [show, setShow] = React.useState(false);
  const [messageError, setMessageError] = useState("");
  const handleClick = () => setShow(!show);

  // Handle Logic

  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isShowNewPassWord, setIsShowNewPassWord] = useState(false);
  const [isShowConfirmNewPassWord, setIsShowConfirmNewPassWord] =
    useState(false);
  const [tokenReset, setTokenReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  const [error, setError] = useState({
    token: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  useEffect(() => {
    let timer;
    if (isOpenModal) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown === 0) {
      // setIsOpenModal(false);
      navigate("/sign-in");
    }

    return () => clearInterval(timer);
  }, [isOpenModal, countdown]);

  // const handleNavigateSignUp = () => {
  //   navigate("/sign-up");
  // };
  const validateInput = (e) => {
    let { name, value } = e.target;
    console.log(name);
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "token":
          if (!tokenReset) {
            stateObj[name] = "Vui lòng nhập mã khôi phục từ email của bạn.";
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
  const handleChangeTokenReset = (e) => {
    setTokenReset(e.target.value);
  };

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmNewPassword = (e) => {
    setConfirmNewPassword(e.target.value);
  };
  const handleResetPassword = async () => {
    const payload = {
      email,
      newPassword,
      confirmNewPassword,
      tokenForgotPassword: tokenReset.trim(),
      currentTime: new Date(),
    };
    setLoading(true);
    const res = await UserService.resetPassword(payload);
    setLoading(false);
    if (res.status === "SUCCESS") {
      setIsOpenModal(true);
    }
    if (res.status === "ERROR") {
      message.error(res.message);
    }
    return res;
  };

  const handleSignInEnter = async (e) => {
    if (e.keyCode == 13) {
      const payload = {
        email,
        newPassword,
        confirmNewPassword,
        tokenForgotPassword: tokenReset.trim(),
        currentTime: new Date(),
      };
      const res = await UserService.resetPassword(payload);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đặt lại mật khẩu | October16th</title>
      </Helmet>
      <Flex
        position="relative"
        h="max-content"
        className="!bg-white md:!h-screen"
      >
        <Flex
          h={{
            sm: "initial",
            md: "unset",
            lg: "100vh",
            xl: "97vh",
          }}
          w="100%"
          maxW={{ md: "66%", lg: "1313px" }}
          mx="auto"
          pt={{ sm: "50px", md: "0px" }}
          px={{ lg: "30px", xl: "0px" }}
          ps={{ xl: "0px" }}
          justifyContent="start"
          direction="column"
        >
          <Flex
            maxW={{ base: "100%", md: "max-content" }}
            w="100%"
            mx={{ base: "auto", lg: "auto" }}
            me="auto"
            h="100%"
            alignItems="start"
            justifyContent="center"
            mb={{ base: "30px", md: "60px" }}
            px={{ base: "25px", md: "0px" }}
            mt={{ base: "30px", md: "10vh" }}
            flexDirection="column"
          >
            <Flex
              zIndex="2"
              direction="column"
              w={{ base: "100%", md: "420px" }}
              maxW="100%"
              background="transparent"
              borderRadius="15px"
              mx={{ base: "auto", lg: "unset" }}
              me="auto"
              mb={{ base: "20px", md: "auto" }}
            >
              <div className="text-center mb-10">
                <h1 className="text-lg mb-0">
                  Thiết lập lại mật khẩu mới cho tài khoản
                </h1>
                <h1 className="text-purple-600">{email}</h1>
              </div>

              <FormControl>
                {/* <InputForm
                style={{ marginBottom: "10px" }}
                placeholder="abc@gmail.com"
                value={email}
                onChange={handleChangeEmail}
              /> */}
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  display="flex"
                >
                  Mã khôi phục
                  <Text color={brandStars} marginBottom="0px">
                    *
                  </Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    name="token"
                    onChange={handleChangeTokenReset}
                    onBlur={validateInput}
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Nhập mã khôi phục từ email của bạn"
                    mb="24px"
                    size="lg"
                    type="text"
                    variant="auth"
                    value={tokenReset}
                    onKeyDown={handleSignInEnter}
                  />
                  {/* <InputForm
                  placeholder="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={handleChangePassword}
                /> */}
                </InputGroup>
                {error.token && (
                  <p className="-mt-5 text-xs text-purple-600">{error.token}</p>
                )}
                <FormLabel
                  ms="4px"
                  fontSize="sm"
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
                    onChange={handleChangeNewPassword}
                    onBlur={validateInput}
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Ít nhất 8 ký tự"
                    mb="24px"
                    size="lg"
                    type={isShowNewPassWord ? "text" : "password"}
                    variant="auth"
                    value={newPassword}
                    onKeyDown={handleSignInEnter}
                  />
                  {/* <InputForm
                  placeholder="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={handleChangePassword}
                /> */}
                  <InputRightElement
                    display="flex"
                    alignItems="center"
                    mt="4px"
                  >
                    <Icon
                      color={textColorSecondary}
                      _hover={{ cursor: "pointer" }}
                      as={
                        isShowNewPassWord
                          ? RiEyeCloseLine
                          : MdOutlineRemoveRedEye
                      }
                      onClick={() => setIsShowNewPassWord(!isShowNewPassWord)}
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
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  display="flex"
                >
                  Xác nhận lại mật khẩu mới
                  <Text color={brandStars} marginBottom="0px">
                    *
                  </Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    name="confirmNewPassword"
                    onChange={handleChangeConfirmNewPassword}
                    onBlur={validateInput}
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Ít nhất 8 ký tự"
                    mb="24px"
                    size="lg"
                    type={isShowConfirmNewPassWord ? "text" : "password"}
                    variant="auth"
                    value={confirmNewPassword}
                    onKeyDown={handleSignInEnter}
                  />
                  {/* <InputForm
                  placeholder="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={handleChangePassword}
                /> */}
                  <InputRightElement
                    display="flex"
                    alignItems="center"
                    mt="4px"
                  >
                    <Icon
                      color={textColorSecondary}
                      _hover={{ cursor: "pointer" }}
                      as={
                        isShowConfirmNewPassWord
                          ? RiEyeCloseLine
                          : MdOutlineRemoveRedEye
                      }
                      onClick={() =>
                        setIsShowConfirmNewPassWord(!isShowConfirmNewPassWord)
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                {error.confirmNewPassword && (
                  <p className="-mt-5 text-xs text-purple-600">
                    {error.confirmNewPassword}
                  </p>
                )}
                <Loading isLoading={loading}>
                  <Button
                    fontSize="sm"
                    className="!bg-purple-600 !text-white"
                    fontWeight="500"
                    w="100%"
                    h="50"
                    mb="24px"
                    onClick={handleResetPassword}
                  >
                    Đặt lại mật khẩu
                  </Button>
                </Loading>
              </FormControl>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="start"
                maxW="100%"
                mt="0px"
              ></Flex>
            </Flex>
          </Flex>
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
              <h1 className="text-xl">Thiết lập lại mật khẩu thành công!</h1>
              <p>Vui lòng đăng nhập lại sau {countdown} giây</p>
            </div>
          </ModalComponent>

          {/* <Footer /> */}
        </Flex>
      </Flex>
    </>
  );
}

export default ResetPasswordPage;
