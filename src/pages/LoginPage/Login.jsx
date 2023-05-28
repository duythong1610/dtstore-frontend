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
import { NavLink, useNavigate } from "react-router-dom";
// Custom components
import { HSeparator } from "../../components/separator/Separator";
import * as message from "../../components/Message/Message";

// // Assets
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHooks";

import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import jwt_decode from "jwt-decode";
import { updateUser } from "../../redux/slides/userSlice";
import axios from "axios";
import { Helmet } from "react-helmet";
import logo from "../../assets/img/logo.png";
function Login() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const [messageError, setMessageError] = useState("");
  const handleClick = () => setShow(!show);

  // Handle Logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const dispatch = useDispatch();

  const { data, isLoading, isSuccess } = mutation;

  useEffect(() => {
    if (data?.status === "OK") {
      message.success("Đăng nhập thành công!");
      navigate("/");
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );

      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token);
        if (decoded.id) {
          handleGetDetailUser(decoded.id, data?.access_token);
        }
      }
    } else {
      setMessageError(data?.message);
    }
  }, [isSuccess]);

  const handleGetDetailUser = async (id, access_token) => {
    const storage = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storage);
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(
      updateUser({ ...res?.data, access_token: access_token, refreshToken })
    );
  };
  // const handleNavigateSignUp = () => {
  //   navigate("/sign-up");
  // };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <>
      <Helmet>
        <title>Dtstore - Đăng nhập</title>
      </Helmet>
      <Flex position="relative" h="max-content" className="!bg-white !h-screen">
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
          ps={{ xl: "70px" }}
          justifyContent="start"
          direction="column"
        >
          <NavLink
            to="/"
            style={() => ({
              width: "fit-content",
              marginTop: "40px",
            })}
          >
            <Flex
              align="center"
              ps={{ base: "25px", lg: "0px" }}
              pt={{ lg: "0px", xl: "0px" }}
              w="fit-content"
            >
              <Icon
                as={FaChevronLeft}
                me="12px"
                h="13px"
                w="8px"
                color="secondaryGray.600"
              />
              <Text
                ms="0px"
                fontSize="sm"
                color="secondaryGray.600"
                marginBottom="0px"
              >
                Trở về trang chủ
              </Text>
            </Flex>
          </NavLink>
          <Flex
            maxW={{ base: "100%", md: "max-content" }}
            w="100%"
            mx={{ base: "auto", lg: "0px" }}
            me="auto"
            h="100%"
            alignItems="start"
            justifyContent="center"
            mb={{ base: "30px", md: "60px" }}
            px={{ base: "25px", md: "0px" }}
            mt={{ base: "30px", md: "10vh" }}
            flexDirection="column"
          >
            <Box me="auto">
              <Heading color={textColor} fontSize="36px" mb="10px">
                Đăng nhập
              </Heading>

              {messageError ? (
                <Text
                  mb="36px"
                  ms="4px"
                  color={"red"}
                  fontWeight="400"
                  fontSize="md"
                >
                  {messageError}
                </Text>
              ) : (
                <Text
                  mb="36px"
                  ms="4px"
                  color={textColorSecondary}
                  fontWeight="400"
                  fontSize="md"
                >
                  Đăng nhập để sử dụng ứng dụng!
                </Text>
              )}
            </Box>
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
              <Button
                fontSize="sm"
                me="0px"
                mb="26px"
                py="15px"
                h="50px"
                borderRadius="16px"
                bg={googleBg}
                color={googleText}
                fontWeight="500"
                _hover={googleHover}
                _active={googleActive}
                _focus={googleActive}
              >
                <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
                Đăng nhập với Google
              </Button>
              <Flex align="center" mb="25px">
                <HSeparator />
                <Text color="gray.400" mx="14px" marginBottom="0px">
                  or
                </Text>
                <HSeparator />
              </Flex>
              <FormControl>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Email
                  <Text color={brandStars} marginBottom="0px">
                    *
                  </Text>
                </FormLabel>
                <Input
                  onChange={handleChangeEmail}
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="email"
                  placeholder="youremail@gmail.com"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  value={email}
                />

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
                  Mật khẩu
                  <Text color={brandStars} marginBottom="0px">
                    *
                  </Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    onChange={handleChangePassword}
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Ít nhất 8 ký tự"
                    mb="24px"
                    size="lg"
                    type={show ? "text" : "password"}
                    variant="auth"
                    value={password}
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
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={handleClick}
                    />
                  </InputRightElement>
                </InputGroup>
                <Flex justifyContent="space-between" align="center" mb="24px">
                  <FormControl display="flex" alignItems="center">
                    <Checkbox
                      id="remember-login"
                      colorScheme="brandScheme"
                      me="10px"
                    />
                    <FormLabel
                      htmlFor="remember-login"
                      mb="0"
                      fontWeight="normal"
                      color={textColor}
                      fontSize="sm"
                    >
                      Duy trì đăng nhập
                    </FormLabel>
                  </FormControl>
                  <NavLink>
                    <Text
                      color={textColorBrand}
                      fontSize="sm"
                      w="124px"
                      fontWeight="500"
                      marginBottom="0px"
                    >
                      Quên mật khẩu?
                    </Text>
                  </NavLink>
                </Flex>
                <Loading isLoading={isLoading}>
                  <Button
                    fontSize="sm"
                    variant="brand"
                    fontWeight="500"
                    w="100%"
                    h="50"
                    mb="24px"
                    onClick={handleSignIn}
                  >
                    Đăng nhập
                  </Button>
                </Loading>
              </FormControl>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="start"
                maxW="100%"
                mt="0px"
              >
                <Text color={textColorDetails} fontWeight="400" fontSize="14px">
                  Chưa có tài khoản?
                  <NavLink to="/sign-up">
                    <Text
                      color={textColorBrand}
                      as="span"
                      ms="5px"
                      fontWeight="500"
                    >
                      Tạo tài khoản
                    </Text>
                  </NavLink>
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Box
            display={{ base: "none", md: "block" }}
            h="100%"
            minH="100vh"
            w={{ lg: "50vw", "2xl": "44vw" }}
            position="absolute"
            right="0px"
          >
            <Flex
              bg={`url("https://static.vecteezy.com/system/resources/previews/005/879/539/original/cloud-computing-modern-flat-concept-for-web-banner-design-man-enters-password-and-login-to-access-cloud-storage-for-uploading-and-processing-files-illustration-with-isolated-people-scene-free-vector.jpg")`}
              justify="center"
              align="end"
              w="100%"
              h="100%"
              bgSize="cover"
              bgPosition="50%"
              position="absolute"
              borderBottomLeftRadius={{ lg: "120px", xl: "200px" }}
            ></Flex>
          </Box>
          {/* <Footer /> */}
        </Flex>
      </Flex>
    </>
  );
}

export default Login;
