import React from "react";
import vnpayImg from "../../assets/img/vnpay.png";
import later_money from "../../assets/img/later_money.png";
import momo from "../../assets/img/momo.png";
import facebook from "../../assets/img/facebook.svg";
import instagram from "../../assets/img/instagram.svg";
import github from "../../assets/img/github.svg";
import { useLocation } from "react-router-dom";

const FooterComponent = () => {
  const { pathname } = useLocation();
  return (
    <div
      className={`${
        (pathname === "/gio-hang" ||
          pathname === "/thanh-toan" ||
          pathname === "/don-hang-cua-toi" ||
          pathname === "/thong-tin-tai-khoan") &&
        "hidden md:block"
      } pb-[62px] md:pb-0`}
    >
      <div className="flex flex-col md:flex-row max-w-7xl m-auto gap-5 bg-white p-4">
        <div className="md:w-[30%] md:max-w-[30%]">
          <h1 className="text-base">Giới thiệu về October16th</h1>
          <span>
            October16th là một project web app ecommerce được phát triển bởi Duy
            Thông trong quá trình học tập nhằm áp dụng những kiến thức cũ và tìm
            hiểu những kiến thức mới để tạo ra một project để đưa vào CV, vì đây
            là project "chỉnh chu" đầu tiên hi vọng nhận được ý kiến và đóng góp
            của mọi người để tui/em/anh có thể hoàn thiện hơn. Thanks for
            reading! Chúc mọi người 1 ngày tốt lành!
          </span>
          <div>
            <h2 className="inline-block mb-0 mr-1">Lưu ý:</h2>
            <span>
              Vì đây là project chỉ mang tính chất demo nên không có chức năng
              thay thế website ecommerce, đọc kĩ hướng dẫn sử dụng trước khi
              dùng.
            </span>
          </div>

          {/*
          <div>
            <h2 className="inline-block mb-0 mr-1">Về tài khoản:</h2>
            <span>
              Đăng ký, đăng nhập, cập nhật thông tin tài khoản, giỏ hàng, thanh
              toán(tiền mặt khi nhận hàng & thanh toán qua cổng vnpay), lịch sử
              mua hàng, lịch sử các sản phẩm đã xem,...
            </span>
          </div> */}
        </div>
        <div className="md:w-[40%] md:max-w-40%]">
          <h1 className="text-base">Thông tin công ty</h1>
          <div className="flex flex-col md:flex-row md:gap-2 mb-2 md:mb-0">
            <h2 className="mb-0">Trụ sở đặt tại: </h2>
            <span>Ấp 3, xã Tân Thành, huyện Tân Thạnh, tỉnh Long An</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2 mb-2 md:mb-0">
            <h2 className="mb-0">Trụ sở văn phòng:</h2>

            <span>43 Hồ Văn Huê, quận Phú Nhuận, thành phố Hồ Chí Minh</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2 mb- md:mb-0">
            <h2 className="mb-0">Điện thoại:</h2>
            <span>0398.052.707</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2 mb-2 md:mb-0">
            <h2 className="mb-0">Email:</h2>
            <span>dt.store.development@gmail.com</span>
          </div>
        </div>
        <div className="md:w-[15%] md:max-w[-15%]">
          <div>
            <h1 className="text-base">Phương thức thanh toán</h1>
            <div>
              <div className="flex items-center gap-2">
                <img src={vnpayImg} alt="vnpay-icon" width={32} height={32} />
                <span>VNPAY</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={later_money} alt="later-money" width={32} height={32} />
                <span>Tiền mặt</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h1 className="text-base">Ủng hộ tôi tại đây ^^</h1>
            <a href="https://me.momo.vn/unghodt" target="_blank">
              <img src={momo} alt="momo-icon" width={32} height={32} />
            </a>
          </div>
        </div>
        <div className="md:w-[15%] md:max-w-[15%]">
          <h1 className="text-base">Kết nối với tôi</h1>
          <div className="flex items-center gap-2">
            <a href="" className="max-w-[32px]">
              <img src={github} alt="github" />
            </a>
            <a
              href="https://www.facebook.com/16LuckyNumber"
              className="max-w-[32px]"
              target="_blank"
            >
              <img src={facebook} alt="facebook" />
            </a>
            <a
              href="https://www.instagram.com/auduythong/ "
              className="max-w-[32px]"
              target="_blank"
            >
              <img src={instagram} alt="instagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
