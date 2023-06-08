import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { routes } from "./routes";
import DefaultLayout from "./components/DefaultLayout/DefaultLayout";
import { Fragment, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
import { isJsonString } from "./until";
import * as UserService from "./services/UserService";
import jwt_decode from "jwt-decode";
import { updateUser } from "./redux/slides/userSlice";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import Loading from "./components/LoadingComponent/Loading";
import { useState } from "react";
import history from "./history";
import FallBackComponent from "./components/FallBackComponent/FallBackComponent";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      console.log(decoded);
      handleGetDetailUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);

  const handleDecoded = () => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();

      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const decodedRefreshToken = jwt_decode(refreshToken);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
          await UserService.logoutUser();
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          message.success("Đăng xuất thành công!");
          dispatch(resetUser());
        }
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  const handleGetDetailUser = async (id, access_token) => {
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, access_token);
    dispatch(
      updateUser({
        ...res?.data,
        access_token: access_token,
        refreshToken: refreshToken,
      })
    );
  };

  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        {/* <ThemeEditorProvider> */}
        <Router history={history}>
          <React.Suspense fallback={<FallBackComponent />}>
            <Routes>
              {routes.map((route, index) => {
                const Page = route.component;
                const isCheckAuth = route.isPrivate && user.isAdmin;
                const Layout = route.isDefaultLayout ? DefaultLayout : Fragment;
                return (
                  <Route
                    key={index}
                    path={isCheckAuth ? route.pathAdmin : route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
          </React.Suspense>
        </Router>
        {/* </ThemeEditorProvider> */}
      </ChakraProvider>
    </div>
  );
}

export default App;
