import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AddToCartToast } from './components/AddToCartToast';
import { CartDrawer } from './components/CartDrawer';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { QuickShopDrawer } from './components/QuickShopDrawer';
import { SearchModal } from './components/SearchModal';
import { ShippingModal } from './components/ShippingModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AboutPage } from './pages/AboutPage';
import { ClubPage } from './pages/ClubPage';
import { CollectionPage } from './pages/CollectionPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';

function AnimatedRoutes() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={isProductPage ? '/product-showcase' : location.pathname}
        initial={{ opacity: 0, y: isProductPage ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isProductPage ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[70vh]"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/club/:slug" element={<ClubPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith('/product/');

  return (
    <div className="min-h-screen bg-[#F3EADB] text-[#111111]">
      <CustomCursor />
      {!isProductPage && <Navbar />}
      <AnimatedRoutes />
      <Footer />

      {/* Global Drawers, Modals & Toast */}
      <QuickShopDrawer />
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <ShippingModal />
      <AddToCartToast />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </MotionConfig>
  );
}
