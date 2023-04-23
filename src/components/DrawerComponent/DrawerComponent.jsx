import { Drawer } from "antd";
import React from "react";

const DrawerComponent = ({
  children,
  title = "Drawer",
  placement = "right",
  isOpen = false,
  ...rest
}) => {
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Drawer
        title={title}
        placement={placement}
        onClose={onClose}
        open={isOpen}
        {...rest}
      >
        {children}
      </Drawer>
    </div>
  );
};

export default DrawerComponent;
