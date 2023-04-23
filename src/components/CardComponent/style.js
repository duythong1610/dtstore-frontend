import { Card } from "antd";
import styled from "styled-components";

export const StyleNameProduct = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 1.6;
`;

export const WrapperCardStyle = styled(Card)`
  margin-top: 20px;
  width: calc(20% - 20px) !important;
  & img {
    height: auto;
    width: calc(20% - 20px);
    object-fit: cover;
  }
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  position: relative;
`;

export const WrapperReportText = styled.div`
  font-size: 12px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
`;

export const WrapperPriceText = styled.div`
  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 500;
  margin: 8px 0;
`;

export const WrapperDiscountText = styled.span`
  color: rgb(255, 66, 78);
  font-size: 12px;
  font-weight: 500;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
`;
