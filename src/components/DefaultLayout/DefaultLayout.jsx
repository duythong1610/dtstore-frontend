import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";

function DefaultLayout({ children }) {
  return (
    <div>
      <HeaderComponent />
      {children}
    </div>
  );
}

export default DefaultLayout;
