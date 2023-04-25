import Slider from "react-slick";
import styled from "styled-components";

export const WrapperSliderStyle = styled(Slider)`
  width: 100%;
  padding-top: 20px;
  .slick-list {
    border-radius: 12px;
  }
  & .slick-arrow.slick-prev {
    left: 12px;
    top: 50%;
    z-index: 10;
    &::before {
      opacity: 0.5;
      font-size: 30px;
      color: #fff;
      position: absolute;
    }
  }

  & .slick-arrow.slick-next {
    right: 28px;
    top: 50%;
    z-index: 10;
    &::before {
      opacity: 0.5;
      font-size: 30px;
      color: #fff;
      position: absolute;
    }
  }

  & .slick-dots {
    z-index: 10;
    bottom: 15px !important;
    li {
      button {
        &::before {
          font-size: 10px !important;
          color: #fff;
        }
      }
    }
    li.active {
      button {
        &::before {
          font-size: 10px !important;
          color: #fff;
        }
      }
    }
  }
`;
