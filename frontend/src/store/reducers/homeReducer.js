import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// 1) קבלת רשימת קטגוריות
export const get_category = createAsyncThunk(
  "product/get_category",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/home/get-categorys");
      console.log('Categories data:', data);
      return fulfillWithValue(data || { categorys: [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return rejectWithValue({ categorys: [] });
    }
  }
);

// 2) קבלת מוצרים (12 אחרונים + Latest/TopRated/Discount)
export const get_products = createAsyncThunk(
  "product/get_products",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/home/get-products");
      console.log('Products data:', data);
      return fulfillWithValue(data || {
        products: [],
        latest_product: [],
        topRated_product: [],
        discount_product: []
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue({
        products: [],
        latest_product: [],
        topRated_product: [],
        discount_product: []
      });
    }
  }
);

// 3) קבלת נתוני טווח מחירים + מוצרים אחרונים
export const price_range_product = createAsyncThunk(
  "product/price_range_product",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/home/price-range-latest-product");
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error?.response);
    }
  }
);

// 4) קבלת מוצרים לפי שאילתא (קטגוריה, חיפוש, מחיר וכו')
export const query_products = createAsyncThunk(
  "product/query_products",
  async (query, { fulfillWithValue, rejectWithValue }) => {
    try {
      // Make sure all parameters are defined
      const category = query.category || '';
      const rating = query.rating || '';
      const low = query.low || 0;
      const high = query.high || 1000;
      const sortPrice = query.sortPrice || '';
      const pageNumber = query.pageNumber || 1;
      const searchValue = query.searchValue || '';

      console.log('Query params:', { category, rating, low, high, sortPrice, pageNumber, searchValue });

      const { data } = await api.get(
        `/home/query-products?category=${category}&&rating=${rating}&&lowPrice=${low}&&highPrice=${high}&&sortPrice=${sortPrice}&&pageNumber=${pageNumber}&&searchValue=${searchValue}`
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.error('Error querying products:', error);
      return rejectWithValue({ products: [], totalProduct: 0, parPage: 10 });
    }
  }
);

// 5) קבלת פרטי מוצר בודד
export const product_details = createAsyncThunk(
  "product/product_details",
  async (slug, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/home/product-details/${slug}`);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error?.response);
    }
  }
);

// 6) הוספת ביקורת/דירוג למוצר
export const customer_review = createAsyncThunk(
  "review/customer_review",
  async (info, { fulfillWithValue }) => {
    try {
      const { data } = await api.post("/home/customer/submit-review", info);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error?.response);
    }
  }
);

// 7) שליפת ביקורות למוצר
export const get_reviews = createAsyncThunk(
  "review/get_reviews",
  async ({ productId, pageNumber }, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`
      );
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error?.response);
    }
  }
);

// 8) שליפת באנרים
export const get_banners = createAsyncThunk(
  "banner/get_banners",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/banners`);
      console.log('Banners data:', data);
      return fulfillWithValue(data || { banners: [] });
    } catch (error) {
      console.error('Error fetching banners:', error);
      return rejectWithValue({ banners: [] });
    }
  }
);

// 9) **חדש**: שליפת מוצרים מקטגוריות מובילות (Top Category)
export const get_top_category_products = createAsyncThunk(
  "product/get_top_category_products",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/home/get-top-category-products");
      console.log('Top category products data:', data);
      return fulfillWithValue(data || { products: [] });
    } catch (error) {
      console.error('Error fetching top category products:', error);
      return rejectWithValue({ products: [] });
    }
  }
);

export const homeReducer = createSlice({
  name: "home",
  initialState: {
    categorys: [],
    products: [],
    totalProduct: 0,
    parPage: 3,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: {
      low: 0,
      high: 100,
    },
    product: {},
    relatedProducts: [],
    moreProducts: [],
    errorMessage: "",
    successMessage: "",
    totalReview: 0,
    rating_review: [],
    reviews: [],
    banners: [],
    // **שדה חדש**: כאן נאחסן את המוצרים מקטגוריות מובילות
    topCategoryProducts: [],
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // 1) get_category
      .addCase(get_category.fulfilled, (state, { payload }) => {
        state.categorys = payload?.categorys || [];
      })
      .addCase(get_category.rejected, (state, { payload }) => {
        state.categorys = payload?.categorys || [];
      })
      // 2) get_products
      .addCase(get_products.fulfilled, (state, { payload }) => {
        state.products = payload.products || [];
        state.latest_product = payload.latest_product || [];
        state.topRated_product = payload.topRated_product || [];
        state.discount_product = payload.discount_product || [];
      })
      .addCase(get_products.rejected, (state, { payload }) => {
        state.products = payload?.products || [];
        state.latest_product = payload?.latest_product || [];
        state.topRated_product = payload?.topRated_product || [];
        state.discount_product = payload?.discount_product || [];
      })
      // 3) price_range_product
      .addCase(price_range_product.fulfilled, (state, { payload }) => {
        state.latest_product = payload.latest_product;
        state.priceRange = payload.priceRange;
      })
      // 4) query_products
      .addCase(query_products.fulfilled, (state, { payload }) => {
        state.products = payload.products || [];
        state.totalProduct = payload.totalProduct || 0;
        state.parPage = payload.parPage || 10;
      })
      .addCase(query_products.rejected, (state, { payload }) => {
        state.products = payload?.products || [];
        state.totalProduct = payload?.totalProduct || 0;
        state.parPage = payload?.parPage || 10;
      })
      // 5) product_details
      .addCase(product_details.fulfilled, (state, { payload }) => {
        state.product = payload.product;
        state.relatedProducts = payload.relatedProducts;
        state.moreProducts = payload.moreProducts;
      })
      // 6) customer_review
      .addCase(customer_review.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      // 7) get_reviews
      .addCase(get_reviews.fulfilled, (state, { payload }) => {
        state.reviews = payload.reviews;
        state.totalReview = payload.totalReview;
        state.rating_review = payload.rating_review;
      })
      // 8) get_banners
      .addCase(get_banners.fulfilled, (state, { payload }) => {
        state.banners = payload?.banners || [];
      })
      .addCase(get_banners.rejected, (state) => {
        state.banners = [];
      })
      // 9) **חדש**: get_top_category_products
      .addCase(get_top_category_products.fulfilled, (state, { payload }) => {
        state.topCategoryProducts = payload?.products || [];
      })
      .addCase(get_top_category_products.rejected, (state, { payload }) => {
        state.topCategoryProducts = payload?.products || [];
      });
  },
});

export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
