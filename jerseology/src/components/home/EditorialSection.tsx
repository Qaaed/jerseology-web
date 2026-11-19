import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function EditorialSection() {
  return (
    <section className="relative overflow-hidden bg-[#F3EADB]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 min-h-[380px] lg:order-1 lg:min-h-[640px]"
        >
          <img
            src="/src/assets/images/home_street_lookbook_1795090974245.jpg"
            alt="Jerseyology street culture lookbook"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div aria-hidden="true" className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-[#8BC8B9]/85 mix-blend-multiply blur-[6px]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-6 left-6 h-16 w-28 rotate-[8deg] bg-[#C93636]/80" />

          <div className="absolute bottom-6 right-6 border border-white/40 bg-[#1A1A1A]/70 px-3 py-1.5 backdrop-blur-sm">
            <span className="font-mono-label text-[10px] uppercase tracking-[0.24em] text-white">
              Campaign · Pitch To Pavement
            </span>
          </div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 flex flex-col justify-center bg-[#F3EADB] px-6 py-20 sm:px-10 lg:order-2 lg:px-16 lg:py-28"
        >
          <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C93636]">
            The Jerseyology Studio
          </p>
          <h2
            className="font-editorial mt-4 uppercase leading-[0.86] text-[#1A1A1A]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)' }}
          >
            More Than A Jersey.
          </h2>
          <h3
            className="font-editorial mt-1 uppercase leading-[0.86] text-[#C93636]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)' }}
          >
            It's A Culture.
          </h3>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#1A1A1A]/80">
            From the terraces to the streets, Jerseyology celebrates the teams, moments, and
            memories that make sport unforgettable.
          </p>

          <Link
            to="/about"
            className="group mt-8 inline-flex h-12 w-fit items-center gap-2.5 rounded-md border border-[#1A1A1A] bg-transparent px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-[#F3EADB]"
          >
            Our Story
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
