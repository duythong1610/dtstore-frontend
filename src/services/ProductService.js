import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async (search, limit) => {
  let res;
  if (search?.length > 0) {
    res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-all?filter=name&filter=${search}&limit=${limit}`
    );
  } else if (limit) {
    res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-all?limit=${limit}`
    );
  } else {
    res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-all`
    );
  }
  return res.data;
};

export const getTopProducts = async () => {
  const res = await axios.get(
    "https://dtstore-backend.onrender.com/api/product/get-top-products"
  );
  return res.data;
};

export const getBrandByType = async (query) => {
  const res = await axios.get(
    `https://dtstore-backend.onrender.com/api/product/get-brand-by-type?typeId=${query}`
  );
  return res.data;
};

export const getProductByType = async (type, sortObj, brandId) => {
  const { sort, sortBy } = sortObj;
  console.log(sortBy);
  if (type && sortBy && brandId) {
    const res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-product-by-type/?typeCode=${type}&brandCode=${brandId}&sort=${sort}&sort=${sortBy}`
    );
    return res.data;
  }
  if (type && sortBy) {
    const res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-product-by-type/?typeCode=${type}&sort=${sort}&sort=${sortBy}`
    );
    return res.data;
  }
  if (type && brandId) {
    const res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-product-by-type/?typeCode=${type}&brandCode=${brandId}`
    );
    return res.data;
  } else {
    const res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-product-by-type/?typeCode=${type}`
    );
    return res.data;
  }
};

export const getProductByBrandAndType = async (filter, typeCode) => {
  if (filter && typeCode) {
    const res = await axios.get(
      `https://dtstore-backend.onrender.com/api/product/get-product-by-brand-and-type?filter=${filter}&typeCode=${typeCode}`
    );
    return res.data;
  }
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `https://dtstore-backend.onrender.com/api/product/get-all-type`
  );
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `https://dtstore-backend.onrender.com/api/product/get-details/${id}`
  );
  return res.data;
};

export const uploadImgToStorage = async () => {
  const res = await axios.post(
    `https://storage.googleapis.com/upload/storage/v1/b/my-image-product/o?uploadType=media&name=abc.png`,
    {
      headers: {
        "Content-type": "image/*",
        Authorization:
          "Bearer ya29.a0AWY7CknXHzH7RZFd2piC1w-b9TUUZXGHYQhLsE5S34uUd6PEJiAd-2erznM_FhA1ldhA1de36PqnMPnE8WqmLVshfEAzRdBp87te7v0CKWcQaX8oFz9V3wpGDW9YnRx0un7f8NzOOO5k0GyVNo8fU4Hk_RfnaCgYKATQSARESFQG1tDrp3pBGI3Ua71tASAYFn2I3EQ0163",
      },
    }
  );
  return res.data;
};

export const getDetailsTypeProduct = async (id) => {
  const res = await axios.get(
    `https://dtstore-backend.onrender.com/api/product/get-details-type/${id}`
  );
  return res.data;
};

export const getAllProductSimilar = async (id) => {
  const res = await axios.get(
    `https://dtstore-backend.onrender.com/api/product/get-product-similar/${id}`
  );
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(
    "https://dtstore-backend.onrender.com/api/product/create-product",
    data
  );
  return res.data;
};

export const createTypeProduct = async (data) => {
  const res = await axios.post(
    "https://dtstore-backend.onrender.com/api/product/create-type-product",
    data
  );
  return res.data;
};

export const postComment = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `https://dtstore-backend.onrender.com/api/product/comment/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteComment = async (id, data, access_token) => {
  console.log({ data });
  const res = await axiosJWT.put(
    `https://dtstore-backend.onrender.com/api/product/delete-comment/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const replyComment = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `https://dtstore-backend.onrender.com/api/product/reply-comment/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const likeComment = async (id, data, access_token) => {
  const res = await axiosJWT.post(
    `https://dtstore-backend.onrender.com/api/product/like-comment/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `https://dtstore-backend.onrender.com/api/product/update-product/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateTypeProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `https://dtstore-backend.onrender.com/api/product/update-type-product/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `https://dtstore-backend.onrender.com/api/product/delete-product/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `https://dtstore-backend.onrender.com/api/product/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
