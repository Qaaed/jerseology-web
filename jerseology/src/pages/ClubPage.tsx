import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CLUBS, getClubBySlug, getProductsForClub } from '../data/catalog';
import { ClubHero } from '../components/ClubHero';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';

export function ClubPage() {
  const { slug = 'chelsea' } = useParams();
  const club = getClubBySlug(slug) ?? CLUBS[0];
  const [scrollProgress, setScrollProgress] = useState(0);

  const currentIdx = CLUBS.findIndex((c) => c.slug === club.slug);
  const nextClub = CLUBS[(currentIdx + 1) % CLUBS.length];
  const otherClubs = CLUBS.filter((c) => c.slug !== club.slug);
  const clubProducts = getProductsForClub(club.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 800;
      const p = Math.min(1, Math.max(0, window.scrollY / vh));
      setScrollProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      {/* Parallax-pinned 100vh Club Hero */}
      <div className="relative">
        <ClubHero
          club={club}
          nextClub={nextClub}
          scrollProgress={scrollProgress}
          showExploreButton={false}
        />
      </div>

      {/* "The Full Kit" product grid */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-3 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#AD2828]">
              {club.name} · Official & Heritage Lineup
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.25rem,4vw,3.5rem)] uppercase leading-none text-[#111111]">
              The Full Kit
            </h2>
          </div>
          <span className="font-mono-label text-xs uppercase text-[#111111]/60">
            {clubProducts.length} Silhouettes Available
          </span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
          {clubProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              tintColor={club.tintColor}
              compactClubView
            />
          ))}
        </div>
      </section>

      {/* "Other Clubs" horizontal carousel */}
      <section className="border-t border-black/10 bg-[#E7E1D6]/45 py-14 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#111111]/60">
                Keep Exploring
              </p>
              <h2 className="mt-1 font-display text-3xl uppercase text-[#111111]">
                Other Clubs
              </h2>
            </div>
            <Link
              to="/collection"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#AD2828]"
            >
              Club Index <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-7 flex gap-5 overflow-x-auto pb-4 no-scrollbar">
            {otherClubs.map((other) => (
              <Link
                key={other.slug}
                to={`/club/${other.slug}`}
                className="group flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="aspect-[4/3] w-full overflow-hidden p-4"
                  style={{ backgroundColor: other.tintColor }}
                >
                  <ResilientImage
                    src={other.heroImage}
                    alt={other.name}
                    className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-mono-label text-[10px] uppercase tracking-wider text-[#111111]/55">
                    {other.sport} · {other.league}
                  </p>
                  <h3 className="mt-1 font-display text-2xl uppercase leading-none text-[#111111] group-hover:text-[#AD2828]">
                    {other.shortWordmark}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
