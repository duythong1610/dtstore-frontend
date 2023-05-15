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
export const routes = [
  {
    path: "/",
    component: Home,
    isDefaultLayout: true,
  },

  {
    path: "/order",
    component: OrderPage,
    isDefaultLayout: true,
  },

  {
    path: "/my-order",
    component: MyOrder,
    isDefaultLayout: true,
  },
  {
    path: "/viewed-products",
    component: ViewedProductsPage,
    isDefaultLayout: true,
  },

  {
    path: "/details-order/:id",
    component: DetailsOrderPage,
    isDefaultLayout: true,
  },
  {
    path: "/payment",
    component: PaymentPage,
    isDefaultLayout: true,
  },

  {
    path: "/order-success",
    component: OrderSuccess,
    isDefaultLayout: true,
  },
  {
    path: "product/:type",
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
    path: "/product-detail/:id",
    component: ProductDetailsPage,
    isDefaultLayout: true,
  },
  {
    path: "/product",
    component: ProductPage,
    isDefaultLayout: false,
  },
  {
    path: "/profile-user",
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
