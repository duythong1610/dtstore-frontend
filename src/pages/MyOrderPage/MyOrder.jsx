import React, { useEffect, useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../until";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as message from "../../components/Message/Message";
import { LeftOutlined } from "@ant-design/icons";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };
  const user = useSelector((state) => state.user);

  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: fetchMyOrder },
    {
      enabled: state?.id && state?.token,
    }
  );
  const { isLoading, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    console.log(data);
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      {
        id: order._id,
        token: state?.token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancle) {
      message.error();
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {data?.map((order) => {
          return (
            <div>
              <div className="flex gap-3">
                <span className="w-24 h-24 inline-block">
                  <img
                    className="w-full h-full object-cover"
                    src={order?.image}
                  />
                </span>
                <div
                  className="w-[80%]"
                  onClick={() => navigate(`/product-detail/${order?.product}`)}
                >
                  <h1>{order?.name}</h1>
                  <div className="flex gap-3">
                    <span
                      className={
                        order?.priceDiscount
                          ? "text-zinc-400 line-through"
                          : "" + "text-red-500 font-medium "
                      }
                    >
                      {convertPrice(order?.price)}
                    </span>
                    <p>{"x" + order?.amount}</p>
                  </div>
                  {order?.priceDiscount && (
                    <div className="flex gap-3">
                      <span className="text-red-500 font-medium">
                        {convertPrice(order?.priceDiscount)}
                      </span>
                      <p>{"x" + order?.amount}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  console.log({ data });

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <div className="h-full max-w-7xl m-auto px-5 pt-12 bg-slate-100">
        <div className="fixed flex items-center py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-10 bg-white">
          <div className="flex justify-center items-center">
            <LeftOutlined
              onClick={() => navigate(-1)}
              className={"w-8 h-8 text-lg text-blue-500 text-center"}
            />
          </div>
          <div className="text-center w-full mr-8">
            <h1 className="text-xl font-medium m-0">
              ĐƠN HÀNG CỦA TÔI ({data?.length})
            </h1>
          </div>
        </div>

        <div className="flex flex-col">
          {data?.map((order) => {
            return (
              <div
                className="flex items-center w-full py-2 px-4 bg-white mt-3 flex-col m-auto rounded-md "
                key={order?._id}
              >
                <div className="flex items-start w-full mb-3 pt-3 flex-col">
                  <span className="text-base font-medium">Trạng thái</span>
                  <div className="flex gap-2">
                    <span className="font-medium">Giao hàng:</span>
                    <span
                      className={
                        order.isDelivered ? "text-green-500" : "text-red-500"
                      }
                    >
                      {`${
                        order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
                      }`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">Thanh toán:</span>
                    <span
                      className={
                        order.isPaid ? "text-green-500" : "text-red-500"
                      }
                    >
                      {`${order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`}
                    </span>
                  </div>
                </div>
                {renderProduct(order?.orderItems)}
                <div className="flex flex-col gap-2 w-full items-end pt-3">
                  <div>
                    <span style={{ color: "rgb(255, 66, 78)" }}>
                      Tổng tiền:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgb(56, 56, 61)",
                        fontWeight: 700,
                      }}
                    >
                      {convertPrice(order?.totalPrice)}
                    </span>
                  </div>
                  <div className="flex gap-3 w-full max-w-xs">
                    <ButtonComponent
                      onClick={() => handleCancelOrder(order)}
                      size={40}
                      styleButton={{
                        flex: "1 1 0%",
                        height: "40px",
                        border: "1px solid #d4cdcd",
                        borderRadius: "4px",
                        color: "red",
                        fontSize: "15px",
                        fontWeight: "400",
                      }}
                      textButton={"Hủy đơn hàng"}
                    ></ButtonComponent>
                    <ButtonComponent
                      onClick={() => handleDetailsOrder(order?._id)}
                      size={40}
                      styleButton={{
                        flex: "1 1 0%",
                        background: "#422AFB",
                        height: "40px",
                        border: "none",
                        width: "100%",
                        borderRadius: "4px",
                        color: "#fff",
                        fontSize: "15px",
                        fontWeight: "400",
                      }}
                      textButton={"Xem chi tiết"}
                    ></ButtonComponent>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Loading>
  );
};

export default MyOrderPage;
