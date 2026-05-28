import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import BookDetails from "./pages/BookDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import CollectionPage from './pages/CollectionPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex-grow pt-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/collection" element={<CollectionPage />} /> 

              <Route
                path="/admin/manage"
                element = {
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer 
            position="top-right" 
            autoClose={2500} 
            hideProgressBar={false} 
            newestOnTop
            closeOnClick 
            pauseOnHover 
            theme="colored"
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;