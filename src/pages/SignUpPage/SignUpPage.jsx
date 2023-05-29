import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { NavLink } from "react-router-dom";
// Custom components
import { HSeparator } from "../../components/separator/Separator";

// // Assets
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
// import {
//   WrapperContainerLeft,
//   WrapperContainerRight,
//   WrapperTextLight,
// } from "./style";
// import logoSignin from "../../assets/img/logo-signin.png";
// import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
// import { Image } from "antd";
// import InputForm from "../../components/InputForm/InputForm";
import { useNavigate } from "react-router-dom";
// import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import Loading from "../../components/LoadingComponent/Loading";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Helmet } from "react-helmet";

function SignUpPage() {
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

  // Handle Logic
  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [isShowConfirmPassWord, setIsShowConfirmPassWord] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleNavigateSignUp();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const navigate = useNavigate();
  const handleNavigateSignUp = () => {
    navigate("/sign-in");
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký - October16th</title>
      </Helmet>
      <Flex
        position="relative"
        h="max-content"
        className="!bg-white !h-[110vh]"
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
                Đăng ký
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColorSecondary}
                fontWeight="400"
                fontSize="md"
              >
                Đăng ký để sử dụng ứng dụng!
              </Text>
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
                  <InputRightElement
                    display="flex"
                    alignItems="center"
                    mt="4px"
                  >
                    <Icon
                      color={textColorSecondary}
                      _hover={{ cursor: "pointer" }}
                      as={
                        isShowPassWord ? RiEyeCloseLine : MdOutlineRemoveRedEye
                      }
                      onClick={() => setIsShowPassWord(!isShowPassWord)}
                    />
                  </InputRightElement>
                </InputGroup>

                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  display="flex"
                >
                  Xác nhận mật khẩu
                  <Text color={brandStars} marginBottom="0px">
                    *
                  </Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    onChange={handleChangeConfirmPassword}
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Ít nhất 8 ký tự"
                    mb="24px"
                    size="lg"
                    type={isShowConfirmPassWord ? "text" : "password"}
                    variant="auth"
                    value={confirmPassword}
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
                        isShowConfirmPassWord
                          ? RiEyeCloseLine
                          : MdOutlineRemoveRedEye
                      }
                      onClick={() =>
                        setIsShowConfirmPassWord(!isShowConfirmPassWord)
                      }
                    />
                  </InputRightElement>
                </InputGroup>

                <Loading isLoading={isLoading}>
                  <ButtonComponent
                    onClick={handleSignUp}
                    styleButton={{
                      marginBottom: "24px",
                      height: "50px",
                      fontWeight: 500,
                      minWidth: "2.5rem",
                      width: "100%",
                      color: "#fff",
                      boxShadow:
                        "45px 76px 113px 7px rgba(112, 144, 176, 0.08);",
                      padding: "0 16px",
                      borderRadius: "16px",
                      background: "#9333EA",
                    }}
                    textButton={"Đăng ký"}
                  />
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
                  Đã có tài khoản?
                  <NavLink to="/sign-in">
                    <Text color="#9333EA" as="span" ms="5px" fontWeight="500">
                      Đăng nhập
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

export default SignUpPage;
