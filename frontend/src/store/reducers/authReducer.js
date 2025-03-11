// src/store/reducers/authReducer.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

// פונקציה קטנה לפענוח הטוקן
const decodeToken = (token) => {
  try {
    return token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Token Decoding Error:", error);
    return null;
  }
};

// Thunk לרישום לקוח
export const customer_register = createAsyncThunk(
  "auth/customer_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      // לדוגמה: אם בשרת הנתיב הוא POST /api/customer/register
      const { data } = await api.post("/customer/register", info);

      // אם חזר טוקן, נשמור אותו ב-LocalStorage
      if (data?.token) {
        localStorage.setItem("customerToken", data.token);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { error: "Registration failed" });
    }
  }
);

// Thunk להתחברות לקוח
export const customer_login = createAsyncThunk(
  "auth/customer_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      // לדוגמה: אם בשרת הנתיב הוא POST /api/customer/login
      const { data } = await api.post("/customer/login", info);

      // אם חזר טוקן, נשמור אותו ב-LocalStorage
      if (data?.token) {
        localStorage.setItem("customerToken", data.token);
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { error: "Login failed" });
    }
  }
);

// מצב התחלתי
const initialState = {
  loader: false,
  userInfo: decodeToken(localStorage.getItem("customerToken")), 
  errorMessage: "",
  successMessage: "",
};

// Slice ל־auth
export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state) => {
      // מנקה את המשתמש + הטוקן
      state.userInfo = null;
      localStorage.removeItem("customerToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // טיפול ברישום
      .addCase(customer_register.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(customer_register.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Registration failed";
        state.loader = false;
      })
      .addCase(customer_register.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message || "Registration successful";
        state.loader = false;
        state.userInfo = decodeToken(payload.token);
      })

      // טיפול בהתחברות
      .addCase(customer_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(customer_login.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Login failed";
        state.loader = false;
      })
      .addCase(customer_login.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message || "Login successful";
        state.loader = false;
        state.userInfo = decodeToken(payload.token);
      });
  },
});

// מייצאים את הפעולות
export const { messageClear, user_reset } = authReducer.actions;

// מייצאים את הרידוסר כברירת מחדל
export default authReducer.reducer;
