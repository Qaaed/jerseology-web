import { Link } from 'react-router-dom';
import { ArrowRight, Flag, Footprints, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const COLLECTIONS = [
  {
    key: 'football',
    icon: Trophy,
    heading: 'FOOTBALL JERSEYS',
    description: 'Club icons. National pride. Timeless styles.',
    image: '/src/assets/images/jersey_chelsea_home_1795090361005.jpg',
    to: '/collection?sport=Football',
    cardClass: 'bg-gradient-to-br from-[#F3EADB] via-[#F3EADB] to-[#8BC8B9]/50',
  },
  {
    key: 'f1',
    icon: Flag,
    heading: 'F1 JERSEYS',
    description: 'Team kits, driver editions and more.',
    image: '/src/assets/images/sport_f1_racing_1795090361749.jpg',
    to: '/collection?sport=F1',
    cardClass: 'bg-gradient-to-br from-[#F3EADB] via-[#8BC8B9]/35 to-[#F3EADB]',
  },
  {
    key: 'grip-socks',
    icon: Footprints,
    heading: 'GRIP SOCKS',
    description: 'Performance, comfort and control.',
    image: '/src/assets/images/kids_kit_accessories_1795090361913.jpg',
    to: '/collection?category=Grip+Socks',
    cardClass: 'bg-gradient-to-br from-[#8BC8B9] via-[#8BC8B9]/85 to-[#8BC8B9]/60',
  },
];

export function FeaturedCollections() {
  return (
    <section className="relative bg-[#F3EADB] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Section heading row */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            className="font-editorial uppercase leading-[0.9] text-[#1A1A1A]"
            style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)' }}
          >
            Featured Collections
          </h2>

          <div className="flex w-full items-center gap-5 sm:w-auto sm:max-w-md">
            <span aria-hidden="true" className="h-[2px] flex-1 bg-[#C93636]/80" />
            <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C93636] whitespace-nowrap">
              The Jerseyology Edit
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {COLLECTIONS.map((col, idx) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={col.to}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#D9CEBF] ${col.cardClass} p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C93636]/40 hover:shadow-[0_18px_40px_rgba(26,26,26,0.14)]`}
                >
                  <div className="flex items-center gap-2 text-[#C93636]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.22em]">
                      Collection
                    </span>
                  </div>

                  <h3
                    className="font-editorial-upright mt-5 uppercase leading-[0.9] text-[#1A1A1A]"
                    style={{ fontSize: 'clamp(1.6rem, 2.2vw, 2.1rem)' }}
                  >
                    {col.heading}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#1A1A1A]/75">
                    {col.description}
                  </p>

                  <div className="relative mt-7 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#1A1A1A]/5">
                    <img
                      src={col.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/35 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-70"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]">
                      Shop Collection
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C93636] text-white shadow-[0_6px_16px_rgba(201,54,54,0.28)] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#AD2828]"
                    >
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
