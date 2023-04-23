import React from "react";
import { Input } from "antd";

export const InputComponent = ({ size, placeholder, style, ...rest }) => {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      style={style}
      {...rest}
    ></Input>
  );
};

export default InputComponent;
