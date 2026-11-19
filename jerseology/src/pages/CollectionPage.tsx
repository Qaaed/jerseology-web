import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ADDON_UPSELLS, CLUBS, PRODUCTS } from '../data/catalog';
import { formatPrice } from '../lib/format';
import { useStore } from '../store/useStore';
import { FilterBar, type CollectionFilterState } from '../components/FilterBar';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';

export function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currency = useStore((s) => s.currency);

  const filters: CollectionFilterState = {
    sport: searchParams.get('sport') ?? 'All',
    category: searchParams.get('category') ?? 'All',
    season: searchParams.get('season') ?? 'All',
    size: searchParams.get('size') ?? 'All',
    maxPrice: Number(searchParams.get('maxPrice') ?? 15000),
    version: searchParams.get('version') ?? 'All',
    sleeve: searchParams.get('sleeve') ?? 'All',
    personalisation: searchParams.get('personalisation') ?? 'All',
    sort: searchParams.get('sort') ?? 'new',
    view:
      searchParams.get('view') === 'products' ||
      Boolean(
        searchParams.get('category') ||
          searchParams.get('season') ||
          searchParams.get('size') ||
          searchParams.get('version') ||
          searchParams.get('sleeve') ||
          searchParams.get('personalisation') ||
          searchParams.get('maxPrice') ||
          searchParams.get('sort')
      )
        ? 'products'
        : 'clubs',
  };

  const updateFilters = (patch: Partial<CollectionFilterState>) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams();
    if (next.sport !== 'All') params.set('sport', next.sport);
    if (next.category !== 'All') params.set('category', next.category);
    if (next.season !== 'All') params.set('season', next.season);
    if (next.size !== 'All') params.set('size', next.size);
    if (next.maxPrice < 15000) params.set('maxPrice', String(next.maxPrice));
    if (next.version !== 'All') params.set('version', next.version);
    if (next.sleeve !== 'All') params.set('sleeve', next.sleeve);
    if (next.personalisation !== 'All') params.set('personalisation', next.personalisation);
    if (next.sort !== 'new') params.set('sort', next.sort);
    if (next.view === 'products') params.set('view', 'products');
    setSearchParams(params, { replace: true });
  };

  const resetFilters = () => setSearchParams({}, { replace: true });

  const filteredClubs = useMemo(() => {
    if (filters.sport === 'All') return CLUBS;
    return CLUBS.filter((c) => c.sport === filters.sport);
  }, [filters.sport]);

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (filters.sport !== 'All' && p.sport !== filters.sport) return false;
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      if (filters.season !== 'All' && p.season !== filters.season) return false;
      if (filters.version !== 'All' && !p.availableVersions.includes(filters.version as never))
        return false;
      if (filters.sleeve === 'Long' && !p.allowSleeveOption) return false;
      if (filters.size !== 'All') {
        if (filters.size === 'Kids 4–14') {
          if (!p.availableSizes.some((s) => s.startsWith('Kids'))) return false;
        } else if (filters.size === 'Baby') {
          if (!p.availableSizes.some((s) => s.startsWith('Baby'))) return false;
        } else if (!p.availableSizes.includes(filters.size)) {
          return false;
        }
      }
      if (
        (filters.personalisation === 'With Name' ||
          filters.personalisation === 'With Number' ||
          filters.personalisation === 'With Patches') &&
        !p.allowPersonalisation
      ) {
        return false;
      }
      if (p.priceLkr > filters.maxPrice) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (filters.sort === 'price-asc') return a.priceLkr - b.priceLkr;
      if (filters.sort === 'price-desc') return b.priceLkr - a.priceLkr;
      if (filters.sort === 'bestsellers') return a.bestSellerRank - b.bestSellerRank;
      if (filters.sort === 'az') return a.name.localeCompare(b.name);
      return Number(b.isNewArrival) - Number(a.isNewArrival);
    });
  }, [filters]);

  return (
    <div>
      <section className="border-b border-black/10 bg-[#F3EADB] py-12 lg:py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#AD2828]">
            2026 / 27 Archive & Active Roster
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-none text-[#111111]">
            Our Collection
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#111111]/70">
            Browse by club dossier or filter across Football and Formula 1 editions. Every filter updates the URL so you can share curated drops with teammates.
          </p>
        </div>
      </section>

      <FilterBar
        filters={filters}
        currency={currency}
        resultCount={filteredProducts.length}
        onUpdate={updateFilters}
        onReset={resetFilters}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {filters.view === 'clubs' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredClubs.map((club) => (
              <Link
                key={club.slug}
                to={`/club/${club.slug}`}
                className="group relative flex min-h-[300px] items-center justify-between overflow-hidden rounded-2xl border border-black/10 p-6 sm:p-8 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: `linear-gradient(125deg, ${club.tintColor} 0%, #F3EADB 68%)`,
                }}
              >
                {/* Giant cropped club wordmark behind */}
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute -left-3 top-2 select-none text-[clamp(3.2rem,7vw,5.5rem)] uppercase leading-none opacity-14"
                  style={{ color: club.primaryColor }}
                >
                  {club.shortWordmark}
                </span>

                <div className="relative z-10 flex max-w-[58%] flex-col justify-between gap-6">
                  <div>
                    <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-[#AD2828]">
                      {club.sport} · {club.league}
                    </p>
                    <h2 className="mt-1.5 font-display text-3xl uppercase leading-none text-[#111111] sm:text-4xl">
                      {club.name}
                    </h2>
                    <p className="mt-2 font-mono-label text-[11px] text-[#111111]/60">
                      Est. {club.foundedYear} · {club.city} · {club.worldRanking}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] group-hover:text-[#AD2828]">
                    Explore Full Kit <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="relative z-10 w-36 shrink-0 sm:w-44">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-[0_18px_32px_rgba(11,27,58,0.18)] transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-103">
                    <ResilientImage
                      src={club.heroImage}
                      alt={club.name}
                      fallbackBg={club.tintColor}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-black/10 bg-white/60 py-16 text-center">
            <p className="text-base font-medium text-[#111111]">
              Nothing here yet. The squad is warming up.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex h-10 items-center rounded-md bg-[#111111] px-5 text-xs font-semibold uppercase tracking-wider text-[#F3EADB]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-16 border-t border-black/10 pt-12">
              <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#2563EB]">
                Kit Customisation Add-Ons
              </p>
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                {ADDON_UPSELLS.map((addon) => (
                  <Link
                    key={addon.id}
                    to="/product/adult-fan-version-jersey"
                    className="group flex flex-col justify-between rounded-xl border border-[#2563EB] bg-white/80 p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono-label text-[11px] uppercase tracking-[0.14em] text-[#2563EB]">
                          Add-On Option
                        </span>
                        <span className="font-mono-label text-sm font-semibold tabular-nums text-[#2563EB]">
                          +{formatPrice(addon.deltaLkr, currency)}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl uppercase text-[#111111] group-hover:text-[#2563EB] transition-colors">
                        {addon.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#111111]/75">{addon.subtitle}</p>
                      <p className="mt-2 text-xs leading-relaxed text-[#111111]/60">{addon.detail}</p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono-label text-[11px] font-semibold uppercase tracking-wider text-[#2563EB]">
                      Configure on Any Jersey <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
