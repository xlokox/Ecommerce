import React from "react";
import publicRoutes from "../routes/publicRoutes";
import { privateRoutes } from "../routes/privateRoutes";
import MainLayout from "../../layout/MainLayout";
import ProtectRoute from "../routes/ProtectRoute";

export const getRoutes = () => {
  // עוטפים כל נתיב פרטי ב-<ProtectRoute> באמצעות map
  const wrappedPrivateRoutes = privateRoutes.map((route) => ({
    ...route,
    element: <ProtectRoute route={route}>{route.element}</ProtectRoute>
  }));

  // מחזירים מערך של נתיבים עם נתיב ראשי אחד שמכיל את כל הנתיבים כ-children
  return [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        ...publicRoutes,
        ...wrappedPrivateRoutes
      ]
    }
  ];
};
