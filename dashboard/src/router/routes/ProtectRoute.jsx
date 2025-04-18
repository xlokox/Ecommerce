// src/router/routes/ProtectRoute.jsx
import React, { Suspense, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { get_user_info, clearAuth } from '../../store/Reducers/authReducer';

/**
 * ProtectRoute:
 * 1. אם אין userInfo או userInfo.role => לא מחובר => /login
 * 2. אם הנתיב דורש role מסוים ולא תואם => /unauthorized
 * 3. בדיקת status/visibility
 * 4. אם route.ability==='seller' ומשתמש לא seller => /unauthorized
 * 5. אחרת => מציג children
 */
const ProtectRoute = ({ route, children }) => {
  const dispatch = useDispatch();
  const { userInfo, token, role } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/login");

  // Track if we've attempted to fetch user info
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If we don't have a token, redirect to login
        if (!token) {
          console.log('ProtectRoute: No token, redirecting to login');
          setShouldRedirect(true);
          setRedirectPath("/login");
          setIsLoading(false);
          return;
        }

        // If we have a token but no userInfo and haven't attempted to fetch yet
        if (token && !userInfo && !hasAttemptedFetch) {
          console.log('ProtectRoute: Fetching user info with token');
          setHasAttemptedFetch(true);
          try {
            await dispatch(get_user_info()).unwrap();
          } catch (error) {
            console.error('Error fetching user info:', error);
            dispatch(clearAuth());
            setShouldRedirect(true);
            setRedirectPath("/login");
          }
        }
        // If we've tried to fetch user info but still don't have it
        else if (hasAttemptedFetch && !userInfo) {
          console.log('ProtectRoute: Failed to get user info, redirecting to login');
          dispatch(clearAuth());
          setShouldRedirect(true);
          setRedirectPath("/login");
        }
      } catch (error) {
        console.error('Error in ProtectRoute:', error);
        // Clear auth state if there's an error
        dispatch(clearAuth());
        setShouldRedirect(true);
        setRedirectPath("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, token, userInfo, hasAttemptedFetch]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if needed
  if (shouldRedirect) {
    console.log(`Redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // Check if we have user info
  if (!userInfo) {
    console.log('No userInfo, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Make sure userInfo has a role property
  if (!userInfo.role) {
    console.log('No role in userInfo, redirecting to login');
    dispatch(clearAuth()); // Clear auth state to prevent loops
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
