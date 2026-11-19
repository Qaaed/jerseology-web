import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CLUBS, PRODUCTS } from '../data/catalog';
import { formatPrice } from '../lib/format';
import { useStore } from '../store/useStore';
import { ResilientImage } from './ResilientImage';

export function SearchModal() {
  const isSearchOpen = useStore((s) => s.isSearchOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const currency = useStore((s) => s.currency);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  const trimmed = query.trim().toLowerCase();
  const matchedClubs = CLUBS.filter(
    (c) =>
      c.name.toLowerCase().includes(trimmed) ||
      c.sport.toLowerCase().includes(trimmed) ||
      c.league.toLowerCase().includes(trimmed)
  ).slice(0, 6);

  const matchedProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(trimmed) ||
      p.category.toLowerCase().includes(trimmed) ||
      p.sport.toLowerCase().includes(trimmed)
  ).slice(0, 6);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-6 z-50 mx-auto w-[92%] max-w-2xl overflow-hidden rounded-xl bg-[#F3EADB] shadow-2xl"
            role="dialog"
            aria-label="Search Jerseology"
          >
            <div className="flex items-center gap-3 border-b border-black/10 px-5 py-4">
              <Search className="h-5 w-5 text-[#111111]/50" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clubs, retro jerseys, F1 jackets, grip socks..."
                className="flex-1 bg-transparent text-sm text-[#111111] placeholder:text-[#111111]/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5">
              {matchedClubs.length === 0 && matchedProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#111111]/60">
                  Nothing here yet. The squad is warming up.
                </p>
              ) : (
                <div className="space-y-6">
                  {matchedClubs.length > 0 && (
                    <div>
                      <h4 className="font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#111111]/50">
                        Clubs & Teams
                      </h4>
                      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {matchedClubs.map((club) => (
                          <Link
                            key={club.slug}
                            to={`/club/${club.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg border border-black/10 bg-white/70 p-2.5 hover:border-[#AD2828] transition-colors"
                          >
                            <span
                              className="h-3.5 w-3.5 shrink-0 rounded-full"
                              style={{ backgroundColor: club.primaryColor }}
                            />
                            <span className="truncate text-xs font-semibold text-[#111111]">
                              {club.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedProducts.length > 0 && (
                    <div>
                      <h4 className="font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#111111]/50">
                        Products
                      </h4>
                      <ul className="mt-2.5 divide-y divide-black/10">
                        {matchedProducts.map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between gap-3 py-2.5 hover:text-[#AD2828]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-9 shrink-0 overflow-hidden rounded bg-[#E7E1D6]">
                                  <ResilientImage src={product.images[0]} alt={product.name} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{product.name}</p>
                                  <p className="font-mono-label text-[11px] uppercase text-[#111111]/50">
                                    {product.sport} · {product.category}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono-label text-xs font-semibold tabular-nums">
                                {formatPrice(product.priceLkr, currency)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
