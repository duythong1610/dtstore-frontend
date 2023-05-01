import { Spin } from "antd";

const Loading = ({ children, isLoading, delay = 200 }) => {
  return (
    <Spin spinning={isLoading} delay={delay} className="w-full">
      {children}
    </Spin>
  );
};

export default Loading;
