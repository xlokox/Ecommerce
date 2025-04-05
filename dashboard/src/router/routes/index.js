import React from "react";
import publicRoutes from "../routes/publicRoutes";
import { privateRoutes } from "../routes/privateRoutes";
import MainLayout from "../../layout/MainLayout";
import ProtectRoute from "../routes/ProtectRoute";
import { Navigate } from "react-router-dom";

// Import components directly
import Login from "../../views/auth/Login";
import Register from "../../views/auth/Register";
import Home from "../../views/Home";
import AdminLogin from "../../views/auth/AdminLogin";
import SellerLogin from "../../views/auth/SellerLogin";

export const getRoutes = () => {
  // Wrap private routes with ProtectRoute
  const wrappedPrivateRoutes = privateRoutes.map((route) => ({
    ...route,
    element: <ProtectRoute route={route}>{route.element}</ProtectRoute>
  }));

  // Wrap public routes with ProtectRoute for seller role
  const wrappedPublicRoutes = publicRoutes.map((route) => ({
    ...route,
    element: <ProtectRoute route={{...route, role: 'seller'}}>{route.element}</ProtectRoute>
  }));

  // Return array of routes
  return [
    // Public routes
    {
      path: "/",
      element: <Home />
    },
    // Redirect routes for direct access
    {
      path: "/seller/dashboard",
      element: <ProtectRoute route={{role: 'seller'}}><MainLayout /></ProtectRoute>
    },
    {
      path: "/admin/dashboard",
      element: <ProtectRoute route={{role: 'admin'}}><MainLayout /></ProtectRoute>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/admin/login",
      element: <AdminLogin />
    },
    {
      path: "/seller/login",
      element: <SellerLogin />
    },

    // Admin routes
    {
      path: "/admin",
      element: <MainLayout />,
      children: wrappedPrivateRoutes
    },

    // Seller routes
    {
      path: "/seller",
      element: <MainLayout />,
      children: wrappedPublicRoutes
    },

    // Fallback route
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ];
};
