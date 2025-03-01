import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Sidebar from './Sidebar';
import { socket } from '../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, updateSellers } from '../store/Reducers/chatReducer';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    // שליחת אירועים דרך הסוקט רק אם יש משתמש מחובר
    if (userInfo) {
      if (userInfo.role === 'seller') {
        socket.emit('add_seller', userInfo._id, userInfo);
      } else {
        socket.emit('add_admin', userInfo);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    // מאזין לעדכונים של לקוחות
    const handleActiveCustomer = (customers) => {
      dispatch(updateCustomer(customers));
    };

    // מאזין לעדכונים של סיילרים
    const handleActiveSeller = (sellers) => {
      dispatch(updateSellers(sellers));
    };

    socket.on('activeCustomer', handleActiveCustomer);
    socket.on('activeSeller', handleActiveSeller);

    // ניקוי מאזינים בעת unmount או שינוי התלויות
    return () => {
      socket.off('activeCustomer', handleActiveCustomer);
      socket.off('activeSeller', handleActiveSeller);
    };
  }, [dispatch]);

  const [showSidebar, setShowSidebar] = useState(false);

  return ( 
    <div className="bg-[#cdcae9] w-full min-h-screen">
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="ml-0 lg:ml-[260px] pt-[95px] transition-all">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
