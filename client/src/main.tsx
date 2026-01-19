import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from './components/ui/toaster';
import { ToastStateProvider } from './components/ui/use-toast';
import './api/mockServer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastStateProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ToastStateProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
