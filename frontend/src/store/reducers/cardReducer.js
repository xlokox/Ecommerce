import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_to_card = createAsyncThunk(
  "card/add_to_card",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log('Adding to cart with info:', info);
      // Use the correct endpoint path with the proper prefix
      const { data } = await api.post("/add-to-card", info);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to add to cart' });
    }
  }
);

export const get_card_products = createAsyncThunk(
  "card/get_card_products",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Check if userId is valid
      if (!userId) {
        console.log('No user ID provided for get_card_products');
        return fulfillWithValue({ card_products: [], price: 0, card_product_count: 0, shipping_fee: 0, outOfStockProduct: [], buy_product_item: 0 });
      }
      const { data } = await api.get(`/get-card-products/${userId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error fetching cart products:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to fetch cart products' });
    }
  }
);

export const delete_card_product = createAsyncThunk(
  "card/delete_card_product",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log('Deleting cart product with ID:', card_id);
      // Use the correct endpoint path
      const { data } = await api.delete(
        `/delete-card-products/${card_id}`
      );
      console.log('Successfully deleted cart product:', data);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error deleting cart product:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to delete cart product' });
    }
  }
);

export const quantity_inc = createAsyncThunk(
  "card/quantity_inc",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Use the correct endpoint path
      const { data } = await api.put(`/quantity-inc/${card_id}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to increment quantity' });
    }
  }
);

export const quantity_dec = createAsyncThunk(
  "card/quantity_dec",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Use the correct endpoint path
      const { data } = await api.put(`/quantity-dec/${card_id}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to decrement quantity' });
    }
  }
);

export const add_to_wishlist = createAsyncThunk(
  "wishlist/add_to_wishlist",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log('Adding to wishlist with info:', info);
      // Use the correct endpoint path with the proper prefix
      const { data } = await api.post("/add-wishlist", info);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to add to wishlist' });
    }
  }
);

export const get_wishlist_products = createAsyncThunk(
  "wishlist/get_wishlist_products",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Check if userId is valid
      if (!userId) {
        console.log('No user ID provided for get_wishlist_products');
        return fulfillWithValue({ wishlists: [], wishlistCount: 0 });
      }
      const { data } = await api.get(`/get-wishlist/${userId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to fetch wishlist products' });
    }
  }
);

export const remove_wishlist = createAsyncThunk(
  "wishlist/remove_wishlist",
  async (wishlistId, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log('Removing from wishlist with ID:', wishlistId);
      // Use the correct endpoint path with the proper prefix
      const { data } = await api.delete(
        `/remove-wishlist/${wishlistId}`
      );
      console.log('Successfully removed from wishlist:', data);
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return rejectWithValue(error?.response?.data || { error: 'Failed to remove from wishlist' });
    }
  }
);

export const cardReducer = createSlice({
  name: "card",
  initialState: {
    card_products: [],
    card_product_count: 0,
    wishlist_count: 0,
    wishlist: [],
    price: 0,
    errorMessage: "",
    successMessage: "",
    shipping_fee: 0,
    outofstock_products: [],
    buy_product_item: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    reset_count: (state) => {
      state.card_product_count = 0;
      state.wishlist_count = 0;
    },
  },
  extraReducers: (builder) => {
    builder

      // add_to_card
      .addCase(add_to_card.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Failed to add to card";
      })
      .addCase(add_to_card.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.card_product_count = state.card_product_count + 1;
      })

      // get_card_products
      .addCase(get_card_products.fulfilled, (state, { payload }) => {
        state.card_products = payload.card_products;
        state.price = payload.price;
        state.card_product_count = payload.card_product_count;
        state.shipping_fee = payload.shipping_fee;
        state.outofstock_products = payload.outOfStockProduct;
        state.buy_product_item = payload.buy_product_item;
      })

      // delete_card_product
      .addCase(delete_card_product.fulfilled, (state, { payload, meta }) => {
        state.successMessage = payload.message;
        console.log('Delete card product fulfilled with ID:', meta.arg);

        // Since we're now using the correct ID (the parent product ID),
        // we can simply filter out the product from the arrays
        state.card_products = state.card_products.filter(p => p._id !== meta.arg);
        state.outofstock_products = state.outofstock_products.filter(p => p._id !== meta.arg);

        // Update card_product_count
        state.card_product_count = state.card_product_count > 0 ? state.card_product_count - 1 : 0;
        console.log('Updated card_products after deletion:', state.card_products.length);
      })

      // quantity_inc
      .addCase(quantity_inc.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })

      // quantity_dec
      .addCase(quantity_dec.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })

      // add_to_wishlist
      .addCase(add_to_wishlist.rejected, (state, { payload }) => {
        state.errorMessage = payload?.error || "Failed to add to wishlist";
      })
      .addCase(add_to_wishlist.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.wishlist_count =
          state.wishlist_count > 0 ? state.wishlist_count + 1 : 1;
      })

      // get_wishlist_products
      .addCase(get_wishlist_products.fulfilled, (state, { payload }) => {
        state.wishlist = payload.wishlists;
        state.wishlist_count = payload.wishlistCount;
      })

      // remove_wishlist
      .addCase(remove_wishlist.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.wishlist = state.wishlist.filter(
          (p) => p._id !== payload.wishlistId
        );
        state.wishlist_count = state.wishlist_count - 1;
      });
  },
});

export const { messageClear, reset_count } = cardReducer.actions;
export default cardReducer.reducer;
