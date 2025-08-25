import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

export const add_product = createAsyncThunk(
    'product/add_product',
    async(product,{rejectWithValue, fulfillWithValue}) => {

        try {
            console.log('🚀 Sending product data to API...');
            const {data} = await api.post('/product-add',product,{withCredentials: true})
            console.log('✅ Product added successfully:', data);
            return fulfillWithValue(data)
        } catch (error) {
            console.error('❌ Product add failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || { error: error.message })
        }
    }
)

// End Method

export const get_products = createAsyncThunk(
    'product/get_products',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {

        try {

            const {data} = await api.get(`/products-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true})
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method



export const get_product = createAsyncThunk(
    'product/get_product',
    async( productId ,{rejectWithValue, fulfillWithValue}) => {

        try {

            const {data} = await api.get(`/product-get/${productId}`,{withCredentials: true})
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method



export const update_product = createAsyncThunk(
    'product/update_product',
    async( product ,{rejectWithValue, fulfillWithValue}) => {

        try {

            const {data} = await api.post('/product-update', product,{withCredentials: true})
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const delete_product = createAsyncThunk(
    'product/delete_product',
    async(productId,{rejectWithValue, fulfillWithValue}) => {

        try {
            const {data} = await api.delete(`/product-delete/${productId}`,{withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method


  export const product_image_update = createAsyncThunk(
    'product/product_image_update',
    async( {oldImage,newImage,productId} ,{rejectWithValue, fulfillWithValue}) => {

        try {

            const formData = new FormData()
            formData.append('oldImage', oldImage)
            formData.append('newImage', newImage)
            formData.append('productId', productId)
            const {data} = await api.post('/product-image-update', formData,{withCredentials: true})
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

// Append additional images to a product
export const product_images_add = createAsyncThunk(
    'product/product_images_add',
    async( {productId, images} ,{rejectWithValue, fulfillWithValue}) => {
        try {
            const formData = new FormData();
            formData.append('productId', productId);
            images.forEach(img => formData.append('images', img));
            const {data} = await api.post('/product-images-add', formData, {withCredentials: true});
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message })
        }
    }
)


  // End Method





export const productReducer = createSlice({
    name: 'product',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        loader: false,
        products : [],
        product : '',
        totalProduct: 0
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(add_product.pending, (state, { payload }) => {
            state.loader = true;
        })
        .addCase(add_product.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error
        })
        .addCase(add_product.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message

        })

        .addCase(get_products.fulfilled, (state, { payload }) => {
            state.totalProduct = payload.totalProduct;
            state.products = payload.products;

        })
        .addCase(get_product.fulfilled, (state, { payload }) => {
            state.product = payload.product;
        })
        .addCase(product_images_add.fulfilled, (state, { payload }) => {
            state.product = payload.product;
            state.successMessage = payload.message || 'Images added successfully';
        })


        .addCase(update_product.pending, (state, { payload }) => {
            state.loader = true;
        })
        .addCase(update_product.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error
        })
        .addCase(update_product.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.product = payload.product
            state.successMessage = payload.message

        })

        .addCase(product_image_update.fulfilled, (state, { payload }) => {
            state.product = payload.product
            state.successMessage = payload.message
        })

        .addCase(delete_product.pending, (state, { payload }) => {
            state.loader = true;
        })
        .addCase(delete_product.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error
        })
        .addCase(delete_product.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            // Remove the deleted product from the products array
            state.products = state.products.filter(product => product._id !== payload.productId);
            state.totalProduct = state.totalProduct - 1;
        })

    }

})
export const {messageClear} = productReducer.actions
export default productReducer.reducer