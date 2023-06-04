import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./style";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

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
    <Swiper
      // spaceBetween={50}
      modules={[Navigation, Autoplay]}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      navigation
      slidesPerGroupAuto
      slidesPerView={"auto"}
      className="!min-h-[0] mt-[85px] md:mt-5 md:!mx-0 !mx-4 rounded-xl"
    >
      {arrImages.map((img, index) => {
        return (
          <SwiperSlide key={index}>
            <Image
              className="rounded-xl !h-[150px] md:!h-[500px] !object-cover"
              src={img}
              alt="slider"
              preview={false}
              width={"100%"}
            ></Image>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default React.memo(SliderComponent);
