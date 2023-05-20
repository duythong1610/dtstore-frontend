import { AutoComplete, Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { WrapperInfo, WrapperRight, WrapperTotal } from "./style";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice, isJsonString } from "../../until";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { removeAllOrderProduct } from "../../redux/slides/orderSlice";

import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from "../../services/PaymentService";
import {
  LeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import axios from "axios";
const VnpayStatusPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  // const { state } = useLocation();

  const params = useParams();
  const { id } = params;
  console.log(params);
  console.log(id);
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [moreInfoOrder, setMoreInfoOrder] = useState(false);
  const [districtsRender, setDistrictsRender] = useState([]);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });

  let payment = sessionStorage.getItem("paymentMethod");
  let delivery = sessionStorage.getItem("delivery");

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
      return total + cur.priceDiscount * cur.amount;
    }, 0);
    return result;
  }, [order]);

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
        itemsPrice: priceMemo,
        shippingPrice: 30000,
        totalPrice: priceMemo,
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

  console.log(order);
  console.log(user);

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    console.log(data);
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  console.log(dataAdd);
  useEffect(() => {
    if (id === "0" && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      document.cookie = "code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

1;
