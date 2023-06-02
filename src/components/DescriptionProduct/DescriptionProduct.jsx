import React, { useState } from "react";

const DescriptionProduct = ({ productDescription }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const renderText = () => {
    const sentences = productDescription
      ?.split(/[.!?]/)
      .filter((sentence) => sentence.trim() !== "");
    console.log(sentences);

    if (showFullText) {
      return (
        <>
          <p>{productDescription}</p>

          {sentences?.length > 5 && (
            <button onClick={toggleText} className="font-medium w-full m-auto">
              Ẩn bớt
            </button>
          )}
        </>
      );
    } else {
      const limitedSentences = sentences?.slice(0, 5);
      return (
        <>
          <p className="whitespace-pre-wrap">{limitedSentences?.join(". ")}</p>

          {sentences?.length > 5 && (
            <button
              onClick={toggleText}
              className="font-medium w-full m-auto -mb-4"
            >
              Xem thêm...
            </button>
          )}
        </>
      );
    }
  };

  return (
    <div className="max-w-7xl m-auto px-4 md:p-0">
      <h1 className="font-medium text-base md:text-2xl mt-5">
        Thông tin sản phẩm
      </h1>
      <div>{renderText()}</div>
    </div>
  );
};

export default React.memo(DescriptionProduct);
