import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext' 
import { CollectionProvider } from './context/CollectionContext'
import { CartProvider } from './context/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CollectionProvider> 
        <CartProvider>
          <App />
        </CartProvider>
      </CollectionProvider>
    </AuthProvider>
  </React.StrictMode>,
)