import { useEffect, useRef, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ResilientImage } from '../ResilientImage';

const CATEGORY_LABELS = [
  { label: 'FOOTBALL', to: '/collection?sport=Football' },
  { label: 'F1', to: '/collection?sport=F1' },
  { label: 'ACCESSORIES', to: '/collection?category=Grip+Socks' },
];

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 20 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 20 });

  const footballX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const footballY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);
  const footballRotate = useTransform(smoothX, [-0.5, 0.5], [-10, -4]);
  const f1X = useTransform(smoothX, [-0.5, 0.5], [12, -12]);
  const f1Y = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const f1Rotate = useTransform(smoothX, [-0.5, 0.5], [10, 4]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  useEffect(() => {
    // Hint reduced motion users to skip pointer parallax (motion already respects it via MotionConfig)
  }, []);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate w-full overflow-hidden bg-[#F3EADB]"
    >
      {/* LAYER 1 — cream base already on section. */}

      {/* LAYER 2 — soft mint gradient filling right 55% */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[60%] bg-gradient-to-l from-[#8BC8B9] via-[#8BC8B9]/55 to-transparent"
      />

      {/* LAYER 3 — oversized diagonal red stripe cutting through the center-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] top-1/2 h-[180%] w-[36%] -translate-y-1/2 rotate-[22deg] bg-gradient-to-b from-[#C93636] via-[#C93636] to-[#AD2828] opacity-95 shadow-[0_30px_80px_rgba(201,54,54,0.28)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[6%] top-1/2 h-[180%] w-[6%] -translate-y-1/2 rotate-[22deg] bg-[#AD2828]/80"
      />

      {/* LAYER 4 — subtle faded football silhouette on the left */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -left-24 -top-24 h-[480px] w-[480px] text-[#1A1A1A]/[0.035]"
        fill="currentColor"
      >
        <circle cx="200" cy="200" r="195" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M200 20 L240 100 L320 120 L260 180 L280 260 L200 220 L120 260 L140 180 L80 120 L160 100 Z" />
      </svg>

      {/* LAYER 5 — subtle stadium architecture lines on bottom right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 200"
        className="pointer-events-none absolute bottom-0 right-[8%] h-32 w-[520px] text-[#1A1A1A]/[0.07]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0 180 L100 110 L200 140 L300 90 L400 130 L500 70 L600 110 L600 200 L0 200 Z" />
        <path d="M60 180 L60 130 M120 180 L120 150 M180 180 L180 140 M240 180 L240 120 M300 180 L300 110 M360 180 L360 130 M420 180 L420 120 M480 180 L480 100 M540 180 L540 130" />
      </svg>

      {/* LAYER 6 — subtle vintage grain */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
      />

      {/* CONTENT GRID */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-130px)] w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-16">
        {/* LEFT — Typography */}
        <div className="relative lg:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.5em] text-[#C93636]"
          >
            J E R S E Y O L O G Y
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial mt-5 uppercase leading-[0.82] text-balance"
            style={{ fontSize: 'clamp(3.75rem, 10vw, 9rem)' }}
          >
            <span className="block text-[#1A1A1A]">Wear The</span>
            <span className="block text-[#C93636]">Culture</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex max-w-xl items-start gap-4"
          >
            <span aria-hidden="true" className="mt-1 h-10 w-[3px] bg-[#C93636]" />
            <p className="text-[15px] leading-relaxed text-[#1A1A1A]/80">
              Curated football jerseys, F1 jerseys, and accessories for fans who live the sport,
              on and off the pitch.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <Link
              to="/collection?sport=Football"
              className="group inline-flex h-12 items-center gap-2.5 rounded-md bg-[#C93636] px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_rgba(201,54,54,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#AD2828] hover:shadow-[0_10px_26px_rgba(201,54,54,0.4)]"
            >
              Shop Jerseys
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/collection"
              className="group inline-flex h-12 items-center gap-2 rounded-md border border-[#1A1A1A]/70 bg-transparent px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-[#F3EADB]"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — Floating jerseys composition */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px]">
            {/* F1 jersey — behind, right-biased */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, rotate: 8, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-[8%] z-10 w-[62%]"
            >
              <motion.div
                style={{ x: f1X, y: f1Y, rotate: f1Rotate }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative overflow-hidden rounded-xl shadow-[0_28px_60px_rgba(26,26,26,0.28)] ring-1 ring-[#1A1A1A]/10"
                >
                  <ResilientImage
                    src="/src/assets/images/sport_f1_racing_1795090361749.jpg"
                    alt="Formula 1 team jersey"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </motion.div>
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 -z-10 rounded-[20px] bg-[#8BC8B9]/50 blur-xl"
                />
              </motion.div>
            </motion.div>

            {/* Football jersey — forward, left-biased, slightly larger */}
            <motion.div
              initial={{ opacity: 0, x: -40, rotate: -14, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, rotate: -8, scale: 1 }}
              transition={{ duration: 0.95, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-[2%] z-20 w-[68%]"
            >
              <motion.div
                style={{ x: footballX, y: footballY, rotate: footballRotate }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative overflow-hidden rounded-xl shadow-[0_32px_70px_rgba(26,26,26,0.32)] ring-1 ring-[#1A1A1A]/10"
                >
                  <ResilientImage
                    src="/src/assets/images/jersey_barcelona_home_1795090361145.jpg"
                    alt="Classic football jersey"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </motion.div>
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 -z-10 rounded-[22px] bg-[#F3EADB]/70 blur-xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT EDGE — vertical category labels */}
        <nav
          aria-label="Hero category shortcuts"
          className="pointer-events-none absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-6 md:right-4 md:flex lg:right-6"
        >
          {CATEGORY_LABELS.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="pointer-events-auto group flex items-center gap-2 font-mono-label text-[10px] font-semibold uppercase tracking-[0.3em] text-white/95 hover:text-white"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              <span>{cat.label}</span>
              <span
                aria-hidden="true"
                className="h-[2px] w-6 bg-white/80 transition-all duration-300 group-hover:w-10 group-hover:bg-white"
              />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
