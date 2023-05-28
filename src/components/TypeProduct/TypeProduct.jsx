import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ items, handleToggleClassContent }) => {
  console.log("re-render");
  const navigate = useNavigate();
  const handleNavigateType = (typeCode, typeId) => {
    navigate(`/san-pham/${typeCode}/${typeId}`);
    handleToggleClassContent();
  };

  function renderTypeProduct() {
    return items?.map((item) => {
      console.log(item.name);
      return (
        <div
          onClick={() => handleNavigateType(item?.code, item?._id)}
          className="m-auto md:m-0 px-4 py-2 md:p-2 cursor-pointer rounded-xl bg-white shadow-sm"
        >
          <div className="flex flex-col items-center gap-2">
            <img
              src={item?.thumbnail}
              alt="thumbnail"
              className="w-20 h-20 md:w-14 md:h-14 object-contain mix-blend-multiply"
            />

            <h1 className="text-base text-center md:hidden">{item?.name}</h1>
          </div>
        </div>
      );
    });
  }

  return <>{renderTypeProduct()}</>;
};

export default React.memo(TypeProduct);
