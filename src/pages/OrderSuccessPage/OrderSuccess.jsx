import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { convertPrice } from "../../until";
import { CheckCircleFilled } from "@ant-design/icons";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  return (
    <div className="bg-slate-100">
      <div className="p-5 max-w-7xl m-auto min-h-screen">
        <div className="mb-5 flex items-center">
          <img
            src="https://media2.giphy.com/media/BPJmthQ3YRwD6QqcVD/giphy.gif"
            alt=""
            className="md:rounded-xl"
          />
        </div>
        <div className="p-5 bg-white rounded-xl shadow-md md:max-w-md">
          <p className="text-sm font-medium flex items-center gap-2">
            Yay! Đặt hàng thành công!{" "}
            <CheckCircleFilled className="text-green-500" />{" "}
          </p>
          <p className="text-sm font-medium">
            Chuẩn bị tiền mặt{" "}
            <span className="text-red-500">
              {convertPrice(state?.totalPriceMemo)}
            </span>
          </p>

          <div className="flex gap-3 w-full max-w-xs">
            <ButtonComponent
              onClick={() => navigate("/don-hang-cua-toi")}
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
  );
};

export default OrderSuccess;
