import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, Truck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BrandWordmark } from './BrandWordmark';
import { useStore } from '../store/useStore';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Jerseys', to: '/collection?sport=Football' },
  { label: 'Accessories', to: '/collection?category=Grip+Socks' },
  { label: 'Collections', to: '/collection' },
  { label: 'About Us', to: '/about' },
];

export function Navbar() {
  const { pathname, search } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const currency = useStore((s) => s.currency);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setWishlistOpen = useStore((s) => s.setWishlistOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const isMobileMenuOpen = useStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useStore((s) => s.setMobileMenuOpen);
  const setShippingModalOpen = useStore((s) => s.setShippingModalOpen);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const fullPath = pathname + search;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const isActive = (to: string) => {
    if (to === '/') return pathname === '/';
    const [path, query] = to.split('?');
    if (query) return fullPath.startsWith(to);
    return pathname.startsWith(path);
  };

  return (
    <>
      <div className="sticky top-0 z-40 w-full">
        {/* Mint Announcement Bar — FREE SHIPPING */}
        <button
          type="button"
          onClick={() => setShippingModalOpen(true)}
          className="group relative flex h-10 w-full items-center justify-center gap-2.5 overflow-hidden bg-[#8BC8B9] px-4 text-center transition-colors hover:bg-[#68A99C]"
          aria-label="Shipping details"
        >
          <Truck className="h-3.5 w-3.5 text-[#1A1A1A]" strokeWidth={2} />
          <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.24em] text-[#1A1A1A] sm:text-[11px]">
            Shipping Island Wide — Free Shipping Over LKR 15,000
          </span>
        </button>

        {/* Cream Navigation Bar */}
        <header
          className={`w-full border-b transition-all duration-200 ${
            scrolled
              ? 'border-[#D9CEBF] bg-[#F3EADB]/92 backdrop-blur-md'
              : 'border-transparent bg-[#F3EADB]'
          }`}
        >
          <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
            {/* Left: Logo */}
            <Link
              to="/"
              className="shrink-0 focus-visible:rounded-sm"
              aria-label="Jerseology Home"
            >
              <BrandWordmark className="h-14 w-auto sm:h-16" />
            </Link>

            {/* Center: Primary Nav */}
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-9"
            >
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`group relative py-2 text-[13px] font-medium tracking-[0.02em] transition-colors whitespace-nowrap ${
                      active ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/80 hover:text-[#1A1A1A]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-[#C93636] transition-transform duration-300 ease-out ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right: Currency + Icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span
                className="hidden sm:inline-flex h-9 items-center rounded border border-[#1A1A1A]/20 px-3 font-mono-label text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]"
                aria-label={`Prices in ${currency}`}
              >
                {currency}
              </span>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search jerseys and clubs"
                className="inline-flex h-9 w-9 items-center justify-center rounded text-[#1A1A1A]/85 hover:bg-[#1A1A1A]/5 hover:text-[#C93636] transition-colors"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                aria-label={`Wishlist (${wishlist.length})`}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded text-[#1A1A1A]/85 hover:bg-[#1A1A1A]/5 hover:text-[#C93636] transition-colors"
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {wishlist.length > 0 && (
                  <span className="font-mono-label absolute right-0.5 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C93636] px-1 text-[10px] font-semibold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Shopping bag (${totalItems})`}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded text-[#1A1A1A]/85 hover:bg-[#1A1A1A]/5 hover:text-[#C93636] transition-colors"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {totalItems > 0 && (
                  <span className="font-mono-label absolute right-0.5 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C93636] px-1 text-[10px] font-semibold text-white">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded text-[#1A1A1A] hover:bg-[#1A1A1A]/5 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Cream Slide-In Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-[#1A1A1A]/50 backdrop-blur-xs lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col justify-between border-r border-[#D9CEBF] bg-[#F3EADB] p-6 text-[#1A1A1A] shadow-2xl lg:hidden"
                aria-label="Mobile Navigation Drawer"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#D9CEBF] pb-4">
                    <BrandWordmark className="h-10 w-auto" />
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Close menu"
                      className="inline-flex h-9 w-9 items-center justify-center rounded text-[#1A1A1A]/75 hover:bg-[#1A1A1A]/5 hover:text-[#C93636]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav aria-label="Mobile Primary Navigation" className="mt-6 flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => {
                      const active = isActive(item.to);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`rounded px-3 py-3 text-base font-semibold transition-colors ${
                            active
                              ? 'bg-[#C93636] text-white'
                              : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-[#5D5B58]">
                  Jerseology · Season 25/26
                </p>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
