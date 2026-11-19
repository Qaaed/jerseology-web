import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, Minus, Plus, Ruler } from 'lucide-react';
import { AVAILABLE_PATCHES, calculateConfiguredUnitPrice, formatPrice } from '../lib/format';
import { useStore } from '../store/useStore';
import type { Club, KitVersion, Product, SleeveType } from '../types';

interface ConfiguratorSidebarProps {
  product: Product;
  club?: Club;
  version: KitVersion;
  setVersion: (v: KitVersion) => void;
  sleeve: SleeveType;
  setSleeve: (s: SleeveType) => void;
  size: string;
  setSize: (s: string) => void;
  addName: boolean;
  setAddName: (b: boolean) => void;
  customName: string;
  setCustomName: (s: string) => void;
  addNumber: boolean;
  setAddNumber: (b: boolean) => void;
  customNumber: string;
  setCustomNumber: (s: string) => void;
  patches: string[];
  togglePatch: (id: string) => void;
  onOpenSizeGuide: () => void;
  onOpenVersionDiff: () => void;
}

export function ConfiguratorSidebar({
  product,
  club,
  version,
  setVersion,
  sleeve,
  setSleeve,
  size,
  setSize,
  addName,
  setAddName,
  customName,
  setCustomName,
  addNumber,
  setAddNumber,
  customNumber,
  setCustomNumber,
  patches,
  togglePatch,
  onOpenSizeGuide,
  onOpenVersionDiff,
}: ConfiguratorSidebarProps) {
  const [quantity, setQuantity] = useState(1);
  const [personalisationOpen, setPersonalisationOpen] = useState(true);

  const currency = useStore((s) => s.currency);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);

  const isWishlisted = wishlist.includes(product.id);
  const hasNameSet = Boolean((addName && customName.trim()) || (addNumber && customNumber.trim()));

  const unitPriceLkr = calculateConfiguredUnitPrice({
    basePriceLkr: product.priceLkr,
    defaultVersion: product.defaultVersion,
    selectedVersion: version,
    selectedSleeve: sleeve,
    hasNameSet,
    patchesCount: patches.length,
  });

  const totalLkr = unitPriceLkr * quantity;

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      clubName: club?.name ?? product.sport,
      image: product.images[0],
      version,
      sleeve,
      size,
      customName: addName ? customName.toUpperCase() : '',
      customNumber: addNumber ? customNumber : '',
      patches,
      quantity,
      unitPriceLkr,
    });
  };

  return (
    <div className="lg:sticky lg:top-[112px] space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="font-mono-label flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-[#111111]/55">
        <Link to="/" className="hover:text-[#111111]">Home</Link>
        <span>/</span>
        <Link to={`/collection?sport=${product.sport}`} className="hover:text-[#111111]">
          {product.sport}
        </Link>
        {club && (
          <>
            <span>/</span>
            <Link to={`/club/${club.slug}`} className="hover:text-[#111111]">
              {club.shortWordmark}
            </Link>
          </>
        )}
      </nav>

      {/* Title & Live Price */}
      <div>
        <h1 className="font-display text-[clamp(2.25rem,3.6vw,3.25rem)] uppercase leading-[0.95] text-[#111111] text-balance">
          {product.name}
        </h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-mono-label text-2xl font-semibold tabular-nums text-[#111111]">
            {formatPrice(unitPriceLkr, currency)}
          </span>
          {product.compareAtLkr && (
            <span className="font-mono-label text-sm tabular-nums text-[#111111]/40 line-through">
              {formatPrice(product.compareAtLkr, currency)}
            </span>
          )}
          <span className="font-mono-label text-[11px] uppercase tracking-wider text-[#111111]/50">
            SKU: {product.sku}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#111111]/75">{product.description}</p>
      </div>

      {/* Version Toggle */}
      <div className="border-t border-black/10 pt-5">
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-xs uppercase tracking-wider text-[#111111]">
            1. Kit Version
          </span>
          <button
            type="button"
            onClick={onOpenVersionDiff}
            className="text-xs font-medium text-[#AD2828] underline-offset-4 hover:underline"
          >
            What&apos;s the difference?
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {product.availableVersions.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVersion(v)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                version === v
                  ? 'border-[#111111] bg-[#111111] text-[#F3EADB]'
                  : 'border-black/15 bg-white text-[#111111] hover:border-black/40'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Sleeve Toggle */}
      {product.allowSleeveOption && (
        <div className="border-t border-black/10 pt-5">
          <span className="font-mono-label text-xs uppercase tracking-wider text-[#111111]">
            2. Sleeve Length
          </span>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            {(['Short', 'Long'] as SleeveType[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSleeve(s)}
                className={`flex h-11 items-center justify-between rounded-md border px-3.5 text-xs font-medium transition-colors ${
                  sleeve === s
                    ? 'border-[#111111] bg-[#111111] text-[#F3EADB]'
                    : 'border-black/15 bg-white text-[#111111] hover:border-black/40'
                }`}
              >
                <span>{s} Sleeve</span>
                <span className="font-mono-label opacity-80">
                  {s === 'Long' ? '+720 LKR' : 'Included'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div className="border-t border-black/10 pt-5">
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-xs uppercase tracking-wider text-[#111111]">
            Select Size
          </span>
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111]/70 hover:text-[#AD2828]"
          >
            <Ruler className="h-3.5 w-3.5" /> Size Guide
          </button>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {product.availableSizes.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSize(sz)}
              className={`flex min-h-[44px] items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors ${
                size === sz
                  ? 'border-[#111111] bg-[#111111] text-[#F3EADB]'
                  : 'border-black/15 bg-white text-[#111111] hover:border-black/40'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Personalisation Accordion */}
      {product.allowPersonalisation && (
        <div className="rounded-xl border border-black/10 bg-white/75">
          <button
            type="button"
            onClick={() => setPersonalisationOpen(!personalisationOpen)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left"
          >
            <div>
              <span className="font-mono-label block text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Personalisation & Competition Patches
              </span>
              <span className="text-[11px] text-[#111111]/60">
                Name Set (+950 LKR) · Patches (+380 LKR each)
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${personalisationOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {personalisationOpen && (
            <div className="space-y-4 border-t border-black/10 p-4">
              {/* Name Toggle */}
              <div>
                <label className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addName}
                      onChange={(e) => setAddName(e.target.checked)}
                      className="h-4 w-4 accent-[#AD2828]"
                    />
                    Add Player Name (max 12 chars)
                  </span>
                  <span className="font-mono-label text-[11px] text-[#AD2828]">+950 LKR</span>
                </label>
                {addName && (
                  <input
                    type="text"
                    maxLength={12}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    placeholder="E.G. PALMER"
                    className="mt-2 h-10 w-full rounded border border-black/15 bg-white px-3 font-mono-label text-xs uppercase tracking-widest"
                  />
                )}
              </div>

              {/* Number Toggle */}
              <div>
                <label className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addNumber}
                      onChange={(e) => setAddNumber(e.target.checked)}
                      className="h-4 w-4 accent-[#AD2828]"
                    />
                    Add Squad Number (0–99)
                  </span>
                  <span className="font-mono-label text-[11px] text-[#111111]/55">
                    Included in Name Set
                  </span>
                </label>
                {addNumber && (
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={customNumber}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 2);
                      setCustomNumber(val);
                    }}
                    placeholder="10"
                    className="mt-2 h-10 w-28 rounded border border-black/15 bg-white px-3 font-mono-label text-sm font-semibold tabular-nums"
                  />
                )}
              </div>

              {/* Patches */}
              <div className="border-t border-black/10 pt-3">
                <p className="font-mono-label text-[11px] uppercase tracking-wider text-[#111111]/60">
                  Competition Sleeve Patches (+380 LKR each)
                </p>
                <div className="mt-2 space-y-2">
                  {AVAILABLE_PATCHES.map((patch) => {
                    const checked = patches.includes(patch.label);
                    return (
                      <label
                        key={patch.id}
                        className={`flex cursor-pointer items-center justify-between rounded-md border p-2.5 text-xs transition-colors ${
                          checked
                            ? 'border-[#0B1B3A] bg-[#0B1B3A]/5'
                            : 'border-black/10 bg-white hover:border-black/25'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePatch(patch.label)}
                            className="h-4 w-4 accent-[#AD2828]"
                          />
                          <span className="inline-flex h-6 w-9 items-center justify-center rounded bg-[#111111] font-mono-label text-[9px] font-bold text-[#F3EADB]">
                            {patch.badge}
                          </span>
                          <span className="font-medium text-[#111111]">{patch.label}</span>
                        </span>
                        <span className="font-mono-label text-[11px] tabular-nums text-[#111111]/70">
                          +380 LKR
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity + Primary CTAs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 items-center rounded-md border border-black/15 bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="inline-flex h-full w-10 items-center justify-center hover:bg-black/5"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-mono-label w-9 text-center text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="inline-flex h-full w-10 items-center justify-center hover:bg-black/5"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex h-12 flex-1 items-center justify-center rounded-md bg-[#AD2828] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#F3EADB] shadow-md transition-colors hover:bg-[#a92a24]"
          >
            Add to Cart · {formatPrice(totalLkr, currency)}
          </button>
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-black/20 text-xs font-semibold uppercase tracking-wider text-[#111111] transition-colors hover:border-[#AD2828] hover:text-[#AD2828]"
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? '#AD2828' : 'none'} />
          {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>
      </div>
    </div>
  );
}
