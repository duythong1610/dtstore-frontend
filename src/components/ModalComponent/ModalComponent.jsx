import { Modal } from "antd";
import React from "react";

const ModalComponent = ({
  title = "Modal",
  children,
  isOpen = false,
  ...rest
}) => {
  return (
    <div>
      <Modal title={title} open={isOpen} {...rest}>
        {children}
      </Modal>
    </div>
  );
};

export default ModalComponent;
