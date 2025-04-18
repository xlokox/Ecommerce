import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import { Toaster } from 'react-hot-toast';
import Router from './router/Router';
import { getRoutes } from './router/routes/index';
import { get_user_info } from './store/Reducers/authReducer';

// Dispatch get_user_info to check authentication status on app load
store.dispatch(get_user_info());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Router allRoutes={getRoutes()} />
        <Toaster
          toastOptions={{
            position: 'top-right',
            style: {
              background: '#283046',
              color: 'white'
            }
          }}
        />
      </Suspense>
    </BrowserRouter>
  </Provider>
);
