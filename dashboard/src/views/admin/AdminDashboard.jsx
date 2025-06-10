import React, { useEffect, useState } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { FaUsers, FaShoppingCart, FaEye, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import seller from '../../assets/seller.png'
import { get_admin_dashboard_data } from '../../store/Reducers/dashboardReducer';
import RealTimeAnalytics from '../../components/RealTimeAnalytics';
import moment from 'moment';

const AdminDashboard = () => {
    const dispatch = useDispatch()
    const {
        totalSale,
        totalOrder,
        totalProduct,
        totalSeller,
        recentOrder,
        recentMessage,
        monthlySales,
        dailySales,
        orderStatusStats,
        paymentStatusStats,
        topProducts,
        loading,
        error
    } = useSelector(state=> state.dashboard)
    const {userInfo} = useSelector(state=> state.auth)

    const [refreshInterval, setRefreshInterval] = useState(null)

    useEffect(() => {
        dispatch(get_admin_dashboard_data())

        // Set up auto-refresh every 30 seconds
        const interval = setInterval(() => {
            dispatch(get_admin_dashboard_data())
        }, 30000)

        setRefreshInterval(interval)

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [dispatch])

    // Helper function to format monthly sales data
    const formatMonthlySalesData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const salesData = new Array(12).fill(0)
        const orderData = new Array(12).fill(0)

        monthlySales.forEach(item => {
            const monthIndex = item._id.month - 1
            salesData[monthIndex] = item.totalSales
            orderData[monthIndex] = item.orderCount
        })

        return { months, salesData, orderData }
    }

    // Helper function to format daily sales data
    const formatDailySalesData = () => {
        const last30Days = []
        const salesData = []

        for (let i = 29; i >= 0; i--) {
            const date = moment().subtract(i, 'days')
            last30Days.push(date.format('MMM DD'))

            const dayData = dailySales.find(item =>
                item._id.year === date.year() &&
                item._id.month === date.month() + 1 &&
                item._id.day === date.date()
            )

            salesData.push(dayData ? dayData.totalSales : 0)
        }

        return { days: last30Days, salesData }
    }

    const { months, salesData, orderData } = formatMonthlySalesData()
    const { days, salesData: dailySalesData } = formatDailySalesData()

    // Monthly Sales Chart Configuration
    const monthlySalesChart = {
        series: [
            {
                name: "Revenue ($)",
                data: salesData
            },
            {
                name: "Orders",
                data: orderData
            }
        ],
        options: {
            colors: ['#059473', '#3b82f6'],
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6',
                toolbar: {
                    show: true
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {
                categories: months,
                labels: {
                    style: {
                        colors: '#d0d2d6'
                    }
                }
            },
            yaxis: [
                {
                    title: {
                        text: 'Revenue ($)',
                        style: {
                            color: '#059473'
                        }
                    },
                    labels: {
                        style: {
                            colors: '#d0d2d6'
                        },
                        formatter: (val) => `$${val.toLocaleString()}`
                    }
                },
                {
                    opposite: true,
                    title: {
                        text: 'Orders',
                        style: {
                            color: '#3b82f6'
                        }
                    },
                    labels: {
                        style: {
                            colors: '#d0d2d6'
                        }
                    }
                }
            ],
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                labels: {
                    colors: '#d0d2d6'
                }
            },
            grid: {
                borderColor: '#374151'
            },
            tooltip: {
                theme: 'dark'
            }
        }
    }

    // Daily Sales Chart Configuration
    const dailySalesChart = {
        series: [{
            name: 'Daily Sales',
            data: dailySalesData
        }],
        options: {
            colors: ['#10b981'],
            chart: {
                type: 'area',
                background: 'transparent',
                foreColor: '#d0d2d6',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                categories: days,
                labels: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#d0d2d6'
                    },
                    formatter: (val) => `$${val.toLocaleString()}`
                }
            },
            grid: {
                show: false
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: (val) => `$${val.toLocaleString()}`
                }
            }
        }
    }

    // Order Status Pie Chart
    const orderStatusChart = {
        series: orderStatusStats.map(stat => stat.count),
        options: {
            labels: orderStatusStats.map(stat => stat._id),
            colors: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'],
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6'
            },
            legend: {
                position: 'bottom',
                labels: {
                    colors: '#d0d2d6'
                }
            },
            tooltip: {
                theme: 'dark'
            }
        }
    }




    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                    Error: {error}
                </div>
            </div>
        )
    }

    return (
        <div className='px-2 md:px-7 py-5'>
            {/* Header with refresh indicator */}
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Admin Dashboard</h1>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    <span>Auto-refreshing every 30s</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8'>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-sm hover:shadow-md transition-shadow gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>${totalSale?.toLocaleString()}</h2>
                        <span className='text-md font-medium'>Total Sales</span>
                        <div className='flex items-center mt-1'>
                            <FaArrowUp className='text-green-500 text-xs mr-1' />
                            <span className='text-xs text-green-600'>+12.5%</span>
                        </div>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-gradient-to-r from-red-500 to-red-600 flex justify-center items-center text-xl shadow-lg'>
                        <MdCurrencyExchange className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-sm hover:shadow-md transition-shadow gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalProduct?.toLocaleString()}</h2>
                        <span className='text-md font-medium'>Products</span>
                        <div className='flex items-center mt-1'>
                            <FaArrowUp className='text-green-500 text-xs mr-1' />
                            <span className='text-xs text-green-600'>+5.2%</span>
                        </div>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex justify-center items-center text-xl shadow-lg'>
                        <MdProductionQuantityLimits className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-sm hover:shadow-md transition-shadow gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalSeller?.toLocaleString()}</h2>
                        <span className='text-md font-medium'>Sellers</span>
                        <div className='flex items-center mt-1'>
                            <FaArrowUp className='text-green-500 text-xs mr-1' />
                            <span className='text-xs text-green-600'>+8.1%</span>
                        </div>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-gradient-to-r from-green-500 to-green-600 flex justify-center items-center text-xl shadow-lg'>
                        <FaUsers className='text-white' />
                    </div>
                </div>

                <div className='flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm hover:shadow-md transition-shadow gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalOrder?.toLocaleString()}</h2>
                        <span className='text-md font-medium'>Orders</span>
                        <div className='flex items-center mt-1'>
                            <FaArrowUp className='text-green-500 text-xs mr-1' />
                            <span className='text-xs text-green-600'>+15.3%</span>
                        </div>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex justify-center items-center text-xl shadow-lg'>
                        <FaCartShopping className='text-white' />
                    </div>
                </div>

            </div>

            {/* Charts Section */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>

                {/* Monthly Sales Chart */}
                <div className='lg:col-span-2'>
                    <div className='w-full bg-white p-6 rounded-lg shadow-sm border'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='font-semibold text-lg text-gray-800'>Monthly Sales & Orders</h2>
                            <div className='flex items-center gap-2'>
                                <MdTrendingUp className='text-green-500' />
                                <span className='text-sm text-green-600'>Trending Up</span>
                            </div>
                        </div>
                        <Chart options={monthlySalesChart.options} series={monthlySalesChart.series} type='line' height={350} />
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div>
                    <div className='w-full bg-white p-6 rounded-lg shadow-sm border'>
                        <h2 className='font-semibold text-lg text-gray-800 mb-4'>Order Status</h2>
                        {orderStatusStats.length > 0 ? (
                            <Chart options={orderStatusChart.options} series={orderStatusChart.series} type='donut' height={300} />
                        ) : (
                            <div className='flex items-center justify-center h-64 text-gray-500'>
                                No order data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Daily Sales and Top Products */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>

                {/* Daily Sales Chart */}
                <div>
                    <div className='w-full bg-white p-6 rounded-lg shadow-sm border'>
                        <h2 className='font-semibold text-lg text-gray-800 mb-4'>Daily Sales (Last 30 Days)</h2>
                        <Chart options={dailySalesChart.options} series={dailySalesChart.series} type='area' height={300} />
                    </div>
                </div>

                {/* Top Products */}
                <div>
                    <div className='w-full bg-white p-6 rounded-lg shadow-sm border'>
                        <h2 className='font-semibold text-lg text-gray-800 mb-4'>Top Selling Products</h2>
                        <div className='space-y-4'>
                            {topProducts.length > 0 ? topProducts.map((product, index) => (
                                <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center'>
                                            <span className='text-sm font-bold text-gray-600'>#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className='font-medium text-gray-800 truncate max-w-32'>{product.name}</p>
                                            <p className='text-sm text-gray-600'>{product.totalSold} sold</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold text-green-600'>${product.totalRevenue?.toLocaleString()}</p>
                                        <p className='text-xs text-gray-500'>Revenue</p>
                                    </div>
                                </div>
                            )) : (
                                <div className='text-center text-gray-500 py-8'>
                                    No product data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-Time Analytics Section */}
            <div className='mb-8'>
                <RealTimeAnalytics />
            </div>

            {/* Recent Activity Section */}
            <div className='w-full flex flex-wrap gap-6'>

                {/* Recent Messages */}
                <div className='w-full lg:w-5/12'>
                    <div className='w-full bg-[#6a5fdf] p-4 rounded-md text-[#d0d2d6]'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-semibold text-lg text-[#d0d2d6] pb-3'>Recent Seller Messages</h2>
                            <Link className='font-semibold text-sm text-[#d0d2d6]'>View All</Link>
                        </div>

                        <div className='flex flex-col gap-2 pt-6 text-[#d0d2d6]'>
                            <ol className='relative border-1 border-slate-600 ml-4'>
                               {recentMessage.length > 0 ? recentMessage.map((m, i) => (
                                    <li key={i} className='mb-3 ml-6'>
                                        <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#4c7fe2] rounded-full z-10'>
                                            {m.senderId === userInfo._id ?
                                                <img className='w-full rounded-full h-full shadow-lg' src={userInfo.image} alt="" /> :
                                                <img className='w-full rounded-full h-full shadow-lg' src={seller} alt="" />
                                            }
                                        </div>
                                        <div className='p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm'>
                                            <div className='flex justify-between items-center mb-2'>
                                                <Link className='text-md font-normal'>{m.senderName}</Link>
                                                <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'>
                                                    {moment(m.createdAt).startOf('hour').fromNow()}
                                                </time>
                                            </div>
                                            <div className='p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800'>
                                                {m.message}
                                            </div>
                                        </div>
                                    </li>
                                )) : (
                                    <div className='text-center text-gray-400 py-4'>
                                        No recent messages
                                    </div>
                                )}
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className='w-full lg:w-7/12'>
                    <div className='w-full bg-white p-6 rounded-lg shadow-sm border'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='font-semibold text-lg text-gray-800'>Recent Orders</h2>
                            <Link to="/admin/dashboard/orders" className='font-semibold text-sm text-blue-600 hover:text-blue-800'>
                                View All
                            </Link>
                        </div>

                        <div className='relative overflow-x-auto'>
                            <table className='w-full text-sm text-left text-gray-600'>
                                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                                    <tr>
                                        <th scope='col' className='py-3 px-4'>Order ID</th>
                                        <th scope='col' className='py-3 px-4'>Price</th>
                                        <th scope='col' className='py-3 px-4'>Payment Status</th>
                                        <th scope='col' className='py-3 px-4'>Order Status</th>
                                        <th scope='col' className='py-3 px-4'>Date</th>
                                        <th scope='col' className='py-3 px-4'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrder.length > 0 ? recentOrder.map((order, i) => (
                                        <tr key={i} className='bg-white border-b hover:bg-gray-50'>
                                            <td className='py-3 px-4 font-medium text-gray-900 whitespace-nowrap'>
                                                #{order._id?.slice(-8)}
                                            </td>
                                            <td className='py-3 px-4 font-medium text-green-600'>
                                                ${order.price?.toLocaleString()}
                                            </td>
                                            <td className='py-3 px-4'>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    order.payment_status === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className='py-3 px-4'>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    order.delivery_status === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.delivery_status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {order.delivery_status}
                                                </span>
                                            </td>
                                            <td className='py-3 px-4 text-gray-500'>
                                                {moment(order.createdAt).format('MMM DD, YYYY')}
                                            </td>
                                            <td className='py-3 px-4'>
                                                <Link
                                                    to={`/admin/dashboard/order/details/${order._id}`}
                                                    className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1'
                                                >
                                                    <FaEye className='text-xs' />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className='py-8 text-center text-gray-500'>
                                                No recent orders
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;