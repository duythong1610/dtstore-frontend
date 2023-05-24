import React, { useState } from "react";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
function ButtonInputSearch(props) {
  const {
    size,
    placeholder,
    textButton,
    border,
    backgroundColorInput,
    onClearSearchText,
    searchText,
    // backgroundColorButton = "rgb(13,92,182)",
    colorButton = "rgb(128, 128, 137)",
  } = props;

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  return (
    <div
      style={{
        display: "flex",
        borderRadius: "20px",
        overflow: "hidden",
        border: "2px solid rgb(221, 221, 227)",
      }}
    >
      <div className="flex items-center flex-1">
        <InputComponent
          className="focus:!shadow-none"
          size={size}
          placeholder={placeholder}
          style={{
            backgroundColor: backgroundColorInput,
            border: border,
            borderRadius: 0,
            padding: "8px 16px",
            boxShadow: "none",
          }}
          {...props}
        />
        {searchText && (
          <CloseOutlined
            className="p-2 cursor-pointer outline-none text-zinc-400"
            onClick={onClearSearchText}
          />
        )}
      </div>
      <ButtonComponent
        size={size}
        icon={<SearchOutlined />}
        border={border}
        styleButton={{
          backgroundColor: isHovering ? "rgb(66, 42, 251)" : "transparent",
          color: isHovering ? "#fff" : colorButton,
          border: border,
          borderRadius: 0,
          fontSize: "16px",
          padding: "8px 16px",
          fontWeight: 400,
          display: "flex",
          alignItems: "center",
          height: "100%",
          borderLeft: "2px solid rgb(221, 221, 227)",
        }}
        textButton={textButton}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      ></ButtonComponent>
    </div>
  );
}

export default ButtonInputSearch;
