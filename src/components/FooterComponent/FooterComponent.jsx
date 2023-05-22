import React from "react";
import vnpayImg from "../../assets/img/vnpay.png";
import later_money from "../../assets/img/later_money.png";
import momo from "../../assets/img/momo.png";
import facebook from "../../assets/img/facebook.png";
import instagram from "../../assets/img/instagram.png";
import github from "../../assets/img/github.png";
import { useLocation } from "react-router-dom";

const FooterComponent = () => {
  const { pathname } = useLocation();
  return (
    <div
      className={`${
        pathname === "/order" && "hidden md:block"
      } th pb-[62px] md:pb-0`}
    >
      <div className="flex flex-col md:flex-row max-w-7xl m-auto gap-5 bg-white  p-5">
        <div className="md:w-[30%] md:max-w-[30%]">
          <h1 className="text-base">Giới thiệu về DT STORE</h1>
          <span>
            DT Store là sản phẩm tâm huyết của tôi về web app ecommerce, web có
            những tính năng bao gồm
          </span>
          <div>
            <h2 className="inline-block mb-0 mr-1">Về sản phẩm:</h2>
            <span>
              Hiển thị tất cả sản phẩm(giới hạn là 10), hiện thị danh mục sản
              phẩm, lọc theo danh mục sản phẩm, lọc theo giá(1 số giá đề xuất,
              hoặc có thể tùy chỉnh bằng thanh trượt), chi tiết sản phẩm, sản
              phẩm tương tự sản phẩm đang được xem chi tiết,...
            </span>
          </div>
          <div>
            <h2 className="inline-block mb-0 mr-1">Về tài khoản:</h2>
            <span>
              Đăng ký, đăng nhập, cập nhật thông tin tài khoản, giỏ hàng, thanh
              toán(tiền mặt khi nhận hàng & thanh toán qua cổng vnpay), lịch sử
              mua hàng, lịch sử các sản phẩm đã xem,...
            </span>
          </div>
        </div>
        <div className="md:w-[40%] md:max-w-40%]">
          <h1 className="text-base">Thông tin công ty</h1>
          <div className="flex gap-2">
            <h2>Trụ sở đặt tại: </h2>
            <span>Ấp 3, xã Tân Thành, huyện Tân Thạnh, tỉnh Long An</span>
          </div>
          <div className="flex gap-2">
            <h2> Trụ sở văn phòng: </h2>
            43 Hồ Văn Huê, quận Phú Nhuận, thành phố Hồ Chí Minh
            <span></span>
          </div>
          <div className="flex gap-2">
            <h2>Điện thoại:</h2>
            <span>0398.052.707</span>
          </div>
          <div className="flex gap-2">
            <h2>Email:</h2>
            <span>dt.store.development@gmail.com</span>
          </div>
        </div>
        <div className="md:w-[15%] md:max-w[-15%]">
          <div>
            <h1 className="text-base">Phương thức thanh toán</h1>
            <div>
              <div className="flex items-center gap-2">
                <img src={vnpayImg} alt="" width={32} height={32} />
                <span>VNPAY</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={later_money} alt="" width={32} height={32} />
                <span>Tiền mặt</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h1 className="text-base">Ủng hộ tôi tại đây ^^</h1>
            <a href="https://me.momo.vn/unghodt" target="_blank">
              <img src={momo} alt="" width={32} height={32} />
            </a>
          </div>
        </div>
        <div className="md:w-[15%] md:max-w-[15%]">
          <h1 className="text-base">Kết nối với tôi</h1>
          <div className="flex items-center gap-2">
            <a href="">
              <img src={github} alt="" />
            </a>
            <a href="https://www.facebook.com/16LuckyNumber" target="_blank">
              <img src={facebook} alt="" />
            </a>
            <a href="https://www.instagram.com/auduythong/ " target="_blank">
              <img src={instagram} alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
