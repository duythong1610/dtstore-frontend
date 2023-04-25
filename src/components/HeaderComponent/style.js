import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  display: flex;
  align-items: center;
  padding: 10px 0;
  width: 1270px;
`;

export const WrapperHeaderCart = styled.div`
  padding: 8px 16px;
  display: flex;
  justify-content: center;
  align-item: center;
  color: rgb(128, 128, 137);
  gap: 8px;
  &:hover {
    background: #27272a1f;
    border-radius: 10px;
  }
`;

export const WrapperHeaderHome = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  color: rgb(128, 128, 137);
  gap: 8px;
  font-size: 16px;
  font-weight: 400;
  &:hover {
    background: #27272a1f;
    border-radius: 10px;
  }
`;

export const WrapperHeaderAccount = styled.div`
  cursor: pointer;
  max-width: 200px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  color: rgb(128, 128, 137);
  font-weight: 400;
  &:hover {
    background: #27272a1f;
    border-radius: 12px;
  }
`;

export const WrapperHeaderAccountText = styled.div`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`;

export const WrapperContentPopup = styled.p`
  padding: 5px 10px;
  margin: 4px 0;
  cursor: pointer;
  color: rgb(128, 128, 137);
  &:hover {
    background: #27272a1f;
    color: rgb(128, 128, 137);
  }
`;
