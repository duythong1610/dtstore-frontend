import { AutoComplete, Badge, Checkbox, Form, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  WrapperCountOrder,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperStyleHeader,
  WrapperStyleHeaderDilivery,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlice";
import { convertPrice } from "../../until";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlice";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";
import MySwal from "../../components/SweetAlert/SweetAlert";
import { priceDiscount } from "../../until";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import EmptyCart from "../../assets/img/empty-cart.jpg";
import { Helmet } from "react-helmet";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [moreInfoOrder, setMoreInfoOrder] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsRender, setDistrictsRender] = useState([]);

  const [isVoucher, setIsVoucher] = useState(false);
  const [priceVoucher, setPriceVoucher] = useState(0);
  const [messageVoucher, setMessageVoucher] = useState(false);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });

  const fetchProvince = async () => {
    const res = await axios.get("https://provinces.open-api.vn/api/");
    console.log({ res });
    setProvinces(res.data);
  };

  const fetchDistrict = async () => {
    const res = await axios.get("https://provinces.open-api.vn/api/d");
    console.log({ res });
    setDistricts(res.data);
  };

  useEffect(() => {
    fetchProvince();
    fetchDistrict();
  }, []);
  useEffect(() => {
    if (isVoucher) {
      setDiscount(priceVoucher);
    }
  }, [order?.orderItems]);

  const province = provinces.map((pro) => {
    return { value: pro?.name, code: pro.code };
  });

  const district = districtsRender?.map((dis) => {
    return { value: dis?.name };
  });

  console.log({ province });

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    MySwal.fire({
      title: "Thông báo",
      text: `Bạn chắc chắn muốn xóa?`,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) dispatch(removeOrderProduct({ idProduct }));
    });
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        district: user?.district,
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    if (!user.email) {
      message.error(
        "Bạn chưa đăng nhập! Vui lòng đăng nhập để thay đổi địa chỉ"
      );
    } else {
      setIsOpenModalUpdateInfo(true);
    }
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      if (cur?.discount) {
        return (
          total +
          (cur?.price - (cur?.price * cur?.discount) / 100) * cur?.amount
        );
      }
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo > 500000 && priceMemo < 2000000) {
      return 15000;
    }
    if (priceMemo < 500000) {
      return 0;
    }
    if (priceMemo > 2000000 && priceMemo < 4999999) {
      return 25000;
    } else {
      return 100;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(deliveryPriceMemo);
  }, [priceMemo, deliveryPriceMemo]);

  const handleRemoveAllOrder = () => {
    if (listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    } else {
      message.error("Vui lòng chọn sản phẩm");
    }
  };

  const handleAddCard = () => {
    if (!user.name) {
      message.error(
        "Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục mua hàng."
      );
    } else {
      if (!order?.orderItemsSelected?.length) {
        message.error("Vui lòng chọn sản phẩm");
      } else if (!user?.phone || !user.address || !user.name || !user.city) {
        setIsOpenModalUpdateInfo(true);
      } else {
        navigate("/thanh-toan", {
          state: {
            priceVoucher: priceVoucher,
            freeshipPrice: deliveryPriceMemo,
            totalPrice: isVoucher
              ? +`${priceAddVoucher(totalPriceMemo)}`
              : deliveryPriceMemo
              ? totalPriceMemo - deliveryPriceMemo - priceVoucher
              : totalPriceMemo,
            price: priceMemo,
            districts: districts,
            provinces: provinces,
          },
        });
      }
    }
  };

  const onChangeVoucher = (e) => {
    setVoucherCode(e.target.value);
  };

  const handleAddVoucher = () => {
    if (listChecked.length <= 0) {
      setMessageVoucher(
        "Vui lòng chọn sản phẩm cần thanh toán để được giảm giá"
      );
    } else {
      if (voucherCode === "DUYTHONGDEPTRAI") {
        setIsVoucher(true);
        message.success("Áp dụng mã giảm giá thành công");
        setVoucherCode("");
        setMessageVoucher("");
        setPriceVoucher(20000);
      } else if (!voucherCode) {
        setMessageVoucher("Vui lòng nhập mã giảm giá");
      } else {
        setMessageVoucher(
          "Mã giảm giá không hợp lệ, liên hệ Duy Thông để nhận được mã"
        );
      }
    }
  };

  const priceAddVoucher = (total) => {
    return total - 20000;
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isLoading, data } = mutationUpdate;

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

  console.log({ district }, { districtsRender });
  const handleUpdateInfoUser = () => {
    const { name, address, district, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, district, city, phone }));
            setIsOpenModalUpdateInfo(false);
            message.success("Cập nhật thông tin thành công");
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

  const handleOnChangeProvince = (data, option) => {
    setStateUserDetails({
      ...stateUserDetails,
      city: data,
    });

    console.log(option.code);
    const res = districts.filter((dis) => {
      return dis?.province_code === option?.code;
    });
    console.log({ res }, { districts });
    setDistrictsRender(res);
  };

  const handleOnChangeDistrict = (data) => {
    setStateUserDetails({
      ...stateUserDetails,
      district: data,
    });
  };
  const itemsDelivery = [
    {
      title: "Freeship 15k",
      description: "Đơn hàng 500k-2tr",
    },
    {
      title: "Freeship 25k",
      description: "Đơn hàng 2000K-4tr999",
    },
    {
      title: "Freeship",
      description: "Đơn hàng trên 5000K",
    },
  ];
  return (
    <>
      <Helmet>
        <title>Giỏ hàng - October16th</title>
      </Helmet>
      <div className="bg-slate-100 w-full pt-12 md:py-5">
        <div className="h-full max-w-7xl px-5 md:px-0 m-auto pt-5 md:pt-0 pb-[289px] md:pb-0">
          <div className="fixed flex items-center py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-10 bg-white">
            <div className="flex justify-center items-center">
              <LeftOutlined
                onClick={() => navigate(-1)}
                className={"w-8 h-8 text-lg text-blue-500 text-center"}
              />
            </div>
            <div className="text-center w-full mr-8">
              <h1 className="text-xl font-medium m-0">GIỎ HÀNG</h1>
            </div>
          </div>
          {order?.orderItems?.length === 0 ? (
            <div className="text-center">
              <img
                src={EmptyCart}
                alt="empty-cart"
                className="inline-block mix-blend-darken md:w-1/3"
              />
              <p className="text-base font-medium mb-4 md:mb-3">
                Bạn chưa có sản phẩm nào trong giỏ hàng!
              </p>
              <ButtonComponent
                className="bg-[#422AFB] h-12 w-full md:w-72 rounded-md text-white text-base font-bold"
                onClick={() => navigate("/")}
                size={40}
                textButton={"Tiếp tục mua sắm"}
              ></ButtonComponent>
            </div>
          ) : (
            <div className="flex justify-center flex-col md:flex-row">
              <WrapperLeft>
                <WrapperStyleHeaderDilivery className="top-5 md:top-0">
                  <StepComponent
                    items={itemsDelivery}
                    current={
                      deliveryPriceMemo === 25000
                        ? 2
                        : deliveryPriceMemo === 15000
                        ? 1
                        : deliveryPriceMemo === 100
                        ? 3
                        : 0
                    }
                  />
                </WrapperStyleHeaderDilivery>
                <WrapperStyleHeader className="top-60 md:top-20 justify-between">
                  <span className="md:mr-[165px]">
                    <Checkbox
                      onChange={handleOnchangeCheckAll}
                      checked={
                        listChecked?.length === order?.orderItems?.length
                      }
                    ></Checkbox>
                    <span style={{ marginLeft: "15px" }}>
                      Tất cả ({order?.orderItems?.length} sản phẩm)
                    </span>
                  </span>
                  <div className="md:justify-between md:flex-1 flex items-center">
                    <span className="hidden md:block md:mr-7">Đơn giá</span>
                    <span
                      className="hidden md:block"
                      style={{ marginRight: "-10px" }}
                    >
                      Số lượng
                    </span>
                    <span
                      className="hidden md:block"
                      style={{ marginRight: "-20px" }}
                    >
                      Thành tiền
                    </span>
                    <Tooltip placement="bottom" title={"Xóa các mục đã chọn"}>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={handleRemoveAllOrder}
                      />
                    </Tooltip>
                  </div>
                </WrapperStyleHeader>
                <WrapperListOrder className="flex-col md:flex-row overflow-hidden h-auto">
                  {order?.orderItems?.map((order) => {
                    console.log({ order });
                    return (
                      <WrapperItemOrder
                        className="flex-col md:flex-row"
                        key={order?.product}
                      >
                        <div class="flex items-center gap-3 w-full md:w-64">
                          <Checkbox
                            onChange={onChange}
                            value={order?.product}
                            checked={listChecked.includes(order?.product)}
                          ></Checkbox>
                          <img
                            src={order?.image}
                            style={{
                              width: "77px",
                              height: "79px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="flex flex-col md:flex-none">
                            <span className="md:!max-w-[160px] max-w-[180px] font-medium line-clamp-2">
                              {order?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full mt-2 md:ml-[150px]">
                          <div className="flex flex-col">
                            {order?.discount > 0 && (
                              <span className=" w-full overflow-hidden text-ellipsis whitespace-nowrap text-zinc-500 text-xs line-through">
                                {convertPrice(order?.price)}
                              </span>
                            )}

                            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-red-500 font-medium text-sm">
                              {order?.discount
                                ? convertPrice(
                                    priceDiscount(order?.price, order) *
                                      order?.amount
                                  )
                                : convertPrice(order?.price * order?.amount)}
                            </span>
                          </div>
                          {/* <span className="hidden md:block">
                            <span
                              style={{ fontSize: "13px", color: "#242424" }}
                            >
                              {order?.discount
                                ? convertPrice(
                                    priceDiscount(order?.price, order)
                                  )
                                : convertPrice(order?.price)}
                            </span>
                          </span> */}
                          <WrapperCountOrder className="ml-9">
                            <button
                              style={{
                                padding: "0px 8px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleChangeCount(
                                  "decrease",
                                  order?.product,
                                  order?.amount === 1
                                )
                              }
                            >
                              <MinusOutlined
                                style={{ color: "#000", fontSize: "10px" }}
                              />
                            </button>
                            <WrapperInputNumber
                              defaultValue={order?.amount}
                              value={order?.amount}
                              size="small"
                              min={1}
                              max={order?.countInstock}
                            />
                            <button
                              style={{
                                padding: "0px 8px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleChangeCount(
                                  "increase",
                                  order?.product,
                                  order?.amount === order.countInstock,
                                  order?.amount === 1
                                )
                              }
                            >
                              <PlusOutlined
                                style={{ color: "#000", fontSize: "10px" }}
                              />
                            </button>
                          </WrapperCountOrder>
                          <span className="hidden md:block md:text-red-500 text-sm font-medium">
                            {order?.discount
                              ? convertPrice(
                                  priceDiscount(order?.price, order) *
                                    order?.amount
                                )
                              : convertPrice(order?.price * order?.amount)}
                          </span>
                          <DeleteOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeleteOrder(order?.product)}
                          />
                        </div>
                      </WrapperItemOrder>
                    );
                  })}
                </WrapperListOrder>
              </WrapperLeft>

              <div className="mt-5 md:mt-0 md:ml-5 flex flex-col gap-2 md:gap-3 items-center">
                <div className="w-full fixed md:static bottom-0 left-0 right-0 md:top-5">
                  <div
                    className={
                      moreInfoOrder
                        ? "px-5 py-3 md:py-5 bg-white"
                        : "px-5 py-3 md:py-5 bg-white"
                    }
                  >
                    <div style={{ display: "flex" }}>
                      <InputComponent
                        className="md:w-48 w-full mr-2"
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        onChange={onChangeVoucher}
                        value={voucherCode}
                      />
                      <ButtonComponent
                        onClick={handleAddVoucher}
                        textButton="Áp dụng"
                        style={{
                          background: "#9333EA",
                          color: "#fff",
                        }}
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
                  </div>
                  <div
                    className={
                      moreInfoOrder
                        ? "px-5 py-1 md:py-5 bg-white border-b-zinc-100 border-b-[1px]"
                        : "px-5 py-1 md:py-5 bg-white border-b-zinc-100 border-b-[1px]"
                    }
                  >
                    <div>
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
                      {user?.email ? (
                        <div>
                          <div className="customer_info flex items-center">
                            <span className="font-medium">{user?.name}</span>
                            <i className="w-[2px] h-5 mx-2 bg-slate-400"></i>
                            <span className="font-medium">{user?.phone}</span>
                          </div>

                          <div>
                            <span className="font-medium text-zinc-500">
                              {`${user?.address}${user?.district ? "," : ""} ${
                                user?.district
                              }${user?.city ? "," : ""} ${user?.city}`}{" "}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Bạn quên đăng nhập rồi này!
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      moreInfoOrder
                        ? "block px-5 py-1 md:py-5 bg-white"
                        : "md:block px-5 py-1 md:py-5 hidden bg-white border-b-zinc-100 border-b-[1px]"
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>Tạm tính</span>
                      <span
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {convertPrice(priceMemo)}
                      </span>
                    </div>
                    {isVoucher && (
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
                          {convertPrice(priceVoucher)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-5 py-2 md:py-4 bg-white h-20 ">
                    <div className="flex items-center gap-1 leading-none">
                      <span onClick={() => setMoreInfoOrder(!moreInfoOrder)}>
                        Tổng cộng
                      </span>
                      {listChecked?.length > 0 && (
                        <div className="md:hidden">
                          {moreInfoOrder ? (
                            <CaretDownOutlined className="text-gray-500" />
                          ) : (
                            <CaretUpOutlined className="text-gray-500" />
                          )}
                        </div>
                      )}
                    </div>

                    <span style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        className={
                          listChecked?.length === 0
                            ? "text-sm font-medium md:text-base text-red-500"
                            : "text-xl font-medium md:text-base text-red-500"
                        }
                      >
                        {listChecked?.length === 0
                          ? "Vui lòng chọn sản phẩm"
                          : `${
                              isVoucher
                                ? `${priceAddVoucher(totalPriceMemo)
                                    .toLocaleString()
                                    .replaceAll(",", ".")} VNĐ`
                                : convertPrice(
                                    priceVoucher
                                      ? priceMemo -
                                          deliveryPriceMemo -
                                          priceVoucher
                                      : priceMemo
                                  )
                            }`}
                      </span>
                      <span
                        className={
                          listChecked?.length === 0 ? "hidden" : "block"
                        }
                        style={{ color: "#000", fontSize: "11px" }}
                      >
                        (Đã bao gồm VAT nếu có)
                      </span>
                    </span>
                  </div>
                  <div className="px-5 pb-2 md:p-0  bg-white">
                    <ButtonComponent
                      className="w-full m-0 md:w-80 md:mt-2"
                      onClick={() => handleAddCard()}
                      size={40}
                      styleButton={{
                        background: "#9333EA",
                        height: "48px",
                        border: "none",
                        width: "100%",
                        borderRadius: "4px",
                        color: "#fff",
                        fontSize: "15px",
                        fontWeight: "700",
                      }}
                      textButton={`Mua hàng (${listChecked?.length})`}
                    ></ButtonComponent>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              <div className=" md:text-right">
                <button
                  type="submit"
                  className="w-full m-0 md:w-40 md:mt-2 bg-[#9333EA] h-12 border-none outline-none rounded-md text-white text-base font-medium"
                >
                  Xác nhận
                </button>
              </div>
            </Form>
          </Loading>
        </ModalComponent>
      </div>
    </>
  );
};

export default OrderPage;
