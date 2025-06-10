import React, { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_dashboard_data, get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import RealTimeAnalytics from '../../components/RealTimeAnalytics';
import SalesAnalytics from '../../components/SalesAnalytics';

const SellerDashboard = () => {
    console.log('🚀 SellerDashboard component is rendering!')

    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const {
        totalSale,
        totalOrder,
        totalProduct,
        totalSeller,
        loading,
        error
    } = useSelector(state=> state.dashboard)

    useEffect(() => {
        console.log('🔍 SellerDashboard - User Info:', userInfo)
        console.log('🔍 SellerDashboard - User Role:', userInfo?.role)

        // Call appropriate dashboard data based on user role
        if (userInfo?.role === 'admin') {
            console.log('📊 Calling admin dashboard data...')
            dispatch(get_admin_dashboard_data())
        } else if (userInfo?.role === 'seller') {
            console.log('📊 Calling seller dashboard data...')
            dispatch(get_seller_dashboard_data())
        }
    }, [dispatch, userInfo?.role])

    // Debug logging
    useEffect(() => {
        console.log('📈 Dashboard Data:', { totalSale, totalOrder, totalProduct, totalSeller, loading, error })
    }, [totalSale, totalOrder, totalProduct, totalSeller, loading, error])

    // Show loading state
    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='flex justify-center items-center h-64'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
                        <p className='text-gray-600'>Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='bg-red-50 border border-red-200 p-6 rounded-lg'>
                    <h3 className='text-lg font-semibold text-red-800 mb-2'>❌ Error Loading Dashboard</h3>
                    <p className='text-red-700 mb-4'>{error}</p>
                    <button
                        onClick={() => {
                            if (userInfo?.role === 'admin') {
                                dispatch(get_admin_dashboard_data())
                            } else if (userInfo?.role === 'seller') {
                                dispatch(get_seller_dashboard_data())
                            }
                        }}
                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='px-2 md:px-7 py-5'>
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>
                    {userInfo?.role === 'admin' ? 'Admin Dashboard' : 'Seller Dashboard'}
                </h1>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    <span>Live Dashboard</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8'>
                
                <div className='flex justify-between items-center p-5 bg-red-50 rounded-lg shadow-sm gap-3'>
                    <div className='flex flex-col justify-start items-start text-gray-700'>
                        <h2 className='text-3xl font-bold'>${totalSale || 0}</h2>
                        <span className='text-md font-medium'>Total Sales</span>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-red-500 flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-white' /> 
                    </div> 
                </div>

                <div className='flex justify-between items-center p-5 bg-purple-50 rounded-lg shadow-sm gap-3'>
                    <div className='flex flex-col justify-start items-start text-gray-700'>
                        <h2 className='text-3xl font-bold'>{totalProduct || 0}</h2>
                        <span className='text-md font-medium'>Products</span>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-purple-500 flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-white' /> 
                    </div> 
                </div>

                <div className='flex justify-between items-center p-5 bg-green-50 rounded-lg shadow-sm gap-3'>
                    <div className='flex flex-col justify-start items-start text-gray-700'>
                        <h2 className='text-3xl font-bold'>{totalSeller || 0}</h2>
                        <span className='text-md font-medium'>Sellers</span>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-green-500 flex justify-center items-center text-xl'>
                        <FaUsers className='text-white' /> 
                    </div> 
                </div>

                <div className='flex justify-between items-center p-5 bg-blue-50 rounded-lg shadow-sm gap-3'>
                    <div className='flex flex-col justify-start items-start text-gray-700'>
                        <h2 className='text-3xl font-bold'>{totalOrder || 0}</h2>
                        <span className='text-md font-medium'>Orders</span>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-blue-500 flex justify-center items-center text-xl'>
                        <FaCartShopping className='text-white' /> 
                    </div> 
                </div>
 
            </div>

            {/* Smart Sales Analytics */}
            <div className='mb-8'>
                <SalesAnalytics />
            </div>

            {/* Real-Time Analytics */}
            <div className='mb-8'>
                <RealTimeAnalytics />
            </div>

            {/* Success Message */}
            <div className='w-full bg-green-50 border border-green-200 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-green-800 mb-2'>✅ Unified Dashboard Working!</h3>
                <p className='text-green-700'>
                    The unified admin/seller dashboard is now successfully displaying real-time data with analytics.
                    You can see the total sales, products, orders, sellers, and real-time analytics from your database.
                </p>
            </div>
        </div>
    );
};

export default SellerDashboard;
