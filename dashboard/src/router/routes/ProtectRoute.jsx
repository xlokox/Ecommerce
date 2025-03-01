import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({ route, children }) => {
  const { role, userInfo } = useSelector(state => state.auth);

  // 1. אם אין role => לא מחובר => מפנה ל-login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // 2. אם הנתיב דורש role מסוים
  if (route.role) {
    // אם אין userInfo => לא ניתן לבדוק תפקיד => מפנים ל-login
    if (!userInfo) {
      return <Navigate to="/login" replace />;
    }

    // אם תפקיד המשתמש != תפקיד הנתיב
    if (userInfo.role !== route.role) {
      return <Navigate to="/unauthorized" replace />;
    }

    // 3. אם הנתיב דורש status מסוים
    if (route.status) {
      if (userInfo.status !== route.status) {
        // מפנים ל-pending או deactive
        return userInfo.status === 'pending'
          ? <Navigate to="/seller/account-pending" replace />
          : <Navigate to="/seller/account-deactive" replace />;
      }
    }
    // 4. אם יש visibility => מערך של סטטוסים מותרים
    else if (route.visibility) {
      // אם הסטטוס הנוכחי לא נכלל ב-visibility
      if (!route.visibility.includes(userInfo.status)) {
        return <Navigate to="/seller/account-pending" replace />;
      }
    }

    // אם הגענו לכאן => הכול תקין => מציגים את הקומפוננטה
    return <Suspense fallback={null}>{children}</Suspense>;
  }

  // 5. אם אין route.role => אולי יש route.ability
  if (route.ability === 'seller') {
    return <Suspense fallback={null}>{children}</Suspense>;
  }

  // 6. ברירת מחדל => מציגים את הקומפוננטה
  return <Suspense fallback={null}>{children}</Suspense>;
};

export default ProtectRoute;
