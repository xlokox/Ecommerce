// src/router/routes/publicRoutes.js

import { lazy } from "react";

// טעינה דינמית של קומפוננטות
const Login = lazy(() => import("../../views/auth/Login"));
const Register = lazy(() => import("../../views/auth/Register"));
const AdminLogin = lazy(() => import("../../views/auth/AdminLogin"));
const Home = lazy(() => import("../../views/Home"));
const UnAuthorized = lazy(() => import("../../views/UnAuthorized"));
const Success = lazy(() => import("../../views/Success"));

/**
 * כאן אנחנו מגדירים נתיבים ציבוריים (לא דורשים התחברות).
 * שים לב: אנו משתמשים ב-index: true במקום path: '/',
 * כדי להגדיר את הקומפוננטה Home כנתיב הראשי של '/', בלי להתנגש.
 */
const publicRoutes = [
  {
    index: true, 
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
  },
  {
    path: "unauthorized",
    element: <UnAuthorized />,
  },
  {
    path: "success",
    element: <Success />,
  },
];

export default publicRoutes;
