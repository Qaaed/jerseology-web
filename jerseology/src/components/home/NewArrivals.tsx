import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../../data/catalog';
import { ProductCard } from '../ProductCard';

export function NewArrivals() {
  const arrivals = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 8);

  return (
    <section className="relative bg-[#FFF9F0] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-[#D9CEBF] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C93636]">
              New Arrivals
            </p>
            <h2
              className="font-editorial mt-3 uppercase leading-[0.9] text-[#1A1A1A]"
              style={{ fontSize: 'clamp(2.25rem, 4.6vw, 4rem)' }}
            >
              Fresh Off The Pitch.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#5D5B58] sm:text-base">
              Discover the latest additions to the Jerseyology collection.
            </p>
          </div>

          <Link
            to="/collection"
            className="group inline-flex items-center gap-2 font-mono-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C93636]"
          >
            View Full Catalogue
            <ArrowRight className="h-4 w-4 text-[#C93636] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">
          {arrivals.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} tintColor="#F3EADB" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
