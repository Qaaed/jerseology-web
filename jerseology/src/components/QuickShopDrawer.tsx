import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCTS, getClubBySlug } from '../data/catalog';
import { calculateConfiguredUnitPrice, formatPrice } from '../lib/format';
import { useStore } from '../store/useStore';
import type { KitVersion, SleeveType } from '../types';
import { ResilientImage } from './ResilientImage';

export function QuickShopDrawer() {
  const quickShopProductId = useStore((s) => s.quickShopProductId);
  const openQuickShop = useStore((s) => s.openQuickShop);
  const addToCart = useStore((s) => s.addToCart);
  const currency = useStore((s) => s.currency);

  const product = PRODUCTS.find((p) => p.id === quickShopProductId);
  const club = product ? getClubBySlug(product.clubSlug) : undefined;

  const [version, setVersion] = useState<KitVersion>('Fan');
  const [sleeve, setSleeve] = useState<SleeveType>('Short');
  const [size, setSize] = useState<string>('M');

  useEffect(() => {
    if (product) {
      setVersion(product.defaultVersion);
      setSleeve('Short');
      setSize(product.availableSizes[Math.min(2, product.availableSizes.length - 1)] ?? 'M');
    }
  }, [product]);

  const unitPriceLkr = product
    ? calculateConfiguredUnitPrice({
        basePriceLkr: product.priceLkr,
        defaultVersion: product.defaultVersion,
        selectedVersion: version,
        selectedSleeve: sleeve,
        hasNameSet: false,
        patchesCount: 0,
      })
    : 0;

  const handleAdd = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      clubName: club?.name ?? product.sport,
      image: product.images[0],
      version,
      sleeve,
      size,
      customName: '',
      customNumber: '',
      patches: [],
      quantity: 1,
      unitPriceLkr,
    });
    openQuickShop(null);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => openQuickShop(null)}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col justify-between bg-[#F3EADB] p-6 shadow-2xl"
            aria-label="Quick Shop"
          >
            <div className="overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <span className="font-mono-label text-xs uppercase tracking-[0.14em] text-[#111111]/60">
                  Quick Shop · {product.sku}
                </span>
                <button
                  type="button"
                  onClick={() => openQuickShop(null)}
                  aria-label="Close quick shop"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 flex gap-4">
                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-[#E7E1D6]">
                  <ResilientImage src={product.images[0]} alt={product.name} />
                </div>
                <div>
                  <p className="font-mono-label text-[11px] uppercase tracking-wider text-[#111111]/60">
                    {club?.name ?? product.sport}
                  </p>
                  <h3 className="mt-1 font-display text-2xl uppercase leading-none text-[#111111]">
                    {product.name}
                  </h3>
                  <p className="mt-2 font-mono-label text-base font-semibold tabular-nums text-[#AD2828]">
                    {formatPrice(unitPriceLkr, currency)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#111111]/75">
                {product.description}
              </p>

              {/* Version */}
              <div className="mt-6">
                <span className="font-mono-label text-xs uppercase tracking-wider text-[#111111]/60">
                  Version
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.availableVersions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVersion(v)}
                      className={`rounded-md border px-3.5 py-2 text-xs font-medium transition-colors ${
                        version === v
                          ? 'border-[#111111] bg-[#111111] text-[#F3EADB]'
                          : 'border-black/15 bg-white/60 text-[#111111] hover:border-black/40'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleeve */}
              {product.allowSleeveOption && (
                <div className="mt-5">
                  <span className="font-mono-label text-xs uppercase tracking-wider text-[#111111]/60">
                    Sleeve Length
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(['Short', 'Long'] as SleeveType[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSleeve(s)}
                        className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                          sleeve === s
                            ? 'border-[#111111] bg-[#111111] text-[#F3EADB]'
                            : 'border-black/15 bg-white/60 text-[#111111] hover:border-black/40'
                        }`}
                      >
                        {s} {s === 'Long' ? '(+720 LKR)' : '(Included)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              <div className="mt-5">
                <span className="font-mono-label text-xs uppercase tracking-wider text-[#111111]/60">
                  Size
                </span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {product.availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSize(sz)}
                      className={`rounded-md border px-2 py-2.5 text-xs font-medium transition-colors ${
                        size === sz
                          ? 'border-[#111111] bg-[#111111] text-[#F3EADB]'
                          : 'border-black/15 bg-white/60 text-[#111111] hover:border-black/40'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-black/10 pt-5">
              <button
                type="button"
                onClick={handleAdd}
                className="flex h-12 w-full items-center justify-center rounded-md bg-[#AD2828] px-5 text-sm font-semibold uppercase tracking-wider text-[#F3EADB] hover:bg-[#a92a24] transition-colors"
              >
                Add to Bag · {formatPrice(unitPriceLkr, currency)}
              </button>
              <Link
                to={`/product/${product.slug}`}
                onClick={() => openQuickShop(null)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-black/20 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:bg-black/5 transition-colors"
              >
                Full Configurator (Name, Number & Patches) <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
