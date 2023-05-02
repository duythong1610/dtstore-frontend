import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  position: sticky;
  left: 0;
  z-index: 6;
  span {
    color: rgb(36, 36, 36);
    font-weight: 500;
    font-size: 16px;
  }
  ::before {
    content: "";
    background: rgb(245, 245, 250);
    width: 100%;
    height: 11px;
    position: absolute;
    left: 0px;
    top: -11px;
    right: 0px;
  }
`;
export const WrapperStyleHeaderDilivery = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  }
  margin-bottom: 12px;
  border-radius: 12px;
  position: sticky;
  left: 0;
  z-index: 6;
  ::before {
    content: "";
    background: rgb(245, 245, 250);
    width: 100%;
    height: 21px;
    position: absolute;
    left: 0px;
    top: -21px;
    right: 0px;
  }
`;

export const WrapperLeft = styled.div`
  width: 100%;
`;

export const WrapperListOrder = styled.div``;

export const WrapperItemOrder = styled.div`
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 9px 16px;
  background: #fff;
  margin-top: 12px;
`;

export const WrapperPriceDiscount = styled.span`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
`;
export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 84px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
