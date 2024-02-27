import Admin from "./pages/Admin";
import Moder from "./pages/Moder";

import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  PRODUCT_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  ADMINPAGE_ROUTE,
  MAIN_ROUTE,
  MODERPAGE_ROUTE,
  SALES_ROUTE,
  NEW_ROUTE,
  USER_ROUTE,
} from "./utils/consts";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import ProductPage from "./pages/ProductPage";
import Main from "./pages/Main";
import Sales from "./pages/Sales";
import New from "./pages/New";
import UserPage from "./pages/UserPage";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
  },
  {
    path: BASKET_ROUTE,
    Component: Basket,
  },
  {
    path: USER_ROUTE,
    Component: UserPage,
  },
];

export const adminRoutes = [
  {
    path: ADMINPAGE_ROUTE,
    Component: Admin,
  },
];
export const moderRoutes = [
  {
    path: MODERPAGE_ROUTE,
    Component: Moder,
  },
];
export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    Component: Shop,
  },
  {
    path: MAIN_ROUTE,
    Component: Main,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
  {
    path: SALES_ROUTE,
    Component: Sales,
  },
  {
    path: NEW_ROUTE,
    Component: New,
  },
  {
    path: PRODUCT_ROUTE + "/:id",
    Component: ProductPage,
  },
];
