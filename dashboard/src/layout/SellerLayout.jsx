import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaList, FaUser, FaSignOutAlt, FaTachometerAlt, FaProductHunt, FaShoppingBag, FaWallet, FaEnvelope } from 'react-icons/fa';
import { RiMenu2Fill } from 'react-icons/ri';
import { logout } from '../store/Reducers/authReducer';
import { useDispatch } from 'react-redux';
import defaultUserImage from '../assets/user.png';

const SellerLayout = () => {
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
      console.log('Logging out user with role:', userInfo?.role);
      dispatch(logout({ navigate, role: userInfo?.role || 'seller' }));
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback: manually clear auth and redirect
      localStorage.removeItem('accessToken');
      navigate('/login');
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
            <Link to="/seller/dashboard" className="text-white font-bold text-xl">Seller Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
                <img className="w-full h-full object-cover" src={userInfo?.image || defaultUserImage} alt="User" />
              </div>
              <div className="text-white">
                <h2 className="text-sm font-bold">{userInfo?.name || 'Seller'}</h2>
                <span className="text-xs">{userInfo?.email || 'seller@example.com'}</span>
              </div>
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
                <Link to="." className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="add-product" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/add-product' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaProductHunt />
                  <span>Add Product</span>
                </Link>
              </li>
              <li>
                <Link to="products" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/products' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaList />
                  <span>Products</span>
                </Link>
              </li>
              <li>
                <Link to="discount-product" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/discount-product' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaShoppingBag />
                  <span>Discount Products</span>
                </Link>
              </li>
              <li>
                <Link to="orders" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/orders' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaShoppingBag />
                  <span>Orders</span>
                </Link>
              </li>
              <li>
                <Link to="payments" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/payments' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaWallet />
                  <span>Payments</span>
                </Link>
              </li>
              <li>
                <Link to="chat-support" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/chat-support' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaEnvelope />
                  <span>Chat Support</span>
                </Link>
              </li>
              <li>
                <Link to="chat-customer" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/chat-customer' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaEnvelope />
                  <span>Chat Customer</span>
                </Link>
              </li>
              <li>
                <Link to="profile" className={`flex items-center gap-2 p-3 rounded-md ${pathname === '/seller/dashboard/profile' ? 'bg-[#7866ff] text-white' : 'text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white'}`}>
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 p-3 rounded-md text-[#d0d2d6] hover:bg-[#7866ff] hover:text-white">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
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

export default SellerLayout;
