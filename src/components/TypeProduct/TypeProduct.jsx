import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ items, handleToggleClassContent }) => {
  console.log(items);
  const navigate = useNavigate();
  const handleNavigateType = (typeCode) => {
    navigate(`/product/${typeCode}`, { state: typeCode });
    handleToggleClassContent();
  };

  function renderTypeProduct() {
    return items?.map((item) => {
      console.log(item.name);
      return (
        <div
          onClick={() => handleNavigateType(item?.code)}
          className="m-auto md:m-0 px-4 py-2 cursor-pointer hover:bg-zinc-200 rounded-lg"
        >
          <div className="flex flex-col md:flex-row items-center gap-2">
            <img
              src={item?.thumbnail}
              alt="thumbnail"
              className="w-20 h-20 md:w-8 md:h-8 object-contain mix-blend-multiply"
            />

            <h1 className="text-base text-center mt-2 md:m-0">{item?.name}</h1>
          </div>
        </div>
      );
    });
  }

  return <>{renderTypeProduct()}</>;
};

export default React.memo(TypeProduct);
