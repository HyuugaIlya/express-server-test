import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { TokenProvider } from './providers/TokenProvider.tsx'

import App from './App.tsx'

import '@ant-design/v5-patch-for-react-19'
import './index.scss'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TokenProvider>
          <App />
        </TokenProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
