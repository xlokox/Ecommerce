// src/router/routes/privateRoutes.js

import { adminRoutes } from "./adminRoutes";
import { sellerRoutes } from "./sellerRoutes";

/**
 * נתיבים שמיועדים למשתמשים עם תפקיד (admin / seller).
 * כולם יעברו עטיפה ב-ProtectRoute בהמשך.
 */
export const privateRoutes = [
  ...adminRoutes,
  ...sellerRoutes
];
