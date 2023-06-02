import { Form } from "antd";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useNavigate, useParams } from "react-router-dom";
import { removeAllOrderProduct } from "../../redux/slides/orderSlice";

const VnpayStatusPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  // const { state } = useLocation();

  const params = useParams();
  const { id } = params;

  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });

  let payment = sessionStorage.getItem("paymentMethod");
  let delivery = sessionStorage.getItem("delivery");
  let freeshipPrice = sessionStorage.setItem("freeshipPrice", freeshipPrice);
  let itemsPrice = sessionStorage.setItem("itemsPrice", state?.price);
  let totalPrice = sessionStorage.setItem("totalPrice", totalPrice);
  let shippingPrice = sessionStorage.setItem(
    "shippingPrice",
    handleDeliveryPrice()
  );

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

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.priceAfterDiscount * cur.amount;
    }, 0);
    return result;
  }, [order]);

  console.log(priceMemo);
  console.log(order);

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      user?.district &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        district: user?.district,
        paymentMethod: payment,
        isPaid: true,
        delivery,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        freeshipPrice: freeshipPrice,
        totalPrice: totalPrice,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  useEffect(() => {
    if (id === "0") {
      handleAddOrder();
    }
  }, [user?.id]);

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  useEffect(() => {
    if (id === "0" && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      sessionStorage.removeItem("paymentMethod");
      sessionStorage.removeItem("delivery");
      sessionStorage.removeItem("freeshipPrice");
      sessionStorage.removeItem("itemsPrice");
      sessionStorage.removeItem("totalPrice");
      sessionStorage.removeItem("shippingPrice");
      navigate("/order-success");
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  return (
    <div className="bg-slate-100 w-full h-screen">
      <Loading isLoading={isLoadingAddOrder}>
        <div></div>
      </Loading>
    </div>
  );
};

export default VnpayStatusPage;
