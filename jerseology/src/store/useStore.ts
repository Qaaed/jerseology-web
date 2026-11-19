import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';
import type { CurrencyCode } from '../lib/format';

interface ToastData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  currency: CurrencyCode;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isShippingModalOpen: boolean;
  quickShopProductId: string | null;
  toast: ToastData | null;

  addToCart: (item: Omit<CartItem, 'cartKey'>) => void;
  updateQuantity: (cartKey: string, delta: number) => void;
  removeFromCart: (cartKey: string) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;
  setCurrency: (currency: CurrencyCode) => void;

  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setShippingModalOpen: (open: boolean) => void;
  openQuickShop: (productId: string | null) => void;
  dismissToast: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      currency: 'LKR',
      isCartOpen: false,
      isWishlistOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      isShippingModalOpen: false,
      quickShopProductId: null,
      toast: null,

      addToCart: (item) => {
        const cartKey = [
          item.productId,
          item.version,
          item.sleeve,
          item.size,
          item.customName.trim().toUpperCase(),
          item.customNumber.trim(),
          [...item.patches].sort().join(','),
        ].join('|');

        const existing = get().cart.find((c) => c.cartKey === cartKey);
        if (existing) {
          set({
            cart: get().cart.map((c) =>
              c.cartKey === cartKey ? { ...c, quantity: c.quantity + item.quantity } : c
            ),
          });
        } else {
          set({
            cart: [...get().cart, { ...item, cartKey }],
          });
        }

        const toastId = `${Date.now()}`;
        set({
          toast: {
            id: toastId,
            title: 'Added to bag — View Cart',
            subtitle: `${item.name} · ${item.size}`,
            image: item.image,
          },
        });

        setTimeout(() => {
          if (get().toast?.id === toastId) {
            set({ toast: null });
          }
        }, 4200);
      },

      updateQuantity: (cartKey, delta) => {
        set({
          cart: get()
            .cart.map((c) =>
              c.cartKey === cartKey ? { ...c, quantity: c.quantity + delta } : c
            )
            .filter((c) => c.quantity > 0),
        });
      },

      removeFromCart: (cartKey) => {
        set({ cart: get().cart.filter((c) => c.cartKey !== cartKey) });
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        const current = get().wishlist;
        const exists = current.includes(productId);
        set({
          wishlist: exists
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        });
      },

      setCurrency: (currency) => set({ currency }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setShippingModalOpen: (open) => set({ isShippingModalOpen: open }),
      openQuickShop: (productId) => set({ quickShopProductId: productId }),
      dismissToast: () => set({ toast: null }),
    }),
    {
      name: 'jerseology-store-v1',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        currency: state.currency,
      }),
    }
  )
);
