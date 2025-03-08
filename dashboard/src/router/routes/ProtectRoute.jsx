// src/router/routes/ProtectRoute.jsx
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * ProtectRoute:
 * 1. אם אין userInfo או userInfo.role => לא מחובר => /login
 * 2. אם הנתיב דורש role מסוים ולא תואם => /unauthorized
 * 3. בדיקת status/visibility
 * 4. אם route.ability==='seller' ומשתמש לא seller => /unauthorized
 * 5. אחרת => מציג children
 */
const ProtectRoute = ({ route, children }) => {
  const { userInfo } = useSelector(state => state.auth);

  // אם אין מידע על המשתמש או אין תפקיד => /login
  if (!userInfo || !userInfo.role) {
    return <Navigate to="/login" replace />;
  }

  // אם הנתיב דורש תפקיד מסוים
  if (route.role) {
    // אם התפקיד לא תואם => /unauthorized
    if (userInfo.role !== route.role) {
      return <Navigate to="/unauthorized" replace />;
    }

    // בדיקת status
    if (route.status && userInfo.status !== route.status) {
      return userInfo.status === 'pending'
        ? <Navigate to="/seller/account-pending" replace />
        : <Navigate to="/seller/account-deactive" replace />;
    }

    // בדיקת visibility (מערך של סטטוסים)
    if (route.visibility && !route.visibility.includes(userInfo.status)) {
      return <Navigate to="/seller/account-pending" replace />;
    }
  }

  // אם אין route.role אך יש ability='seller', נבדוק שהתפקיד הוא seller
  if (route.ability === 'seller' && userInfo.role !== 'seller') {
    return <Navigate to="/unauthorized" replace />;
  }

  // ברירת מחדל => מציגים את children
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
};

export default ProtectRoute;
