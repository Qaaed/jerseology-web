import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Panel {
  key: string;
  label: string;
  heading: string;
  description: string;
  image: string;
  to: string;
  bg: string;
  textOnDark: boolean;
  accent: string;
}

const PANELS: Panel[] = [
  {
    key: 'football',
    label: '01 · FOOTBALL',
    heading: 'MATCHDAY. ALL DAY.',
    description:
      'From terrace classics to current-season player-spec jacquards — the heart of the pitch, tailored for every supporter.',
    image: '/src/assets/images/jersey_chelsea_home_1795090361005.jpg',
    to: '/collection?sport=Football',
    bg: '#F3EADB',
    textOnDark: false,
    accent: '#C93636',
  },
  {
    key: 'f1',
    label: '02 · FORMULA 1',
    heading: 'ENGINEERED AT 300 KM/H.',
    description:
      'Team polos, driver editions, and paddock outerwear for the motorsport faithful — built with race-spec technical fabrics.',
    image: '/src/assets/images/sport_f1_racing_1795090361749.jpg',
    to: '/collection?sport=F1',
    bg: '#8BC8B9',
    textOnDark: false,
    accent: '#C93636',
  },
  {
    key: 'grip-socks',
    label: '03 · GRIP SOCKS',
    heading: 'STAY LOCKED IN.',
    description:
      'Silicone traction, compression weave, and anatomical fit — the under-boot advantage trusted by weekend leagues and pro academies.',
    image: '/src/assets/images/kids_kit_accessories_1795090361913.jpg',
    to: '/collection?category=Grip+Socks',
    bg: '#1A1A1A',
    textOnDark: true,
    accent: '#8BC8B9',
  },
];

export function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    if (!mediaQuery.matches) return;

    const panels = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-panel]'));
    if (panels.length === 0) return;

    const ctx = gsap.context(() => {
      panels.forEach((panel, i) => {
        if (i === 0) return;
        gsap.set(panel, { yPercent: 100 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${window.innerHeight * (panels.length - 1)}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.to(panel, { yPercent: 0, ease: 'none' }, i - 1);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Mobile fallback — stacked, no pinning */}
      <div className="lg:hidden">
        {PANELS.map((p) => (
          <ShowcasePanel key={p.key} panel={p} />
        ))}
      </div>

      {/* Desktop pinned stack */}
      <div className="relative hidden h-screen w-full overflow-hidden lg:block">
        {PANELS.map((p, i) => (
          <div
            key={p.key}
            data-panel
            className="absolute inset-0 h-full w-full"
            style={{ zIndex: i + 1 }}
          >
            <ShowcasePanel panel={p} fullHeight />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowcasePanel({ panel, fullHeight = false }: { panel: Panel; fullHeight?: boolean }) {
  const headingColor = panel.textOnDark ? '#FFF9F0' : '#1A1A1A';
  const bodyColor = panel.textOnDark ? 'rgba(255,249,240,0.78)' : 'rgba(26,26,26,0.78)';

  return (
    <section
      className={`relative w-full overflow-hidden ${fullHeight ? 'h-full' : 'min-h-[80vh] py-20'}`}
      style={{ backgroundColor: panel.bg }}
    >
      <div className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
        <div className="lg:col-span-6">
          <p
            className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: panel.accent }}
          >
            {panel.label}
          </p>
          <h2
            className="font-editorial mt-4 uppercase leading-[0.86]"
            style={{ color: headingColor, fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            {panel.heading}
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: bodyColor }}>
            {panel.description}
          </p>

          <Link
            to={panel.to}
            className="group mt-8 inline-flex h-12 items-center gap-2.5 rounded-md px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_22px_rgba(201,54,54,0.3)] transition-all duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: panel.accent === '#8BC8B9' ? '#8BC8B9' : '#C93636', color: panel.accent === '#8BC8B9' ? '#1A1A1A' : '#FFFFFF' }}
          >
            Shop {panel.key === 'f1' ? 'F1' : panel.key === 'grip-socks' ? 'Grip Socks' : 'Football'}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-2xl shadow-[0_30px_70px_rgba(26,26,26,0.28)]">
            <img
              src={panel.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
