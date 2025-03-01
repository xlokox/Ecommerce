// src/router/routes/index.js

import React from "react";
import publicRoutes from "../routes/publicRoutes";
import { privateRoutes } from "../routes/privateRoutes";
import MainLayout from "../../layout/MainLayout";
import ProtectRoute from "../routes/ProtectRoute";

/**
 * פונקציה שמחזירה אובייקט Route ראשי עם path: "/".
 * תחתיו כל הנתיבים (ציבוריים + פרטיים).
 * הנתיבים הפרטיים עטופים ב-<ProtectRoute>.
 */
export const getRoutes = () => {
  // עיטוף כל נתיב פרטי ב-<ProtectRoute>
  privateRoutes.forEach((route) => {
    route.element = <ProtectRoute route={route}>{route.element}</ProtectRoute>;
  });

  // יוצרים Route ראשי עם MainLayout, ו-children = public + private
  return {
    path: "/",
    element: <MainLayout />,
    children: [
      ...publicRoutes,
      ...privateRoutes
    ]
  };
};
