import { Card } from "antd";
import styled from "styled-components";

export const StyleNameProduct = styled.div`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  width: 100%;
  font-weight: 500;
  line-height: 1.6;
`;

export const WrapperCardStyle = styled(Card)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  position: relative;
  :hover img {
    scale: 1.05;
    transition: scale 0.5s ease-out;
  }
`;

export const WrapperReportText = styled.div`
  font-size: 11px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  .ant-rate .ant-rate-star:not(:last-child) {
    margin-inline-end: 4px;
  }
`;

export const WrapperPriceText = styled.div`
  font-weight: 500;
  margin: 8px 0;
`;

export const WrapperPriceOriginText = styled.div`
  color: #808089;
  font-size: 16px;
`;

export const WrapperDiscountText = styled.span`
  color: rgb(255, 66, 78);
  font-size: 12px;
  font-weight: 500;
  text-decoration-line: none;
`;
