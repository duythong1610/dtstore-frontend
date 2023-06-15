import React from "react";

const AdminPage = React.lazy(() => import("../pages/AdminPage/AdminPage"));
const Home = React.lazy(() => import("../pages/HomePage/Home"));
const Login = React.lazy(() => import("../pages/LoginPage/Login"));
const ChangePassword = React.lazy(() =>
  import("../pages/ChangePasswordPage/ChangePasswordPage")
);
const ResetPassword = React.lazy(() =>
  import("../pages/ResetPasswordPage/ResetPasswordPage")
);
const MyOrder = React.lazy(() => import("../pages/MyOrderPage/MyOrder"));
const OrderPage = React.lazy(() => import("../pages/OrderPage/OrderPage"));
const PaymentPage = React.lazy(() =>
  import("../pages/PaymentPage/PaymentPage")
);
const ProductDetailsPage = React.lazy(() =>
  import("../pages/ProductDetailsPage/ProductDetailsPage")
);
const ProfilePage = React.lazy(() =>
  import("../pages/ProfilePage/ProfilePage")
);
const SignUpPage = React.lazy(() => import("../pages/SignUpPage/SignUpPage"));
const TypeProductPage = React.lazy(() =>
  import("../pages/TypeProductPage/TypeProductPage")
);
const OrderSuccess = React.lazy(() =>
  import("../pages/OrderSuccessPage/OrderSuccess")
);
const DetailsOrderPage = React.lazy(() =>
  import("../pages/DetailsOrderPage/DetailsOrderPage")
);
const ViewedProductsPage = React.lazy(() =>
  import("../pages/ViewedProductsPage/ViewedProductsPage")
);

const VnpayStatusPage = React.lazy(() =>
  import("../pages/VnpayStatusPage/VnpayStatusPage")
);

export const routes = [
  {
    path: "/",
    component: Home,
    isDefaultLayout: true,
  },

  {
    path: "/gio-hang",
    component: OrderPage,
    isDefaultLayout: true,
  },

  {
    path: "/doi-mat-khau",
    component: ChangePassword,
    isDefaultLayout: true,
  },
  {
    path: "/reset-password/",
    component: ResetPassword,
    isDefaultLayout: true,
  },

  {
    path: "/don-hang-cua-toi",
    component: MyOrder,
    isDefaultLayout: true,
  },
  {
    path: "/san-pham-da-xem",
    component: ViewedProductsPage,
    isDefaultLayout: true,
  },

  {
    path: "/chi-tiet-don-hang/:id",
    component: DetailsOrderPage,
    isDefaultLayout: true,
  },
  {
    path: "/thanh-toan",
    component: PaymentPage,
    isDefaultLayout: true,
  },

  {
    path: "/vnpay-payment/:id",
    component: VnpayStatusPage,
    isDefaultLayout: true,
  },
  {
    path: "/order-success",
    component: OrderSuccess,
    isDefaultLayout: true,
  },
  {
    path: "san-pham/:type/:id",
    component: TypeProductPage,
    isDefaultLayout: true,
  },
  {
    path: "/sign-in",
    component: Login,
    isDefaultLayout: false,
  },

  {
    path: "/sign-up",
    component: SignUpPage,
    isDefaultLayout: false,
  },
  {
    path: "/chi-tiet-san-pham/:id",
    component: ProductDetailsPage,
    isDefaultLayout: true,
  },

  // {
  //   path: "/product",
  //   component: ProductPage,
  //   isDefaultLayout: false,
  // },
  {
    path: "/thong-tin-tai-khoan",
    component: ProfilePage,
    isDefaultLayout: true,
  },

  {
    // path: "/system-admin",
    pathAdmin: "/system-admin",
    component: AdminPage,
    isDefaultLayout: false,
    isPrivate: true,
  },
];
