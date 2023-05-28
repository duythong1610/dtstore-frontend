export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOptions = (arr) => {
  let result = [];
  console.log(arr);
  if (arr) {
    result = arr?.map((option) => {
      return {
        value: option._id,
        label: option.name,
      };
    });
  }
  return result;
};

export const convertPrice = (price) => {
  try {
    const result = price?.toLocaleString().replaceAll(",", ".");
    return `${result} VNĐ`;
  } catch (error) {
    return null;
  }
};

export const priceDiscount = (price, productDetails) => {
  return price - (productDetails?.price * productDetails?.discount) / 100;
};
