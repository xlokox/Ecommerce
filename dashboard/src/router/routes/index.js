import React from "react";
import publicRoutes from "../routes/publicRoutes";
import { privateRoutes } from "../routes/privateRoutes";
import { sellerRoutes } from "../routes/sellerRoutes";
import { adminRoutes } from "../routes/adminRoutes";
import MainLayout from "../../layout/MainLayout";
import SellerLayout from "../../layout/SellerLayout";
import ProtectRoute from "../routes/ProtectRoute";

export const getRoutes = () => {
  // Separate seller routes
  const sellerDashboardRoutes = sellerRoutes.filter(route =>
    route.path.startsWith('seller/dashboard')
  );

  // Other private routes (non-seller-dashboard)
  const otherPrivateRoutes = privateRoutes.filter(route =>
    !route.path.startsWith('seller/dashboard')
  );

  // Wrap all private routes with ProtectRoute
  const wrappedOtherPrivateRoutes = otherPrivateRoutes.map((route) => ({
    ...route,
    element: <ProtectRoute route={route}>{route.element}</ProtectRoute>
  }));

  // Wrap seller dashboard routes with ProtectRoute
  const wrappedSellerDashboardRoutes = sellerDashboardRoutes.map((route) => {
    // Extract the part of the path after 'seller/dashboard'
    let newPath = route.path.replace('seller/dashboard', '');

    // If the path starts with a slash, remove it to make it relative
    if (newPath.startsWith('/')) {
      newPath = newPath.substring(1);
    }

    // If the path is empty (for the main dashboard), use index: true
    if (newPath === '') {
      return {
        ...route,
        index: true,
        element: <ProtectRoute route={route}>{route.element}</ProtectRoute>
      };
    }

    return {
      ...route,
      path: newPath,  // Use the relative path
      element: <ProtectRoute route={route}>{route.element}</ProtectRoute>
    };
  });

  // Return array of routes
  return [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        ...publicRoutes,
        ...wrappedOtherPrivateRoutes
      ]
    },
    {
      path: "/seller/dashboard",
      element: <ProtectRoute route={{ role: 'seller' }}><SellerLayout /></ProtectRoute>,
      children: wrappedSellerDashboardRoutes
    }
  ];
};
