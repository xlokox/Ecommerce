import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

// Login for admin
export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin-login", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);// שומר את ה-token ב-localStorage
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Login for seller
export const seller_login = createAsyncThunk(
  "auth/seller_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-login", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Get user information from the server
export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Profile image upload
export const profile_image_upload = createAsyncThunk(
  "auth/profile_image_upload",
  async (image, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-image-upload", image, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Seller registration
export const seller_register = createAsyncThunk(
  "auth/seller_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-register", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Profile information add/update
export const profile_info_add = createAsyncThunk(
  "auth/profile_info_add",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/profile-info-add", info, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Logout action
export const logout = createAsyncThunk(
  "auth/logout",
  async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/logout", { withCredentials: true });
      localStorage.removeItem("accessToken");
      if (role === "admin") {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Change password
export const change_password = createAsyncThunk(
  "auth/change_password",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/change-password", info, { withCredentials: true });
      return fulfillWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// פונקציה לפענוח התפקיד מתוך ה-token
const returnRole = (token) => {
  if (token) {
    const decodedToken = jwtDecode(token); // <-- כאן decode תקין
    const expireTime = new Date(decodedToken.exp * 1000);
    if (new Date() > expireTime) {
      localStorage.removeItem("accessToken");
      return "";
    } else {
      return decodedToken.role || "";
    }
  } else {
    return "";
  }
};

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: "", 
    role: returnRole(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken")
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
    }
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || payload || "Admin login failed";
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message;
        state.token = payload?.token;
        state.role = returnRole(payload?.token);
      })

      // Seller Login
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || payload || "Seller login failed";
      })
      .addCase(seller_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message;
        state.token = payload?.token;
        state.role = returnRole(payload?.token);
      })

      // Seller Register
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || payload || "Seller registration failed";
      })
      .addCase(seller_register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message;
        state.token = payload?.token;
        state.role = returnRole(payload?.token);
      })

      // Get User Info
      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        // אם השרת מחזיר { _id, name, role, ... }, שומר הכל ב-userInfo
        state.userInfo = payload || {};
      })

      // Profile Image Upload
      .addCase(profile_image_upload.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload?.userInfo || state.userInfo;
        state.successMessage = payload?.message;
      })

      // Profile Info Add
      .addCase(profile_info_add.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_info_add.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload?.userInfo || state.userInfo;
        state.successMessage = payload?.message;
      })

      // Change Password
      .addCase(change_password.pending, (state) => {
        state.loader = true;
        state.errorMessage = null;
      })
      .addCase(change_password.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload || "Change password failed";
      })
      .addCase(change_password.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload;
      });
  }
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
