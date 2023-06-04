import React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { orderConstant } from "../../constants";
import { convertPrice } from "../../until";
import Loading from "../../components/LoadingComponent/Loading";
import { LeftOutlined } from "@ant-design/icons";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const navigate = useNavigate();

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery(
    { queryKey: ["orders-details"], queryFn: fetchDetailsOrder },
    {
      enabled: id,
    }
  );
  const { isLoading, data } = queryOrder;

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen h-full w-full bg-slate-100">
        <div className="max-w-7xl m-auto min-h-screen h-auto">
          <div className="fixed flex items-center py-3 px-5 md:hidden top-0 left-0 right-0 h-12 z-10 bg-white">
            <div className="flex justify-center items-center">
              <LeftOutlined
                onClick={() => navigate(-1)}
                className={"w-8 h-8 text-lg text-blue-500 text-center"}
              />
            </div>
            <div className="text-center w-full mr-8">
              <h1 className="text-xl font-medium m-0">ĐƠN HÀNG</h1>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-5 pb-5 pt-16 md:pt-5 justify-between">
            <div>
              <div className="bg-white rounded-xl p-3 w-full">
                <h1 className="text-lg">Mã đơn hàng: {data?.orderCode}</h1>
                <p className="text-sm">
                  Ngày đặt hàng:{" "}
                  {new Date(data?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {data?.shippingAddress?.map((res) => {
              return (
                <>
                  <div>
                    <div className="bg-white rounded-xl p-3 w-full">
                      <h1 className="text-lg">Địa chỉ người nhận</h1>
                      <h2 className="text-base">{res?.fullName}</h2>
                      <div className="text-zinc-500">
                        <span>Điện thoại: </span> {res?.phone}
                      </div>
                      <div className="text-zinc-500">
                        <span>Địa chỉ: </span>{" "}
                        {`${res?.address}${res?.district ? "," : ""} ${
                          res?.district
                        }${res?.city ? "," : ""} ${res?.city}`}{" "}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}

            <div>
              <div className="bg-white rounded-xl p-3 w-full">
                <h1 className="text-lg">Hình thức giao hàng</h1>
                <div className="text-[rgba(0, 0, 0, 0.65)]">
                  <span
                    className={
                      data?.delivery === "fast"
                        ? "text-yellow-400 font-black"
                        : "text-red-500 font-black"
                    }
                  >
                    {" "}
                    {orderConstant.delivery[data?.delivery]}{" "}
                  </span>
                  <span className="text-zinc-500 font-medium">
                    {data?.delivery === "fast"
                      ? "Giao tiết kiệm"
                      : "Giao siêu tốc"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-xl p-3 w-full">
                <h1 className="mb-4 text-lg">Hình thức thanh toán</h1>
                <div className="payment-info">
                  {orderConstant.payment[data?.paymentMethod]}
                </div>
                <h1
                  className={data?.isPaid ? "text-green-500" : "text-red-500"}
                >
                  {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </h1>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 w-full">
              <div>
                <h1 className="mb-4 text-lg">Thông tin đơn hàng</h1>
              </div>
              <div className="flex flex-col gap-6">
                {data?.orderItems?.map((order) => {
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
                          onClick={() =>
                            navigate(`/chi-tiet-san-pham/${order?.product}`)
                          }
                        >
                          <h1>{order?.name}</h1>
                          <div className="flex gap-3">
                            <span
                              className={
                                order?.priceAfterDiscount
                                  ? "text-zinc-400 line-through"
                                  : "" + "text-red-500 font-medium"
                              }
                            >
                              {convertPrice(order?.price)}
                            </span>
                            <p>{"x" + order?.amount}</p>
                          </div>
                          {order?.price && (
                            <div className="flex gap-3">
                              <span className="text-red-500 font-medium">
                                {convertPrice(order?.priceAfterDiscount)}
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
            </div>
            <div className="bg-white rounded-xl p-3 w-full">
              <div className="text-[rgba(0, 0, 0, 0.65)]">
                <div className="flex justify-between">
                  <p>Tạm tính</p>
                  <span>{convertPrice(data?.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <p>Phí vận chuyển</p>
                  <span>{convertPrice(data?.shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <p>Khuyến mãi vận chuyển</p>
                  <span className="text-green-500">
                    - {convertPrice(data?.freeshipPrice)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <p>Thành tiền</p>
                  <span>{convertPrice(data?.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default DetailsOrderPage;
