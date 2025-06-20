
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ProductProvider } from '@/contexts/ProductContext';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/CategoryPage';
import CartPage from '@/pages/CartPage';
import AdminPage from '@/pages/AdminPage';
import LoginPage from '@/pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppContent = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-100 to-stone-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-stone-900">
            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/camisas" element={<CategoryPage category="camisas" />} />
                <Route path="/calcados" element={<CategoryPage category="calcados" />} />
                <Route path="/acessorios" element={<CategoryPage category="acessorios" />} />
                <Route path="/bermudas" element={<CategoryPage category="bermudas" />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
