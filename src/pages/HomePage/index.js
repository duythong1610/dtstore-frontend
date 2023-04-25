import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  margin: 8px 0px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    background: rgb(13, 92, 182);
    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
`;
