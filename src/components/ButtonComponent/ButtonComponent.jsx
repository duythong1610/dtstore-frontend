import React from "react";
import { Button } from "antd";

const ButtonComponent = ({
  size,
  styleButton,
  textButton,
  icon,
  // disabled,
  ...rest
}) => {
  return (
    <>
      <Button
        // disabled={disabled}
        size={size}
        icon={icon}
        style={styleButton}
        {...rest}
      >
        {textButton}
      </Button>
    </>
  );
};

export default ButtonComponent;
