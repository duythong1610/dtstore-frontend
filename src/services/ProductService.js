import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async (search, limit) => {
  let res;
  if (search?.length > 0) {
    res = await axios.get(
      `${
        import.meta.env.VITE_API_KEY
      }/api/product/get-all?filter=name&filter=${search}&limit=${limit}`
    );
  } else if (limit) {
    res = await axios.get(
      `${import.meta.env.VITE_API_KEY}/api/product/get-all?limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${import.meta.env.VITE_API_KEY}/api/product/get-all`
    );
  }
  return res.data;
};

export const getTopProducts = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_KEY}/api/product/get-top-products`
  );
  return res.data;
};

export const getBrandByType = async (query) => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_KEY
    }/api/product/get-brand-by-type?typeId=${query}`
  );
  return res.data;
};

export const getProductByType = async (
  type,
  sortObj,
  brandId,
  minPrice,
  maxPrice
) => {
  const { sort, sortBy } = sortObj;
  let url = `${
    import.meta.env.VITE_API_KEY
  }/api/product/get-product-by-type/?typeCode=${type}`;
  if (brandId) {
    url += `&brandCode=${brandId}`;
  }
  if (sortBy) {
    url += `&sort=${sort}&sort=${sortBy}`;
  }
  if (minPrice && maxPrice) {
    url += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  }
  const res = await axios.get(url);
  return res.data;
};

export const getProductByBrandAndType = async (filter, typeCode) => {
  if (filter && typeCode) {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_KEY
      }/api/product/get-product-by-brand-and-type?filter=${filter}&typeCode=${typeCode}`
    );
    return res.data;
  }
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_KEY}/api/product/get-all-type`
  );
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_KEY}/api/product/get-details/${id}`
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
    `${import.meta.env.VITE_API_KEY}/api/product/get-details-type/${id}`
  );
  return res.data;
};

export const getAllProductSimilar = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_KEY}/api/product/get-product-similar/${id}`
  );
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_KEY}/api/product/create-product`,
    data
  );
  return res.data;
};

export const createTypeProduct = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_KEY}/api/product/create-type-product`,
    data
  );
  return res.data;
};

export const postComment = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${import.meta.env.VITE_API_KEY}/api/product/comment/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/product/delete-comment/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/product/reply-comment/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/product/like-comment/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/product/update-product/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/product/update-type-product/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/product/delete-product/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/product/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
