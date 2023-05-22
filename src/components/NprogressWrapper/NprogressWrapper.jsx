import React, { useEffect } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useLocation } from "react-router-dom";

const NprogressWrapper = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    nprogress.start();
    nprogress.done();
  }, [location.pathname]);

  return <>{children}</>;
};

export default NprogressWrapper;
