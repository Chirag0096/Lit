import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { AppKitProvider } from './AppKitProvider'; // Import the provider
import App from './pages/App/App';
import Landing from './pages/Landing/Landing';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/app',
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppKitProvider>
      <RouterProvider router={router} />
    </AppKitProvider>
  </React.StrictMode>,
);
