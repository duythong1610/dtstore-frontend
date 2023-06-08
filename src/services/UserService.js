import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    "https://dtstore-backend.onrender.com/api/user/sign-in",
    data
  );
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(
    "https://dtstore-backend.onrender.com/api/user/log-out"
  );
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(
    "https://dtstore-backend.onrender.com/api/user/sign-up",
    data
  );
  return res.data;
};

export const changePassword = async (data, access_token) => {
  const res = await axiosJWT.post(
    "https://dtstore-backend.onrender.com/api/user/change-password",
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );

  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axiosJWT.get(
    "https://dtstore-backend.onrender.com/api/user/get-all/",
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsUser = async (id, access_token) => {
  const res = await axiosJWT.get(
    `https://dtstore-backend.onrender.com/api/user/get-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const viewedProducts = async (productId, userId, access_token) => {
  const res = await axiosJWT.post(
    `https://dtstore-backend.onrender.com/api/user/viewed-products/${userId}`,
    { productId },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getViewedProducts = async (userId, access_token) => {
  const res = await axios.get(
    `https://dtstore-backend.onrender.com/api/user/get-viewed-products/${userId}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const updateUser = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `https://dtstore-backend.onrender.com/api/user/update-user/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteUser = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `https://dtstore-backend.onrender.com/api/user/delete-user/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyUser = async (data, access_token) => {
  const res = await axiosJWT.post(
    `https://dtstore-backend.onrender.com/api/user/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

// export const refreshToken = async () => {
//   const res = await axios.post(
//     "api/user/refresh-token",
//     {},
//     {
//       withCredentials: true,
//     }
//   );
//   return res.data;
// };

export const refreshToken = async (refreshToken) => {
  const res = await axios.post(
    "https://dtstore-backend.onrender.com/api/user/refresh-token",
    {},
    {
      headers: {
        token: `Bearer ${refreshToken}`,
      },
    }
  );
  return res.data;
};
