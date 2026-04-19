import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import WhatsAppBubble from './components/WhatsAppBubble';
import Catalog from './pages/Catalog';
import Collections from './pages/Collections';
import Product from './pages/Product';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import OrderDetail from './pages/OrderDetail';
import TrackOrder from './pages/TrackOrder';
import AdminGuard from './components/AdminGuard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/all" element={<Collections />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/product/:handle" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/order/:id" element={<OrderDetail />} />
            <Route path="/track-order" element={<TrackOrder />} />
            
            {/* Securing Admin Panel Routes */}
            <Route element={<AdminGuard />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <WhatsAppBubble />
      </div>
    </Router>
  );
}

export default App;
