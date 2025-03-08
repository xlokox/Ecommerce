// src/router/routes/privateRoutes.js
import { adminRoutes } from "./adminRoutes";
import { sellerRoutes } from "./sellerRoutes";

/**
 * נתיבים שמיועדים למשתמשים עם תפקיד "admin" או "seller".
 * כולם עטופים בהמשך ב-ProtectRoute (ב-getRoutes).
 */
export const privateRoutes = [
  ...adminRoutes,
  ...sellerRoutes
];
