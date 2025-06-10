import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { FaArrowUp, FaArrowDown, FaClock, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import { get_analytics_data } from '../store/Reducers/dashboardReducer';
import moment from 'moment';

const RealTimeAnalytics = () => {
    const dispatch = useDispatch();
    const { todaySales, hourlySales, recentActivity } = useSelector(state => state.dashboard);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        // Initial fetch
        dispatch(get_analytics_data());
        
        // Set up real-time updates every 10 seconds
        const interval = setInterval(() => {
            dispatch(get_analytics_data());
            setLastUpdate(new Date());
        }, 10000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Format hourly sales data for chart
    const formatHourlySalesData = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const salesData = hours.map(hour => {
            const hourData = hourlySales.find(item => item._id === hour);
            return hourData ? hourData.sales : 0;
        });
        const orderData = hours.map(hour => {
            const hourData = hourlySales.find(item => item._id === hour);
            return hourData ? hourData.orders : 0;
        });

        return {
            hours: hours.map(h => `${h}:00`),
            salesData,
            orderData
        };
    };

    const { hours, salesData, orderData } = formatHourlySalesData();

    // Hourly Sales Chart Configuration
    const hourlySalesChart = {
        series: [
            {
                name: 'Sales ($)',
                type: 'column',
                data: salesData
            },
            {
                name: 'Orders',
                type: 'line',
                data: orderData
            }
        ],
        options: {
            colors: ['#10b981', '#3b82f6'],
            chart: {
                background: 'transparent',
                foreColor: '#374151',
                toolbar: {
                    show: false
                }
            },
            stroke: {
                width: [0, 3],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            fill: {
                opacity: [0.85, 1]
            },
            labels: hours,
            markers: {
                size: 0
            },
            xaxis: {
                type: 'category',
                labels: {
                    style: {
                        colors: '#6b7280'
                    }
                }
            },
            yaxis: [
                {
                    title: {
                        text: 'Sales ($)',
                        style: {
                            color: '#10b981'
                        }
                    },
                    labels: {
                        style: {
                            colors: '#6b7280'
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
                            colors: '#6b7280'
                        }
                    }
                }
            ],
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0);
                        }
                        return y;
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left'
            }
        }
    };

    return (
        <div className='space-y-6'>
            {/* Real-time Header */}
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-bold text-gray-800'>Real-Time Analytics</h2>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    <span>Last updated: {moment(lastUpdate).format('HH:mm:ss')}</span>
                </div>
            </div>

            {/* Today's Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-green-600'>Today's Sales</p>
                            <p className='text-2xl font-bold text-green-800'>
                                ${todaySales.totalSales?.toLocaleString() || 0}
                            </p>
                            <div className='flex items-center mt-1'>
                                <FaArrowUp className='text-green-500 text-xs mr-1' />
                                <span className='text-xs text-green-600'>Live tracking</span>
                            </div>
                        </div>
                        <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center'>
                            <FaDollarSign className='text-white text-xl' />
                        </div>
                    </div>
                </div>

                <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-blue-600'>Today's Orders</p>
                            <p className='text-2xl font-bold text-blue-800'>
                                {todaySales.orderCount?.toLocaleString() || 0}
                            </p>
                            <div className='flex items-center mt-1'>
                                <FaArrowUp className='text-blue-500 text-xs mr-1' />
                                <span className='text-xs text-blue-600'>Real-time count</span>
                            </div>
                        </div>
                        <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
                            <FaShoppingCart className='text-white text-xl' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Hourly Sales Chart */}
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Today's Hourly Performance</h3>
                <Chart 
                    options={hourlySalesChart.options} 
                    series={hourlySalesChart.series} 
                    type='line' 
                    height={300} 
                />
            </div>

            {/* Recent Activity */}
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
                <div className='flex items-center gap-2 mb-4'>
                    <FaClock className='text-gray-500' />
                    <h3 className='text-lg font-semibold text-gray-800'>Recent Activity</h3>
                </div>
                <div className='space-y-3 max-h-64 overflow-y-auto'>
                    {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                        <div key={activity._id || `activity-${index}`} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                                    <FaShoppingCart className='text-blue-600 text-sm' />
                                </div>
                                <div>
                                    <p className='font-medium text-gray-800'>
                                        Order #{activity._id?.slice(-8)}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        {moment(activity.createdAt).fromNow()}
                                    </p>
                                </div>
                            </div>
                            <div className='text-right'>
                                <p className='font-bold text-green-600'>
                                    ${activity.price?.toLocaleString()}
                                </p>
                                <p className='text-xs text-gray-500'>
                                    {activity.payment_status}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className='text-center text-gray-500 py-8'>
                            No recent activity
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RealTimeAnalytics;
