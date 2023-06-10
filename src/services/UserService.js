import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_KEY}/api/user/sign-in`,
    data
  );
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_KEY}/api/user/log-out`
  );
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_KEY}/api/user/sign-up`,
    data
  );
  return res.data;
};

export const changePassword = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${import.meta.env.VITE_API_KEY}/api/user/change-password`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );

  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_KEY}/api/user/forgot-password`,
    data
  );

  return res.data;
};

export const resetPassword = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_KEY}/api/user/reset-password`,
    data
  );

  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axiosJWT.get(
    `${import.meta.env.VITE_API_KEY}/api/user/get-all/`,
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
    `${import.meta.env.VITE_API_KEY}/api/user/get-details/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/user/viewed-products/${userId}`,
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
    `${import.meta.env.VITE_API_KEY}/api/user/get-viewed-products/${userId}`,
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
    `${import.meta.env.VITE_API_KEY}/api/user/update-user/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/user/delete-user/${id}`,
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
    `${import.meta.env.VITE_API_KEY}/api/user/delete-many`,
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
    `${import.meta.env.VITE_API_KEY}/api/user/refresh-token`,
    {},
    {
      headers: {
        token: `Bearer ${refreshToken}`,
      },
    }
  );
  return res.data;
};
