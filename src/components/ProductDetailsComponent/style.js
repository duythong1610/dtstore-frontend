import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
  width: 64px;
  height: 64px;
`;

export const WrapperStyleColImage = styled(Col)`
  display: flex;
  flex-basis: unset;
`;

export const WrapperStyleNameProduct = styled.h1`
  color: rgb(36, 36, 36);
  font-size: 26px;
  font-weight: 400;
  line-height: 32px;
  word-break: break-word;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;

export const WrapperPriceProduct = styled.div`
  display: flex;
  align-items: flex-end;
  background: rgb(250, 250, 250);
  border-radius: 4px;
  padding: 20px 10px;
`;

export const WrapperPriceTextProduct = styled.h1`
  font-size: 32px;
  margin: 0px 8px 0px 0px;
  font-weight: 500;
`;

export const WrapperDescriptionProduct = styled.div`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 10;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  width: 100%;
  font-size: 16px;
  margin: 10px 0;
`;
export const WrapperAddressProduct = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 5px;
  }
  span.change-address {
    cursor: pointer;
    color: rgb(11, 116, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500px;
  }
`;

export const WrapperQuantityProduct = styled.h1`
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 120px;
`;

export const WrapperBtnQuantityProduct = styled.button`
  padding: 5px 8px;
  border: none;
  background: transparent;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 60px;
    border-top: none;
    border-bottom: none;
    .ant-input-number-handler-wrap {
      display: none;
    }
  }
`;
