import React from "react";
import vnpayImg from "../../assets/img/vnpay.png";
import later_money from "../../assets/img/later_money.png";
import momo from "../../assets/img/momo.png";
import facebook from "../../assets/img/facebook.svg";
import instagram from "../../assets/img/instagram.svg";
import zalo from "../../assets/img/zalo.svg";
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
      }  bg-white border-t-[3px] border-purple-600`}
    >
      <div className="flex flex-col md:flex-row max-w-7xl m-auto gap-5 bg-white p-4">
        <div className="md:w-[30%] md:max-w-[30%]">
          <h1 className="text-base">OCTOBER16TH STORE</h1>
          <span>
            October16th Store là project demo 1 số chức năng của một website bán
            hàng online (Điện thoại, laptop & Gaming Gear). Trong quá trình thực
            hiện project có những lỗi phát sinh, mong nhận được ý kiến và đóng
            góp của mọi người để{" "}
            <a
              href="https://www.facebook.com/16LuckyNumber"
              className="text-purple-600"
              target="_blank"
            >
              em/mình
            </a>{" "}
            có thể hoàn thiện hơn. Thanks!
          </span>
          <div>
            <h2 className="inline-block mb-0 mr-1">Lưu ý:</h2>
            <span>
              Vì đây là project chỉ mang tính chất demo nên không có chức năng
              thay thế hoàn toàn các website khác.
            </span>
          </div>
        </div>
        <div className="md:w-[35%] md:max-w-35%]">
          <h1 className="text-base">THÔNG TIN CÔNG TY</h1>
          <h2 className="mb-0">Trụ sở đặt tại: </h2>
          <div className="flex flex-col md:flex-row md:gap-2 mb-2 md:mb-0">
            <span>Ấp 3, xã Tân Thành, huyện Tân Thạnh, tỉnh Long An</span>
          </div>
          <h2 className="mb-0">Trụ sở văn phòng:</h2>
          <div className="flex flex-col md:flex-row md:gap-2 mb-2 md:mb-0">
            <span>43 Hồ Văn Huê, quận Phú Nhuận, thành phố Hồ Chí Minh</span>
          </div>
          <div className="flex md:flex-row gap-2 mb-2 md:mb-0">
            <h2 className="mb-0">Điện thoại:</h2>
            <span>0398.052.707</span>
          </div>
          <div className="flex md:flex-row gap-2 mb-2 md:mb-0">
            <h2 className="mb-0">Email:</h2>
            <span>dt.store.development@gmail.com</span>
          </div>
        </div>
        <div className="md:w-[20%] md:max-w[-20%]">
          <div>
            <h1 className="text-base">PHƯƠNG THỨC THANH TOÁN</h1>
            <div>
              <div className="flex items-center gap-2">
                <img src={vnpayImg} alt="vnpay-icon" width={32} height={32} />
                <span>VNPAY</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={later_money}
                  alt="later-money"
                  width={32}
                  height={32}
                />
                <span>Tiền mặt</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h1 className="text-base">ỦNG HỘ TÔI TẠI ĐÂY ^^</h1>
            <a href="https://me.momo.vn/unghodt" target="_blank">
              <img src={momo} alt="momo-icon" width={32} height={32} />
            </a>
          </div>
        </div>
        <div className="md:w-[15%] md:max-w-[15%] pb-[120px] md:pb-0">
          <h1 className="text-base">KẾT NỐI VỚI TÔI</h1>
          <div className="flex items-center gap-2">
            <a href="https://zalo.me/0398052707" className="max-w-[32px]">
              <img src={zalo} alt="zalo" className="brightness-110" />
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
