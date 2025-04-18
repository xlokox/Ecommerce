import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_user_info } from '../store/Reducers/authReducer';

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    // If we have a token but no userInfo, try to fetch user info
    if (token && !userInfo) {
      dispatch(get_user_info());
    }
  }, [dispatch, token, userInfo]);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
