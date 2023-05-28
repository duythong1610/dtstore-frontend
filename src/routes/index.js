import AdminPage from "../pages/AdminPage/AdminPage";
import Home from "../pages/HomePage/Home";
import Login from "../pages/LoginPage/Login";
import MyOrder from "../pages/MyOrderPage/MyOrder";
import OrderPage from "../pages/OrderPage/OrderPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import OrderSuccess from "../pages/OrderSuccessPage/OrderSuccess";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import ViewedProductsPage from "../pages/ViewedProductsPage/ViewedProductsPage";
import VnpayStatusPage from "../pages/VnpayStatusPage/VnpayStatusPage";
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
  {
    path: "/product",
    component: ProductPage,
    isDefaultLayout: false,
  },
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
