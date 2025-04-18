import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { get_user_info, clearAuth } from '../store/Reducers/authReducer';

const Home = () => {
   const dispatch = useDispatch();
   const { role, userInfo, token } = useSelector(state => state.auth);

   useEffect(() => {
      // Check if token is valid
      try {
         // If we have a token but no userInfo, try to fetch user info
         if (token && !userInfo) {
            dispatch(get_user_info());
         }
      } catch (error) {
         console.error('Error in Home component:', error);
         // Clear auth state if there's an error
         dispatch(clearAuth());
      }
   }, [dispatch, token, userInfo]);

   // Redirect based on role
   if (role === 'seller') return <Navigate to='/seller/dashboard' replace />
   else if (role === 'admin') return <Navigate to='/admin/dashboard' replace />
   else return <Navigate to='/login' replace />
};

export default Home;