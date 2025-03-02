import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode"; // שימוש בייבוא בשם

// הרשמה ללקוח
export const customer_register = createAsyncThunk(
  'auth/customer_register',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Base URL כבר מכיל "/api", לכן הנתיב היחסי הוא "/customer-register"
      const { data } = await api.post('/customer-register', info);
      localStorage.setItem('customerToken', data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// התחברות ללקוח
export const customer_login = createAsyncThunk(
  'auth/customer_login',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      // יש להסיר את "/api" מהנתיב כאן, כדי לא לקבל "/api/api/customer-login"
      const { data } = await api.post('/customer-login', info);
      localStorage.setItem('customerToken', data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// פונקציה לפענוח הטוקן
const decodeToken = (token) => {
  if (token) {
    return jwtDecode(token);
  }
  return '';
};

export const authReducer = createSlice({
  name: 'auth',
  initialState: {
    loader: false,
    userInfo: decodeToken(localStorage.getItem('customerToken')),
    errorMessage: '',
    successMessage: '',
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state) => {
      state.userInfo = "";
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle customer_register
      .addCase(customer_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(customer_register.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || payload || "Registration failed";
        state.loader = false;
      })
      .addCase(customer_register.fulfilled, (state, { payload }) => {
        const userInfo = decodeToken(payload.token);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userInfo;
      })
      // Handle customer_login
      .addCase(customer_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(customer_login.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || payload || "Login failed";
        state.loader = false;
      })
      .addCase(customer_login.fulfilled, (state, { payload }) => {
        const userInfo = decodeToken(payload.token);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userInfo;
      });
  }
});

export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;
