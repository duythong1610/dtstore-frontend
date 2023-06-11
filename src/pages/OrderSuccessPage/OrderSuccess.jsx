import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { convertPrice } from "../../until";
import { CheckCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  console.log(state);
  return (
    <div className="bg-slate-100">
      <div className="p-5 max-w-7xl m-auto min-h-screen">
        <div className="w-full m-auto">
          <div className="mb-5">
            <img
              src="https://media2.giphy.com/media/BPJmthQ3YRwD6QqcVD/giphy.gif"
              alt="success"
              className="md:rounded-xl m-auto"
            />
          </div>
          <div className="p-5 bg-white rounded-xl shadow-md md:max-w-md m-auto">
            <p className="text-sm font-medium flex items-center gap-2">
              Yay! Đặt hàng thành công!{" "}
              <CheckCircleFilled className="text-green-500" />{" "}
            </p>
            {state?.payment === "later_money" && (
              <p className="text-sm font-medium">
                Chuẩn bị tiền mặt{" "}
                <span className="text-red-500">
                  {convertPrice(state?.totalPriceMemo)}
                </span>
              </p>
            )}

            <p className="text-sm font-medium flex items-center gap-2">
              Chúng tôi đã gửi email cảm ơn và mã giảm giá đính kèm vào email
              của bạn, vui lòng kiểm tra hộp thư, cảm ơn bạn đã ủng hộ
              October16th Store
            </p>

            <div className="flex gap-3 w-full">
              <ButtonComponent
                onClick={() =>
                  navigate("/don-hang-cua-toi", {
                    state: { id: user?.id, token: user?.access_token },
                  })
                }
                size={40}
                styleButton={{
                  flex: "1 1 0%",
                  height: "40px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  color: "#333",
                  fontSize: "15px",
                  fontWeight: "400",
                }}
                textButton={"Xem đơn đặt"}
              ></ButtonComponent>
              <ButtonComponent
                onClick={() => navigate("/")}
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
                textButton={"Quay về trang chủ"}
              ></ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
