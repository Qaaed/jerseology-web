import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { CurrencyCode } from '../lib/format';
import { formatPrice } from '../lib/format';

export interface CollectionFilterState {
  sport: string;
  category: string;
  season: string;
  size: string;
  maxPrice: number;
  version: string;
  sleeve: string;
  personalisation: string;
  sort: string;
  view: 'clubs' | 'products';
}

interface FilterBarProps {
  filters: CollectionFilterState;
  currency: CurrencyCode;
  resultCount: number;
  onUpdate: (patch: Partial<CollectionFilterState>) => void;
  onReset: () => void;
}

const SPORTS = ['All', 'Football', 'F1'];
const CATEGORIES = [
  'All',
  'Jerseys',
  'Shorts',
  'Socks',
  'Grip Socks',
  'Hair Bands',
  'Jackets',
  'Tracksuits',
  'Accessories',
  'Retro',
  'Kids',
  'Baby',
];
const SEASONS = ['All', '2024/25', '2025/26', '2026/27', 'Retro'];
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Kids 4–14', 'Baby'];
const VERSIONS = ['All', 'Fan', 'Player', 'GK', 'Retro'];
const SLEEVES = ['All', 'Short', 'Long'];
const PERSONALISATIONS = ['All', 'With Name', 'With Number', 'With Patches', 'Without'];
const SORTS = [
  { value: 'new', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'bestsellers', label: 'Best Sellers' },
  { value: 'az', label: 'A–Z' },
];

export function FilterBar({
  filters,
  currency,
  resultCount,
  onUpdate,
  onReset,
}: FilterBarProps) {
  return (
    <div className="sticky top-[92px] z-30 border-b border-black/10 bg-[#F3EADB]/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 py-3.5 sm:px-6 lg:px-10">
        {/* Top row: Sport tabs + View switch + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {SPORTS.map((sport) => {
              const active = filters.sport === sport;
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => onUpdate({ sport })}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#111111] text-[#F3EADB]'
                      : 'bg-white/70 text-[#111111]/75 hover:bg-white hover:text-[#111111]'
                  }`}
                >
                  {sport}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex rounded-md border border-black/15 bg-white/70 p-0.5">
              <button
                type="button"
                onClick={() => onUpdate({ view: 'clubs' })}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  filters.view === 'clubs'
                    ? 'bg-[#111111] text-[#F3EADB]'
                    : 'text-[#111111]/70 hover:text-[#111111]'
                }`}
              >
                Club Index
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ view: 'products' })}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  filters.view === 'products'
                    ? 'bg-[#111111] text-[#F3EADB]'
                    : 'text-[#111111]/70 hover:text-[#111111]'
                }`}
              >
                All Products ({resultCount})
              </button>
            </div>

            <label className="sr-only" htmlFor="sort-select">
              Sort products
            </label>
            <select
              id="sort-select"
              value={filters.sort}
              onChange={(e) => onUpdate({ sort: e.target.value, view: 'products' })}
              className="h-9 rounded-md border border-black/15 bg-white px-3 text-xs font-medium text-[#111111]"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second row: Detailed attribute filters */}
        <div className="mt-3 flex flex-wrap items-center gap-2.5 border-t border-black/5 pt-3">
          <span className="inline-flex items-center gap-1.5 font-mono-label text-[11px] uppercase tracking-wider text-[#111111]/55 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </span>

          <select
            aria-label="Filter by Category"
            value={filters.category}
            onChange={(e) => onUpdate({ category: e.target.value, view: 'products' })}
            className="h-8 rounded border border-black/15 bg-white px-2.5 text-xs text-[#111111]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by Season"
            value={filters.season}
            onChange={(e) => onUpdate({ season: e.target.value, view: 'products' })}
            className="h-8 rounded border border-black/15 bg-white px-2.5 text-xs text-[#111111]"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}>
                Season: {s}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by Size"
            value={filters.size}
            onChange={(e) => onUpdate({ size: e.target.value, view: 'products' })}
            className="h-8 rounded border border-black/15 bg-white px-2.5 text-xs text-[#111111]"
          >
            {SIZES.map((sz) => (
              <option key={sz} value={sz}>
                Size: {sz}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by Version"
            value={filters.version}
            onChange={(e) => onUpdate({ version: e.target.value, view: 'products' })}
            className="h-8 rounded border border-black/15 bg-white px-2.5 text-xs text-[#111111]"
          >
            {VERSIONS.map((v) => (
              <option key={v} value={v}>
                Version: {v}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by Sleeve"
            value={filters.sleeve}
            onChange={(e) => onUpdate({ sleeve: e.target.value, view: 'products' })}
            className="h-8 rounded border border-black/15 bg-white px-2.5 text-xs text-[#111111]"
          >
            {SLEEVES.map((sl) => (
              <option key={sl} value={sl}>
                Sleeve: {sl}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by Personalisation"
            value={filters.personalisation}
            onChange={(e) => onUpdate({ personalisation: e.target.value, view: 'products' })}
            className="h-8 rounded border border-black/15 bg-white px-2.5 text-xs text-[#111111]"
          >
            {PERSONALISATIONS.map((p) => (
              <option key={p} value={p}>
                Personalisation: {p}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 rounded border border-black/15 bg-white px-3 py-1">
            <label htmlFor="price-slider" className="font-mono-label text-[11px] text-[#111111]/65">
              Max {formatPrice(filters.maxPrice, currency)}
            </label>
            <input
              id="price-slider"
              type="range"
              min={2000}
              max={15000}
              step={250}
              value={filters.maxPrice}
              onChange={(e) =>
                onUpdate({ maxPrice: Number(e.target.value), view: 'products' })
              }
              className="w-24 accent-[#AD2828]"
            />
          </div>

          <button
            type="button"
            onClick={onReset}
            className="ml-auto inline-flex h-8 items-center gap-1 rounded px-2.5 text-xs font-medium text-[#AD2828] hover:bg-[#AD2828]/10"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
