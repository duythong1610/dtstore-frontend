import React from "react";
import * as OrderService from "../../services/OrderService";
import { useLocation, useParams } from "react-router-dom";
const DetailsOrder = () => {
  const { params } = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
  };
  return <div>DetailsOrder</div>;
};

export default DetailsOrder;
