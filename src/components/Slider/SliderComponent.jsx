import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./style";

const SliderComponent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <WrapperSliderStyle {...settings}>
      {arrImages.map((img, index) => {
        return (
          <Image
            key={index}
            src={img}
            alt="slider"
            preview={false}
            width={"100%"}
          ></Image>
        );
      })}
    </WrapperSliderStyle>
  );
};

export default SliderComponent;
