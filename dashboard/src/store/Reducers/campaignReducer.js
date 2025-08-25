import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api';

export const list_campaigns = createAsyncThunk('campaign/list', async (_, { fulfillWithValue, rejectWithValue }) => {
  try { const { data } = await api.get('/campaigns'); return fulfillWithValue(data); }
  catch (e) { return rejectWithValue(e.response?.data || { error: 'Failed to load campaigns' }); }
});

export const create_campaign = createAsyncThunk('campaign/create', async (formData, { fulfillWithValue, rejectWithValue }) => {
  try { const { data } = await api.post('/campaigns', formData); return fulfillWithValue(data); }
  catch (e) { return rejectWithValue(e.response?.data || { error: 'Failed to create campaign' }); }
});

export const update_campaign = createAsyncThunk('campaign/update', async ({ id, formData }, { fulfillWithValue, rejectWithValue }) => {
  try { const { data } = await api.put(`/campaigns/${id}`, formData); return fulfillWithValue(data); }
  catch (e) { return rejectWithValue(e.response?.data || { error: 'Failed to update campaign' }); }
});

export const delete_campaign = createAsyncThunk('campaign/delete', async (id, { fulfillWithValue, rejectWithValue }) => {
  try { const { data } = await api.delete(`/campaigns/${id}`); return fulfillWithValue({ id, ...data }); }
  catch (e) { return rejectWithValue(e.response?.data || { error: 'Failed to delete campaign' }); }
});

const slice = createSlice({
  name: 'campaign',
  initialState: { items: [], current: null, loader: false, successMessage: '', errorMessage: '' },
  reducers: { messageClear: (s)=>{ s.successMessage=''; s.errorMessage=''; }},
  extraReducers: (b) => {
    b
      .addCase(list_campaigns.fulfilled, (s, { payload }) => { s.items = payload.campaigns || []; })
      .addCase(create_campaign.pending, (s)=>{ s.loader=true; })
      .addCase(create_campaign.fulfilled, (s, { payload }) => { s.loader=false; s.successMessage=payload.message; s.items.unshift(payload.campaign); })
      .addCase(create_campaign.rejected, (s,{payload})=>{ s.loader=false; s.errorMessage = payload.error; })
      .addCase(update_campaign.fulfilled, (s, { payload }) => { s.successMessage=payload.message; s.items = s.items.map(i=> i._id===payload.campaign._id? payload.campaign:i); })
      .addCase(delete_campaign.fulfilled, (s, { payload }) => { s.successMessage=payload.message; s.items = s.items.filter(i=> i._id!==payload.id); });
  }
});

export const { messageClear } = slice.actions;
export default slice.reducer;

