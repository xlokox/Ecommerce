import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const place_order = createAsyncThunk(
  "order/place_order",
  async ({ price, products, shipping_fee, items, shippingInfo, userId, navigate }) => {
    try {
      const { data } = await api.post("/home/order/place-order", {
        price,
        products,
        shipping_fee,
        items,
        shippingInfo,
        userId,
      });
      navigate("/payment", {
        state: {
          price: price + shipping_fee,
          items,
          orderId: data.orderId,
        },
      });
      // console.log(data)
    } catch (error) {
      console.log(error?.response);
    }
  }
);

export const get_orders = createAsyncThunk(
  "order/get_orders",
  async ({ customerId, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Fix typo in 'customer' and use the correct endpoint path
      const { data } = await api.get(`/home/customer/get-orders/${customerId}/${status}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error getting orders:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to get orders' });
    }
  }
);

export const get_order_details = createAsyncThunk(
  "order/get_order_details",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Fix typo in 'customer' and use the correct endpoint path
      const { data } = await api.get(`/home/customer/get-order-details/${orderId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error getting order details:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to get order details' });
    }
  }
);

export const orderReducer = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    errorMessage: "",
    successMessage: "",
    myOrder: {},
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // get_orders
      .addCase(get_orders.fulfilled, (state, { payload }) => {
        state.myOrders = payload.orders;
      })
      // get_order_details
      .addCase(get_order_details.fulfilled, (state, { payload }) => {
        state.myOrder = payload.order;
      });
  },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
