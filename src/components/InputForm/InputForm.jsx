import React, { useState } from "react";
import { WrapperInputStyle } from "./style";

const InputForm = (props) => {
  // const [valueInput, setValueInput] = useState("");
  const { placeholder = "Nhập text", ...rest } = props;
  const handleChangeInput = (e) => {
    props.onChange(e.target.value);
  };
  return (
    <div>
      <WrapperInputStyle
        placeholder={placeholder}
        value={props.value}
        {...rest}
        onChange={handleChangeInput}
      ></WrapperInputStyle>
    </div>
  );
};

export default InputForm;
