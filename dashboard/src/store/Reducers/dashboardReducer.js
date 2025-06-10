import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api"; 

export const get_admin_dashboard_data = createAsyncThunk(
    'dashboard/get_admin_dashboard_data',
    async( _ ,{rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get('/admin/get-dashboard-data',{withCredentials: true})             
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)
// End method

export const get_seller_dashboard_data = createAsyncThunk(
    'dashboard/get_seller_dashboard_data',
    async( _ ,{rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/seller/get-dashboard-data',{withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_analytics_data = createAsyncThunk(
    'dashboard/get_analytics_data',
    async( _ ,{rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/admin/get-analytics-data',{withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
// End method


  
export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState:{
        totalSale : 0,
        totalOrder : 0,
        totalProduct: 0,
        totalPendingOrder : 0,
        totalSeller:0,
        recentOrder: [],
        recentMessage: [],
        monthlySales: [],
        dailySales: [],
        orderStatusStats: [],
        paymentStatusStats: [],
        topProducts: [],
        todaySales: { totalSales: 0, orderCount: 0 },
        hourlySales: [],
        recentActivity: [],
        loading: false,
        error: null
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(get_admin_dashboard_data.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
            state.loading = false
            state.totalSale = payload.totalSale
            state.totalOrder = payload.totalOrder
            state.totalProduct = payload.totalProduct
            state.totalSeller = payload.totalSeller
            state.recentOrder = payload.recentOrders
            state.recentMessage = payload.messages
            state.monthlySales = payload.monthlySales || []
            state.dailySales = payload.dailySales || []
            state.orderStatusStats = payload.orderStatusStats || []
            state.paymentStatusStats = payload.paymentStatusStats || []
            state.topProducts = payload.topProducts || []
        })
        .addCase(get_admin_dashboard_data.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload?.message || 'Failed to fetch dashboard data'
        })
        .addCase(get_seller_dashboard_data.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
            state.loading = false
            state.totalSale = payload.totalSale
            state.totalOrder = payload.totalOrder
            state.totalProduct = payload.totalProduct
            state.totalSeller = payload.totalSeller
            state.totalPendingOrder = payload.totalPendingOrder
            state.recentOrder = payload.recentOrders
            state.recentMessage = payload.messages
            // Add analytics data for sellers too
            state.monthlySales = payload.monthlySales || []
            state.dailySales = payload.dailySales || []
            state.orderStatusStats = payload.orderStatusStats || []
            state.paymentStatusStats = payload.paymentStatusStats || []
            state.topProducts = payload.topProducts || []
        })
        .addCase(get_seller_dashboard_data.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload?.message || 'Failed to fetch dashboard data'
        })
        .addCase(get_analytics_data.fulfilled, (state, { payload }) => {
            state.todaySales = payload.todaySales
            state.hourlySales = payload.hourlySales
            state.recentActivity = payload.recentActivity
        })

    }

})
export const {messageClear} = dashboardReducer.actions
export default dashboardReducer.reducer