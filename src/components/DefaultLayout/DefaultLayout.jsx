import React, { useEffect, useState } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import { UpOutlined } from "@ant-design/icons";

function DefaultLayout({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      if (scrollPosition > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      <HeaderComponent />
      {children}
      <FooterComponent />

      {isVisible && (
        <div className="fixed z-50 right-[10vw] bottom-[15vh] md:bottom-[10vh]">
          <div
            className="w-12 h-12 flex items-center bg-purple-500 rounded-full cursor-pointer"
            onClick={() => scrollToTop()}
          >
            <UpOutlined className="text-white text-xl w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DefaultLayout;
