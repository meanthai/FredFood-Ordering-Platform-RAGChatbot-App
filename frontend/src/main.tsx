import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { BrowserRouter as Router} from "react-router-dom";
import AppRoutes from './AppRoutes.tsx';
import Auth0ProviderWithNav from './Auth/Auth0ProviderWithNav.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
}); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router> 
      <QueryClientProvider client={queryClient}>
        <Auth0ProviderWithNav>
          <AppRoutes/> 
          
          <Toaster position='top-right' visibleToasts={1} richColors/>
        </Auth0ProviderWithNav>
      </QueryClientProvider>
    </Router>
  </StrictMode>,
)
