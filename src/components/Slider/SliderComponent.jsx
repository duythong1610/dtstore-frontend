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
    autoplay: true,
  };
  return (
    <WrapperSliderStyle className="pt-20 md:pt-5" {...settings}>
      {arrImages.map((img, index) => {
        return (
          <Image
            className="!h-36 md:!h-auto"
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
