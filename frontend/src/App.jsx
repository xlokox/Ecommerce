import React, { useEffect } from 'react';
// import logo from './logo.svg'; // הסרנו כי לא בשימוש
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Card from './pages/Card';
import Shipping from './pages/Shipping';
import Details from './pages/Details';
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import { get_category, get_banners } from './store/reducers/homeReducer';
import { useDispatch } from 'react-redux';
import CategoryShop from './pages/CategoryShop';
import SearchProducts from './pages/SearchProducts';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import ProtectUser from './utils/ProtectUser';
import Index from './components/dashboard/Index';
import Orders from './components/dashboard/Orders';
import ChangePassword from './components/dashboard/ChangePassword';
import Wishlist from './components/dashboard/Wishlist';
import OrderDetails from './components/dashboard/OrderDetails';
import Chat from './components/dashboard/Chat';
import ConfirmOrder from './pages/ConfirmOrder';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch categories and banners when the app loads
    console.log('Dispatching get_category and get_banners');
    dispatch(get_category());
    dispatch(get_banners());
  }, [dispatch]); // הוספנו dispatch למערך התלויות

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/shops' element={<Shops />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/blog/:id' element={<BlogDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/card' element={<Card />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/products?' element={<CategoryShop />} />
        <Route path='/products/search?' element={<SearchProducts />} />
        <Route path='/product/details/:slug' element={<Details />} />
        <Route path='/order/confirm?' element={<ConfirmOrder />} />

        <Route path='/dashboard' element={<ProtectUser />}>
          <Route path='' element={<Dashboard />}>
            <Route path='' element={<Index />} />
            <Route path='my-orders' element={<Orders />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='my-wishlist' element={<Wishlist />} />
            <Route path='order/details/:orderId' element={<OrderDetails />} />
            <Route path='chat' element={<Chat />} />
            <Route path='chat/:sellerId' element={<Chat />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
