import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import { Toaster } from 'react-hot-toast';

const App = lazy(() => import('./App'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("❌ 'root' element not found in DOM");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}> 
        <App />
      </Suspense>
      <Toaster
        toastOptions={{
          position: 'top-right',
          style: {
            background: '#283046',
            color: 'white'
          }
        }}
      />
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
