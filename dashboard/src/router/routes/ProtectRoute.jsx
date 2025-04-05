// src/router/routes/ProtectRoute.jsx
import React, { Suspense, useEffect, useState } from 'react';
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
  const [shouldRedirect, setShouldRedirect] = useState(null);

  // Use useEffect to prevent navigation throttling
  useEffect(() => {
    // Check authentication
    if (!userInfo || !userInfo.role) {
      setShouldRedirect({ to: "/login", replace: true });
      return;
    }

    // Check role requirements
    if (route.role && userInfo.role !== route.role) {
      setShouldRedirect({ to: "/unauthorized", replace: true });
      return;
    }

    // Check status
    if (route.status && userInfo.status !== route.status) {
      const redirectTo = userInfo.status === 'pending'
        ? "/seller/account-pending"
        : "/seller/account-deactive";
      setShouldRedirect({ to: redirectTo, replace: true });
      return;
    }

    // Check visibility
    if (route.visibility && !route.visibility.includes(userInfo.status)) {
      setShouldRedirect({ to: "/seller/account-pending", replace: true });
      return;
    }

    // Check ability
    if (route.ability === 'seller' && userInfo.role !== 'seller') {
      setShouldRedirect({ to: "/unauthorized", replace: true });
      return;
    }

    // No redirection needed
    setShouldRedirect(null);
  }, [userInfo, route]);

  // Handle redirection
  if (shouldRedirect) {
    return <Navigate to={shouldRedirect.to} replace={shouldRedirect.replace} />;
  }

  // Default: show children
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
};

export default ProtectRoute;
