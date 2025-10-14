
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.tsx'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query' 
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
 <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
  <App />
  </GoogleOAuthProvider>
  </QueryClientProvider>
)
