import { AutoComplete, Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { WrapperInfo, WrapperRight, WrapperTotal } from "./style";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../until";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { removeAllOrderProduct } from "../../redux/slides/orderSlice";
import { PayPalButton } from "react-paypal-button-v2";
import vnpayImg from "../../assets/img/vnpay.png";
import later_moneyImg from "../../assets/img/later_money.png";
import * as PaymentService from "../../services/PaymentService";
import {
  LeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import axios from "axios";
const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const { state } = useLocation();
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [moreInfoOrder, setMoreInfoOrder] = useState(false);
  const [districtsRender, setDistrictsRender] = useState([]);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });

  const { provinces, districts } = state;

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

  const province = provinces.map((pro) => {
    return { value: pro?.name, code: pro.code };
  });

  const district = districtsRender?.map((dis) => {
    return { value: dis?.name };
  });

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        district: user?.district,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const handleDeliveryPrice = () => {
    if (delivery === "now") {
      return 40000;
    }
    if (delivery === "fast") {
      return 30000;
    }
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const freeshipPrice =
    state?.freeshipPrice === 100 ? handleDeliveryPrice() : state?.freeshipPrice;

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.district &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        district: user?.district,
        paymentMethod: payment,
        delivery,
        itemsPrice: state?.price,
        shippingPrice: handleDeliveryPrice(),
        freeshipPrice: freeshipPrice,
        totalPrice: totalPrice,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { isLoading, data } = mutationUpdate;
  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  const totalPrice =
    state?.price +
    handleDeliveryPrice(payment) -
    freeshipPrice -
    state?.priceVoucher;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/order-success", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPrice,
        },
      });
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const handleVnPay = async () => {
    sessionStorage.setItem("paymentMethod", payment);
    sessionStorage.setItem("delivery", delivery);
    const data = {
      amount: state?.totalPrice,
      bankCode: "",
      language: "vn",
      vnp_OrderInfo: "test thu coi",
    };
    setLoadingPayment(true);
    const res = await axios.post(
      "https://payment-vnpay.onrender.com/order/create_payment_url",
      data,
      {
        headers: {
          "Access-Control-Allow-Methods": "*",
        },
      }
    );
    setLoadingPayment(false);

    window.open(res?.data.vnp, "_blank");
    return res;
  };

  const handleUpdateInfoUser = () => {
    const { name, address, district, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, district, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleDelivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  // const addPaypalScript = async () => {
  //   const { data } = await PaymentService.getConfig();
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
  //   script.async = true;
  //   script.onload = () => {
  //     setSdkReady(true);
  //   };
  //   document.body.appendChild(script);
  // };

  // useEffect(() => {
  //   if (!window.paypal) {
  //     addPaypalScript();
  //   } else {
  //     setSdkReady(true);
  //   }
  // }, []);

  return (
    <div className="bg-slate-100 w-full mb-5">
      <Loading isLoading={isLoadingAddOrder}>
        <div className="h-full max-w-7xl m-auto md:pt-5">
          <div className="fixed top-0 left-0 right-0 h-12 bg-white py-3 px-5 flex items-center md:hidden">
            <div className="flex justify-center items-center">
              <LeftOutlined
                onClick={() => navigate(-1)}
                className={"w-8 h-8 text-lg text-blue-500 text-center"}
              />
            </div>
            <div className="text-center mr-8 w-full">
              <h1 className="text-xl mb-0 ">XÁC NHẬN ĐƠN HÀNG</h1>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center pt-16 md:pt-0 px-5 md:px-0">
            <div className="md:flex-1">
              <WrapperInfo>
                <div>
                  <h1 className="font-medium text-sm md:text-base">
                    Chọn phương thức giao hàng
                  </h1>
                  <Radio.Group
                    className="mt-2 bg-blue-50 border border-blue-200 rounded h-24 p-4 flex flex-col gap-3 justify-center md:w-[500px]"
                    onChange={handleDelivery}
                    value={delivery}
                  >
                    <Radio value="fast">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-black">FAST</span>
                        <span>Giao hàng tiết kiệm</span>
                      </div>
                    </Radio>
                    <Radio value="now">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-black">NOW</span>
                        <span>Giao siêu tốc</span>
                      </div>
                    </Radio>
                  </Radio.Group>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <h1 className="font-medium text-sm md:text-base">
                    Chọn phương thức thanh toán
                  </h1>
                  <Radio.Group
                    className="mt-2 bg-blue-50 border border-blue-200 rounded h-32 md:h-24 p-4 flex flex-col gap-3 justify-center md:w-[500px]"
                    onChange={handlePayment}
                    value={payment}
                  >
                    <div className="flex items-center gap-1">
                      <Radio value="later_money">
                        <div className="flex items-center gap-2">
                          <img
                            src={later_moneyImg}
                            alt="later-money"
                            width={32}
                            height={32}
                          />
                          <span>Thanh toán tiền mặt khi nhận được hàng</span>
                        </div>{" "}
                      </Radio>
                    </div>
                    <div className="flex items-center gap-1">
                      <Radio value="vnpay">
                        <div className="flex items-center gap-2">
                          <img
                            src={vnpayImg}
                            alt="vnpay-img"
                            width={32}
                            height={32}
                          />
                          <span>Thanh toán qua cổng giao dịch VNPAY</span>
                        </div>
                      </Radio>
                    </div>
                  </Radio.Group>
                </div>
              </WrapperInfo>
            </div>
            <div className="mt-5 md:mt-0 md:ml-5 max-w-xs flex flex-col gap-2 md:gap-3 items-center">
              <div className="w-full fixed bottom-0 right-0 md:sticky md:top-5 left-0">
                {/* <WrapperInfo>
                  <div style={{ display: "flex" }}>
                    <InputComponent
                      style={{ width: 200, marginRight: "5px" }}
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      onChange={onChangeVoucher}
                      value={voucherCode}
                    />
                    <ButtonComponent
                      onClick={handleAddVoucher}
                      textButton="Áp dụng"
                      style={{ background: "rgb(66, 42, 251)", color: "#fff" }}
                    ></ButtonComponent>
                  </div>
                  <span
                    style={{
                      color: "rgb(254, 56, 52)",
                      display: "block",
                      marginTop: "5px",
                      fontSize: "14px",
                    }}
                  >
                    {messageVoucher}
                  </span>
                </WrapperInfo> */}
                <div className="p-5 border-b-zinc-100 border-b-[1px] bg-white w-full">
                  <div className="flex items-center justify-between">
                    <span>Giao tới</span>
                    <div>
                      <span
                        onClick={handleChangeAddress}
                        className="cursor-pointer text-purple-600"
                      >
                        Thay đổi
                      </span>
                    </div>
                  </div>
                  <div className="customer_info flex items-center">
                    <span className="font-medium">{user?.name}</span>
                    <i className="w-[2px] h-5 mx-2 bg-slate-400"></i>
                    <span className="font-medium">{user?.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-500">
                      {`${user?.address}, ${user?.district}, ${user?.city}`}{" "}
                    </span>
                  </div>
                </div>
                <div
                  className={`${
                    moreInfoOrder ? "block" : "hidden md:block"
                  } p-5 border-b-zinc-100 border-b-[1px] bg-white w-full`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Tạm tính</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(state.price)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Giảm giá</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(state?.priceVoucher)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Phí vận chuyển</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(handleDeliveryPrice(payment))}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Khuyến mãi vận chuyển</span>
                    <span className="text-sm font-medium text-green-400">
                      -{" "}
                      {convertPrice(
                        state?.freeshipPrice === 100
                          ? handleDeliveryPrice(payment)
                          : state?.freeshipPrice
                      )}
                    </span>
                  </div>
                </div>
                <div className="py-4 px-5 flex items-center bg-white justify-between">
                  <div className="flex items-center gap-1 leading-none">
                    <span onClick={() => setMoreInfoOrder(!moreInfoOrder)}>
                      Tổng cộng
                    </span>

                    <div className="md:hidden">
                      {moreInfoOrder ? (
                        <CaretDownOutlined className="text-gray-500" />
                      ) : (
                        <CaretUpOutlined className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span className="text-xl font-medium md:text-base text-red-500">
                      {convertPrice(totalPrice)}
                    </span>
                    <span style={{ color: "#000", fontSize: "11px" }}>
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </span>
                </div>
                <div className="bg-white px-5 pb-2 md:p-0">
                  {payment === "later_money" ? (
                    <ButtonComponent
                      onClick={() => handleAddOrder()}
                      size={40}
                      styleButton={{
                        background: "#9333EA",
                        height: "48px",
                        width: "100%",
                        border: "none",
                        borderRadius: "4px",
                        color: "#fff",
                        fontSize: "15px",
                        fontWeight: "700",
                      }}
                      textButton={`Đặt mua`}
                    ></ButtonComponent>
                  ) : (
                    <Loading isLoading={loadingPayment}>
                      <ButtonComponent
                        onClick={() => handleVnPay()}
                        size={40}
                        styleButton={{
                          background: "#9333EA",
                          height: "48px",
                          width: "100%",
                          border: "none",
                          borderRadius: "4px",
                          color: "#fff",
                          fontSize: "15px",
                          fontWeight: "700",
                        }}
                        textButton={`Tiến hành thanh toán`}
                      ></ButtonComponent>
                    </Loading>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalComponent
          footer={null}
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdate}
          // onOk={handleUpdateInfoUser}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              onFinish={handleUpdateInfoUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                className="font-medium p-0"
                label="Họ và tên"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails["name"]}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                className="font-medium p-0"
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>
              <Form.Item
                className="font-medium p-0"
                label="Tỉnh, thành phố"
                name="city"
                rules={[
                  { required: true, message: "Vui lòng chọn Thành phố!" },
                ]}
              >
                {/* <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              /> */}

                <AutoComplete
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
                />
              </Form.Item>
              <Form.Item
                className="font-medium p-0"
                label="Quận, huyện"
                name="district"
                rules={[
                  { required: true, message: "Vui lòng chọn Quận, Huyện!" },
                ]}
              >
                {/* <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              /> */}

                <AutoComplete
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
                />
              </Form.Item>

              <Form.Item
                className="font-medium p-0"
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>
              <button
                type="submit"
                className="w-full m-0 md:w-80 md:mt-2 bg-[#9333EA] h-12 border-none outline-none rounded-md text-white text-base font-medium"
              >
                Xác nhận
              </button>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default PaymentPage;

1;
