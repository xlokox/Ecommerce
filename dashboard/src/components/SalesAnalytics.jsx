import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Chart from 'react-apexcharts';
import { MdTrendingUp, MdTrendingDown, MdAttachMoney, MdShoppingCart, MdCalendarToday, MdAnalytics } from 'react-icons/md';
import { get_analytics_data } from '../store/Reducers/dashboardReducer';

const SalesAnalytics = () => {
    const dispatch = useDispatch();
    const { 
        monthlySales, 
        dailySales, 
        totalSale, 
        totalOrder,
        todaySales,
        hourlySales,
        loading 
    } = useSelector(state => state.dashboard);

    const [selectedPeriod, setSelectedPeriod] = useState('12months');

    useEffect(() => {
        dispatch(get_analytics_data());
    }, [dispatch]);

    // Format monthly sales data for chart
    const formatMonthlySalesData = () => {
        if (!monthlySales || monthlySales.length === 0) {
            return {
                months: [],
                salesData: [],
                orderData: []
            };
        }

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const months = monthlySales.map(item => 
            `${monthNames[item._id.month - 1]} ${item._id.year}`
        );
        const salesData = monthlySales.map(item => item.totalSales || 0);
        const orderData = monthlySales.map(item => item.orderCount || 0);

        return { months, salesData, orderData };
    };

    const { months, salesData, orderData } = formatMonthlySalesData();

    // Calculate growth percentage
    const calculateGrowth = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    const currentMonthSales = salesData[salesData.length - 1] || 0;
    const previousMonthSales = salesData[salesData.length - 2] || 0;
    const salesGrowth = calculateGrowth(currentMonthSales, previousMonthSales);

    // Monthly Sales Chart Configuration
    const monthlySalesChart = {
        series: [
            {
                name: 'Revenue ($)',
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
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                    }
                }
            },
            stroke: {
                width: [0, 3],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    columnWidth: '60%',
                    borderRadius: 4
                }
            },
            fill: {
                opacity: [0.85, 1],
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: false,
                    opacityFrom: 0.85,
                    opacityTo: 0.85,
                    stops: [50, 0, 100]
                }
            },
            labels: months,
            markers: {
                size: 6,
                strokeWidth: 2,
                hover: {
                    size: 8
                }
            },
            xaxis: {
                type: 'category',
                labels: {
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px'
                    }
                }
            },
            yaxis: [
                {
                    title: {
                        text: 'Revenue ($)',
                        style: {
                            color: '#10b981',
                            fontSize: '14px',
                            fontWeight: 600
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
                            color: '#3b82f6',
                            fontSize: '14px',
                            fontWeight: 600
                        }
                    },
                    labels: {
                        style: {
                            colors: '#6b7280'
                        }
                    }
                }
            ],
            grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 3
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '14px',
                fontWeight: 500,
                markers: {
                    width: 12,
                    height: 12,
                    radius: 6
                }
            },
            tooltip: {
                shared: true,
                intersect: false,
                theme: 'light',
                style: {
                    fontSize: '12px'
                },
                y: [
                    {
                        formatter: (val) => `$${val.toLocaleString()}`
                    },
                    {
                        formatter: (val) => `${val} orders`
                    }
                ]
            }
        }
    };

    // Revenue Trend Chart (Area Chart)
    const revenueTrendChart = {
        series: [{
            name: 'Revenue',
            data: salesData
        }],
        options: {
            colors: ['#8b5cf6'],
            chart: {
                type: 'area',
                background: 'transparent',
                foreColor: '#374151',
                toolbar: { show: false },
                sparkline: { enabled: false }
            },
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 3
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
                categories: months,
                labels: {
                    style: { colors: '#6b7280', fontSize: '11px' }
                }
            },
            yaxis: {
                labels: {
                    style: { colors: '#6b7280' },
                    formatter: (val) => `$${(val/1000).toFixed(0)}K`
                }
            },
            grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 3
            },
            tooltip: {
                theme: 'light',
                y: { formatter: (val) => `$${val.toLocaleString()}` }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Period Selector */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MdAnalytics className="text-blue-500" />
                        Sales Analytics
                    </h2>
                    <p className="text-gray-600 mt-1">Smart insights and revenue tracking</p>
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="12months">Last 12 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="3months">Last 3 Months</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold">${totalSale?.toLocaleString() || 0}</p>
                        </div>
                        <MdAttachMoney className="text-3xl text-green-200" />
                    </div>
                    <div className="flex items-center mt-2">
                        {salesGrowth >= 0 ? (
                            <MdTrendingUp className="text-green-200 mr-1" />
                        ) : (
                            <MdTrendingDown className="text-red-200 mr-1" />
                        )}
                        <span className="text-sm text-green-100">
                            {salesGrowth >= 0 ? '+' : ''}{salesGrowth}% from last month
                        </span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold">{totalOrder?.toLocaleString() || 0}</p>
                        </div>
                        <MdShoppingCart className="text-3xl text-blue-200" />
                    </div>
                    <div className="flex items-center mt-2">
                        <MdTrendingUp className="text-blue-200 mr-1" />
                        <span className="text-sm text-blue-100">Active orders tracking</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Avg Order Value</p>
                            <p className="text-2xl font-bold">
                                ${totalOrder > 0 ? ((totalSale || 0) / totalOrder).toFixed(0) : 0}
                            </p>
                        </div>
                        <MdCalendarToday className="text-3xl text-purple-200" />
                    </div>
                    <div className="flex items-center mt-2">
                        <span className="text-sm text-purple-100">Per order average</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">This Month</p>
                            <p className="text-2xl font-bold">${currentMonthSales?.toLocaleString() || 0}</p>
                        </div>
                        <MdTrendingUp className="text-3xl text-orange-200" />
                    </div>
                    <div className="flex items-center mt-2">
                        <span className="text-sm text-orange-100">Current month sales</span>
                    </div>
                </div>
            </div>

            {/* Main Sales Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Monthly Revenue & Orders</h3>
                        <p className="text-gray-600 text-sm">Track your sales performance over time</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Revenue</span>
                        <div className="w-3 h-3 bg-blue-500 rounded-full ml-4"></div>
                        <span className="text-gray-600">Orders</span>
                    </div>
                </div>
                <Chart
                    options={monthlySalesChart.options}
                    series={monthlySalesChart.series}
                    type="line"
                    height={400}
                />
            </div>

            {/* Revenue Trend and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>Live Data</span>
                        </div>
                    </div>
                    <Chart
                        options={revenueTrendChart.options}
                        series={revenueTrendChart.series}
                        type="area"
                        height={300}
                    />
                </div>

                {/* Sales Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Highest Month</span>
                            <span className="font-semibold text-green-600">
                                ${Math.max(...salesData).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Average Monthly</span>
                            <span className="font-semibold text-blue-600">
                                ${salesData.length > 0 ? (salesData.reduce((a, b) => a + b, 0) / salesData.length).toFixed(0).toLocaleString() : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Growth Rate</span>
                            <span className={`font-semibold ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {salesGrowth >= 0 ? '+' : ''}{salesGrowth}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total Months</span>
                            <span className="font-semibold text-gray-800">
                                {months.length} months
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MdAnalytics className="text-blue-500" />
                    Smart Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-2">📈 Revenue Performance</h4>
                        <p className="text-sm text-gray-600">
                            {salesGrowth >= 0
                                ? `Your revenue is growing by ${salesGrowth}% compared to last month. Keep up the great work!`
                                : `Revenue decreased by ${Math.abs(salesGrowth)}% from last month. Consider reviewing your sales strategy.`
                            }
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-2">🎯 Order Insights</h4>
                        <p className="text-sm text-gray-600">
                            You have processed {totalOrder} orders with an average value of ${totalOrder > 0 ? ((totalSale || 0) / totalOrder).toFixed(0) : 0} per order.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
