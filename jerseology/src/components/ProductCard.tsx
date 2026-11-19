import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../types';
import { formatPrice } from '../lib/format';
import { useStore } from '../store/useStore';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  tintColor?: string;
  compactClubView?: boolean;
}

export function ProductCard({
  product,
  tintColor = '#EFEFEF',
  compactClubView = false,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const currency = useStore((s) => s.currency);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const openQuickShop = useStore((s) => s.openQuickShop);

  const isWishlisted = wishlist.includes(product.id);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? product.images[0];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col"
    >
      {/* Image Frame */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-[0_6px_22px_rgba(17,17,17,0.06)] transition-shadow duration-200 group-hover:shadow-[0_14px_34px_rgba(17,17,17,0.12)]"
        style={{ backgroundColor: tintColor }}
      >
        <Link
          to={`/product/${product.slug}`}
          state={{ fromProductCard: true }}
          className="block h-full w-full"
        >
          <ResilientImage
            src={hovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            fallbackBg={tintColor}
          />
        </Link>

        {/* Quiet inline tag — max 1, unboxed editorial style */}
        {product.isNewArrival && (
          <span className="font-mono-label pointer-events-none absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111111]/70">
            New Drop
          </span>
        )}

        {/* Wishlist toggle */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EADB]/90 backdrop-blur-xs transition-all hover:scale-105 ${
            isWishlisted ? 'text-[#AD2828]' : 'text-[#111111]/70 hover:text-[#AD2828]'
          }`}
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? '#AD2828' : 'none'} />
        </button>

        {/* Quick-Shop "+" action */}
        <button
          type="button"
          onClick={() => openQuickShop(product.id)}
          aria-label={`Quick shop ${product.name}`}
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-[#F3EADB] shadow-md transition-all duration-150 hover:bg-[#AD2828] hover:scale-105"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      {/* Product Title & Price */}
      <div className="mt-3.5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[11px] font-mono-label uppercase tracking-wider text-[#111111]/55">
          <span>{product.sport}</span>
          <span aria-hidden="true">·</span>
          <span>{product.defaultVersion}</span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className={`text-sm font-semibold leading-snug text-[#111111] transition-colors group-hover:text-[#AD2828] ${
            compactClubView ? 'font-mono-label uppercase tracking-wide text-xs' : ''
          }`}
        >
          {product.name}
        </Link>

        <div className="mt-0.5 flex items-baseline gap-2.5">
          <span className="font-mono-label relative inline-block text-sm font-semibold tabular-nums text-[#111111]">
            {formatPrice(product.priceLkr, currency)}
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[#AD2828] transition-transform duration-200 group-hover:scale-x-100"
            />
          </span>
          {product.compareAtLkr && (
            <span className="font-mono-label text-xs tabular-nums text-[#111111]/40 line-through">
              {formatPrice(product.compareAtLkr, currency)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
