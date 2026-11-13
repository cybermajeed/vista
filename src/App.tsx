import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Catalogue } from './pages/Catalogue';

import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SignIn } from './pages/SignIn';
import { Profile } from './pages/Profile';
import { Wishlist } from './pages/Wishlist';
import { Visualizer } from './pages/Visualizer';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Customer Only Routes */}
            <Route path="/cart" element={<ProtectedRoute requiredRole="customer"><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute requiredRole="customer"><Checkout /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="customer"><Dashboard /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute requiredRole="customer"><Wishlist /></ProtectedRoute>} />
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            
            {/* Auth Required Routes (Any authenticated user) */}
            <Route path="/profile" element={<ProtectedRoute requireAuth><Profile /></ProtectedRoute>} />
            <Route path="/visualizer" element={<ProtectedRoute requireAuth><Visualizer /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
