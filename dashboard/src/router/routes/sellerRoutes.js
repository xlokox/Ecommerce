import { lazy } from "react";

const SellerDashboard = lazy(() => import("../../views/seller/SellerDashboard"));
const AddProduct = lazy(() => import("../../views/seller/AddProduct"));
const Products = lazy(() => import("../../views/seller/Products"));
const DiscountProducts = lazy(() => import("../../views/seller/DiscountProducts"));
const Orders = lazy(() => import("../../views/seller/Orders"));
const Payments = lazy(() => import("../../views/seller/Payments"));
const SellerToAdmin = lazy(() => import("../../views/seller/SellerToAdmin"));
const SellerToCustomer = lazy(() => import("../../views/seller/SellerToCustomer"));
const Profile = lazy(() => import("../../views/seller/Profile"));
const EditProduct = lazy(() => import("../../views/seller/EditProduct"));
const OrderDetails = lazy(() => import("../../views/seller/OrderDetails"));
const Pending = lazy(() => import("../../views/Pending"));
const Deactive = lazy(() => import("../../views/Deactive"));
const AddBanner = lazy(() => import("../../views/seller/AddBanner"));

export const sellerRoutes = [
  {
    path: "seller/account-pending",
    element: <Pending />,
    role: "seller"
  },
  {
    path: "seller/account-deactive",
    element: <Deactive />,
    role: "seller"
  },
  {
    path: "seller/dashboard",
    element: <SellerDashboard />,
    role: "seller"
  },
  {
    path: "seller/dashboard/add-product",
    element: <AddProduct />,
    role: "seller"
  },
  {
    path: "seller/dashboard/edit-product/:productId",
    element: <EditProduct />,
    role: "seller"
  },
  {
    path: "seller/dashboard/products",
    element: <Products />,
    role: "seller"
  },
  {
    path: "seller/dashboard/discount-product",
    element: <DiscountProducts />,
    role: "seller"
  },
  {
    path: "seller/dashboard/orders",
    element: <Orders />,
    role: "seller"
  },
  {
    path: "seller/dashboard/order/details/:orderId",
    element: <OrderDetails />,
    role: "seller"
  },
  {
    path: "seller/dashboard/payments",
    element: <Payments />,
    role: "seller"
  },
  {
    path: "seller/dashboard/chat-support",
    element: <SellerToAdmin />,
    role: "seller"
  },
  {
    path: "seller/dashboard/chat-customer/:customerId",
    element: <SellerToCustomer />,
    role: "seller"
  },
  {
    path: "seller/dashboard/chat-customer",
    element: <SellerToCustomer />,
    role: "seller"
  },
  {
    path: "seller/dashboard/profile",
    element: <Profile />,
    role: "seller"
  },
  {
    path: "seller/dashboard/add-banner/:productId",
    element: <AddBanner />,
    role: "seller"
  }
];
