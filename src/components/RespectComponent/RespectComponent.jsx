import React from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useState } from "react";
import { useEffect } from "react";

const RespectComponent = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isBanner = sessionStorage.getItem("banner");
  useEffect(() => {
    if (isBanner) return;
    setTimeout(() => {
      setIsOpenModal(true);
      sessionStorage.setItem("banner", "true");
    }, 3000);
  }, []);
  return (
    <div>
      {" "}
      <ModalComponent
        width={400}
        closable={false}
        footer={null}
        title={null}
        open={isOpenModal}
        // onOk={handleUpdateInfoUser}
        onCancel={() => setIsOpenModal(!isOpenModal)}
        className="custom-modal"
      >
        <div className="text-center">
          <div>
            {" "}
            <img
              src="https://images.unsplash.com/photo-1608643280984-b5e1df8d8874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
              alt=""
              className="h-[300px] md:h-[400px] w-full object-cover rounded-md"
            />
            <p className="text-purple-600 italic text-left">
              Cre: Trần Cao Minh Bách (Ảnh do nhân vật cung cấp)
            </p>
          </div>

          <h1 className="text-base text-left">
            Trong lúc deploy cho người dùng thử xuất hiện nhiều lỗi bảo mật liên
            quan đến người dùng, cảm ơn bro{" "}
            <a
              href="https://www.facebook.com/trancaominhbach"
              className="text-purple-600"
              target="_blank"
            >
              Bách Trần
            </a>{" "}
            đã giúp mình chỉ ra 1 số bug và cho mình 1 số kinh nghiệm về bảo mật
            thông tin người dùng. Thanks so much!
          </h1>
        </div>
      </ModalComponent>
    </div>
  );
};

export default RespectComponent;
