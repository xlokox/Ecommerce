import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaList, FaUser, FaSignOutAlt, FaTachometerAlt, FaProductHunt, FaShoppingBag, FaWallet, FaEnvelope, FaUsers, FaThList } from 'react-icons/fa';
import { RiMenu2Fill } from 'react-icons/ri';
import { logout } from '../store/Reducers/authReducer';
import { useDispatch } from 'react-redux';
import defaultUserImage from '../assets/user.png';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userInfo } = useSelector(state => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    try {
      console.log('Logging out admin user');
      dispatch(logout({ navigate, role: 'admin' }));
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback: manually clear auth and redirect
      localStorage.removeItem('accessToken');
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [pathname]);

  return (
    <div className="bg-[#f8f5ff] w-full min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full py-5 px-2 md:px-7 bg-[#6a5fdf] z-40">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div onClick={toggleSidebar} className="w-[35px] h-[35px] rounded-sm bg-[#7866ff] flex justify-center items-center cursor-pointer text-white">
              <RiMenu2Fill />
            </div>
            <Link to="/admin/dashboard" className="text-white font-bold text-xl">Admin Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
                <img className="w-full h-full object-cover" src={userInfo?.image || defaultUserImage} alt="User" />
              </div>
              <div className="text-white">
                <h2 className="text-sm font-bold">{userInfo?.name || 'Admin'}</h2>
                <span className="text-xs">Admin</span>
              </div>
            </div>
            <div onClick={handleLogout} className="w-[40px] h-[40px] rounded-sm bg-[#7866ff] flex justify-center items-center cursor-pointer text-white">
              <FaSignOutAlt />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex mt-[70px]">
        {/* Sidebar */}
        <div className={`fixed top-[70px] left-0 h-full bg-[#6a5fdf] z-30 transition-all duration-300 ${sidebarOpen ? 'w-[260px]' : 'w-0'} overflow-hidden`}>
          <div className="py-5 px-3">
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="." className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="orders" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard/orders' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaShoppingBag />
                  <span>Orders</span>
                </Link>
              </li>
              <li>
                <Link to="category" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard/category' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaThList />
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link to="sellers" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard/sellers' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaUsers />
                  <span>Sellers</span>
                </Link>
              </li>
              <li>
                <Link to="payment-request" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard/payment-request' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaWallet />
                  <span>Payment Requests</span>
                </Link>
              </li>
              <li>
                <Link to="deactive-sellers" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard/deactive-sellers' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaUser />
                  <span>Deactive Sellers</span>
                </Link>
              </li>
              <li>
                <Link to="sellers-request" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard/sellers-request' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaList />
                  <span>Seller Requests</span>
                </Link>
              </li>
              <li>
                <Link to="chat-sellers" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/admin/dashboard/chat-sellers' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaEnvelope />
                  <span>Chat Sellers</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className={`ml-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-[260px]' : 'ml-0'} w-full min-h-screen`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
