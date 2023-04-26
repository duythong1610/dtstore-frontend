import { Checkbox, Form, Tooltip } from "antd";
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
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [moreInfoOrder, setMoreInfoOrder] = useState(false);

  const [isVoucher, setIsVoucher] = useState(false);
  const [priceVoucher, setPriceVoucher] = useState(0);
  const [messageVoucher, setMessageVoucher] = useState(false);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    if (isVoucher) {
      setDiscount(priceVoucher);
    }
  }, [order?.orderItems]);

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
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      if (cur?.discount) {
        const abc = ((cur?.price * cur?.discount) / 100) * cur?.amount;
        return (
          total +
          (cur?.price - (cur?.price * cur?.discount) / 100) * cur?.amount
        );
      }
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  // const priceDiscountMemo = useMemo(() => {
  //   const result = order?.orderItemsSelected?.reduce((total, cur) => {
  //     console.log({ total }, { cur }, cur?.price);
  //     const totalDiscount = cur.discount ? cur.discount : 0;
  //     return (cur?.price * (totalDiscount * cur?.amount)) / 100;
  //   }, 0);
  //   if (Number(result)) {
  //     console.log(result);
  //     return result;
  //   }
  //   return 0;
  // }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  // console.log({ diliveryPriceMemo }, { priceMemo }, { priceDiscountMemo });
  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) -
      // Number(priceDiscountMemo) +
      Number(diliveryPriceMemo)
    );
  }, [priceMemo, diliveryPriceMemo]);

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment", {
        state: {
          priceVoucher: priceVoucher,
          totalPrice: isVoucher
            ? `${priceAddVoucher(totalPriceMemo)
                .toLocaleString()
                .replaceAll(",", ".")} VNĐ`
            : convertPrice(
                diliveryPriceMemo
                  ? totalPriceMemo - diliveryPriceMemo - priceVoucher
                  : totalPriceMemo
              ),
          price: convertPrice(totalPriceMemo),
        },
      });
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

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
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
  const itemsDelivery = [
    {
      title: "Phí giao hàng 20K",
      description: "Đơn hàng dưới 200K",
    },
    {
      title: "Phí giao hàng 10K",
      description: "Đơn hàng từ 200K đến 500K",
    },
    {
      title: "Freeship",
      description: "Đơn hàng trên 500K",
    },
  ];
  return (
    <div style={{ background: "#f5f5fa", width: "100%", minHeight: "100vh" }}>
      <div className="h-full max-w-7xl px-5 m-auto">
        <h1 style={{ padding: "12px 0", fontSize: "24px", margin: "0" }}>
          GIỎ HÀNG
        </h1>
        <div className="flex justify-center flex-col md:flex-row">
          <WrapperLeft>
            <WrapperStyleHeaderDilivery>
              <StepComponent
                items={itemsDelivery}
                current={
                  diliveryPriceMemo === 10000
                    ? 2
                    : diliveryPriceMemo === 20000
                    ? 1
                    : order.orderItemsSelected.length === 0
                    ? 0
                    : 3
                }
              />
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader className="top-60 md:top-28 justify-between">
              <span>
                <Checkbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></Checkbox>
                <span style={{ marginLeft: "15px" }}>
                  Tất cả ({order?.orderItems?.length} sản phẩm)
                </span>
              </span>
              <div className="md:flex-1 flex items-center">
                <span className="hidden md:block">Đơn giá</span>
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
            <WrapperListOrder className="flex-col md:flex-row overflow-hidden h-auto mb-[65%] md:mb-0">
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
                      <div className="flex flex-col">
                        <span className="md:w-60 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {order?.name}
                        </span>
                        {order?.discount > 0 && (
                          <span className="md:hidden w-full overflow-hidden text-ellipsis whitespace-nowrap text-zinc-500 text-xs line-through">
                            {convertPrice(order?.price)}
                          </span>
                        )}

                        <span className="md:hidden w-full overflow-hidden text-ellipsis whitespace-nowrap text-red-500 font-medium text-sm">
                          {order?.discount
                            ? convertPrice(
                                priceDiscount(order?.price, order) *
                                  order?.amount
                              )
                            : convertPrice(order?.price * order?.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <span className="hidden md:block">
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          {order?.discount
                            ? convertPrice(priceDiscount(order?.price, order))
                            : convertPrice(order?.price)}
                        </span>
                      </span>
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
                              priceDiscount(order?.price, order) * order?.amount
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
            <div className="w-full fixed md:sticky bottom-0 left-0 right-0 md:top-5">
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
              </div>
              <div
                className={
                  moreInfoOrder
                    ? "px-5 py-1 md:py-5 bg-white"
                    : "px-5 py-1 md:py-5 bg-white"
                }
              >
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {`${user?.address}, ${user?.city}`}{" "}
                  </span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                </div>
              </div>
              <div
                className={
                  moreInfoOrder
                    ? "block px-5 py-1 md:py-5 bg-white"
                    : "md:block px-5 py-1 md:py-5 hidden bg-white"
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

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(diliveryPriceMemo)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-2 md:py-4 bg-white h-20 ">
                <div className="flex items-center gap-1 leading-none">
                  <span onClick={() => setMoreInfoOrder(!moreInfoOrder)}>
                    Tổng cộng
                  </span>
                  {listChecked?.length > 0 && (
                    <div>
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
                                diliveryPriceMemo
                                  ? priceMemo - diliveryPriceMemo - priceVoucher
                                  : priceMemo
                              )
                        }`}
                  </span>
                  <span
                    className={listChecked?.length === 0 ? "hidden" : "block"}
                    style={{ color: "#000", fontSize: "11px" }}
                  >
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </div>
              <ButtonComponent
                className="w-full m-0 md:w-80 md:mt-2"
                onClick={() => handleAddCard()}
                size={40}
                styleButton={{
                  background: "#422AFB",
                  height: "48px",
                  border: "none",
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
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateInforUser}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your  phone!" }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[
                { required: true, message: "Please input your  address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
