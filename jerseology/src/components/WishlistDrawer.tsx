import { Link } from 'react-router-dom';
import { Heart, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCTS } from '../data/catalog';
import { formatPrice } from '../lib/format';
import { useStore } from '../store/useStore';
import { ResilientImage } from './ResilientImage';

export function WishlistDrawer() {
  const isWishlistOpen = useStore((s) => s.isWishlistOpen);
  const setWishlistOpen = useStore((s) => s.setWishlistOpen);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const openQuickShop = useStore((s) => s.openQuickShop);
  const currency = useStore((s) => s.currency);

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#F3EADB] p-6 shadow-2xl"
            aria-label="Wishlist"
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h2 className="font-display text-2xl uppercase tracking-tight text-[#111111]">
                Saved Kits ({savedProducts.length})
              </h2>
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                aria-label="Close wishlist"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {savedProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <Heart className="h-10 w-10 text-[#111111]/30" strokeWidth={1.5} />
                  <p className="mt-4 text-sm font-medium text-[#111111]">
                    Nothing here yet. The squad is warming up.
                  </p>
                  <Link
                    to="/collection"
                    onClick={() => setWishlistOpen(false)}
                    className="mt-5 inline-flex h-10 items-center rounded-md bg-[#111111] px-5 text-xs font-semibold uppercase tracking-wider text-[#F3EADB] hover:bg-[#AD2828] transition-colors"
                  >
                    Browse Collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-black/10">
                  {savedProducts.map((product) => (
                    <li key={product.id} className="flex gap-4 py-4">
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#E7E1D6]">
                        <ResilientImage src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={() => setWishlistOpen(false)}
                              className="text-sm font-semibold text-[#111111] hover:text-[#AD2828]"
                            >
                              {product.name}
                            </Link>
                            <p className="font-mono-label mt-1 text-xs font-semibold tabular-nums text-[#111111]/75">
                              {formatPrice(product.priceLkr, currency)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="text-[#111111]/40 hover:text-[#AD2828]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setWishlistOpen(false);
                            openQuickShop(product.id);
                          }}
                          className="mt-3 h-9 w-full rounded border border-[#111111] text-xs font-semibold uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-[#F3EADB] transition-colors"
                        >
                          Select Size & Add
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
