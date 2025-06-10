import React from "react";
import publicRoutes from "../routes/publicRoutes";
import MainLayout from "../../layout/MainLayout";
import SellerLayout from "../../layout/SellerLayout";
import AdminLayout from "../../layout/AdminLayout";
import ProtectRoute from "../routes/ProtectRoute";

// Import components directly - using lazy loading for better performance
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
const AddBanner = lazy(() => import("../../views/seller/AddBanner"));
const Pending = lazy(() => import("../../views/Pending"));
const Deactive = lazy(() => import("../../views/Deactive"));

console.log('🔧 Routes loaded - SellerDashboard component:', SellerDashboard);

export const getRoutes = () => {
  return [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        ...publicRoutes,
        // Non-dashboard private routes - ALLOW ALL AUTHENTICATED USERS
        {
          path: "seller/account-pending",
          element: <ProtectRoute route={{}}><Pending /></ProtectRoute>
        },
        {
          path: "seller/account-deactive",
          element: <ProtectRoute route={{}}><Deactive /></ProtectRoute>
        }
      ]
    },
    {
      path: "/seller/dashboard",
      element: <ProtectRoute route={{}}><SellerLayout /></ProtectRoute>,
      children: [
        {
          index: true,
          element: <ProtectRoute route={{}}><SellerDashboard /></ProtectRoute>
        },
        {
          path: "add-product",
          element: <ProtectRoute route={{}}><AddProduct /></ProtectRoute>
        },
        {
          path: "edit-product/:productId",
          element: <ProtectRoute route={{}}><EditProduct /></ProtectRoute>
        },
        {
          path: "products",
          element: <ProtectRoute route={{}}><Products /></ProtectRoute>
        },
        {
          path: "discount-product",
          element: <ProtectRoute route={{}}><DiscountProducts /></ProtectRoute>
        },
        {
          path: "orders",
          element: <ProtectRoute route={{}}><Orders /></ProtectRoute>
        },
        {
          path: "order/details/:orderId",
          element: <ProtectRoute route={{}}><OrderDetails /></ProtectRoute>
        },
        {
          path: "payments",
          element: <ProtectRoute route={{}}><Payments /></ProtectRoute>
        },
        {
          path: "chat-support",
          element: <ProtectRoute route={{}}><SellerToAdmin /></ProtectRoute>
        },
        {
          path: "chat-customer/:customerId",
          element: <ProtectRoute route={{}}><SellerToCustomer /></ProtectRoute>
        },
        {
          path: "chat-customer",
          element: <ProtectRoute route={{}}><SellerToCustomer /></ProtectRoute>
        },
        {
          path: "profile",
          element: <ProtectRoute route={{}}><Profile /></ProtectRoute>
        },
        {
          path: "add-banner/:productId",
          element: <ProtectRoute route={{}}><AddBanner /></ProtectRoute>
        }
      ]
    }
  ];
};
