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
    <WrapperSliderStyle className="mt-16 md:!rounded-xl md:mt-0" {...settings}>
      {arrImages.map((img, index) => {
        return (
          <Image
            className="!h-36 md:!h-auto md:!rounded-xl"
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

export default React.memo(SliderComponent);
