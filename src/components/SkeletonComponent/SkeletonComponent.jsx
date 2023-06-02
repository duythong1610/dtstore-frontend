import React from "react";
import "./style.css";
import { Col, Row } from "antd";

const SkeletonComponent = () => {
  return (
    <Row className="flex flex-col md:flex-row md:flex-nowrap w-full gap-3 md:gap-0">
      <Col className="max-w-full" span={10}>
        <div className="h-60 md:h-80 w-full object-contain block rounded-md skeleton" />
      </Col>
      <Col
        span={14}
        className="max-w-full md:pl-5 flex flex-col flex-none md:flex-auto"
      >
        <div className="flex flex-col gap-3 md:gap-4 mb-[30px]">
          <div className="skeleton h-11 w-full rounded-md" />
          <div className="skeleton h-6 w-1/2 rounded-md" />
          <div className="skeleton h-14 w-full rounded-md" />
          <div className="skeleton h-[72px] w-full rounded-md" />
          <div className="skeleton h-6 w-1/4 rounded-md" />
          <div className="skeleton h-9 w-1/3 rounded-md" />
        </div>

        <div className="md:flex gap-4 hidden">
          <div className="skeleton h-12 w-[220px] rounded-md" />
          <div className="skeleton h-12 w-[220px] rounded-md" />
        </div>
      </Col>
    </Row>
  );
};

export default SkeletonComponent;
