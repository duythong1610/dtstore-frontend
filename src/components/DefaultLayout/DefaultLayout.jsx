import React, { useEffect, useState } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import { UpCircleFilled } from "@ant-design/icons";

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
        <div className="fixed z-10 max-w-7xl m-auto left-0 right-4 md:right-0 bottom-[15vh] md:bottom-[10vh] text-right">
          <UpCircleFilled
            className="text-3xl md:text-5xl text-zinc-400"
            onClick={scrollToTop}
          />
        </div>
      )}
    </div>
  );
}

export default DefaultLayout;
