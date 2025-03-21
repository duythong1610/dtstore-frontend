import React, { useEffect, useState } from "react";
import { Form } from "antd";

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
  let freeshipPrice = sessionStorage.getItem("freeshipPrice");
  let itemsPrice = sessionStorage.getItem("itemsPrice");
  let totalPrice = sessionStorage.getItem("totalPrice");
  let shippingPrice = sessionStorage.getItem("shippingPrice");

  const dispatch = useDispatch();

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      user?.district &&
      totalPrice &&
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
