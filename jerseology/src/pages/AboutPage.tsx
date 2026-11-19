import { MapPin } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';

const CHAPTERS = [
  {
    num: '01',
    title: 'Origin',
    subtitle: 'Two friends, one heat-press printer, and Colombo floodlights.',
    copy: 'Jerseology began in 2022 out of a shared frustration: authentic-feeling football kits were either overpriced imports or flimsy polyester knockoffs. With one commercial sublimation unit and an obsession for 1990s terrace tailoring, we started crafting small-batch kits for Colombo Sunday leagues.',
    quote: 'Every shirt carries the noise of a Friday night kick-off.',
    image: '/src/assets/images/editorial_stitched_craft_1795090361921.jpg',
  },
  {
    num: '02',
    title: 'Craft',
    subtitle: 'Sublimation precision, fabric weight discipline, zero shortcuts.',
    copy: 'We source 135 GSM body-mapped jacquards for Player cuts, 165 GSM interlock for Fan fits, and 210 GSM poly-cotton knits for Retro reissues. Every crest alignment, collar rib tension, and polyurethane name-set press is inspected under studio lamps before dispatch.',
    quote: 'Weight and drape separate a costume from a kit.',
    image: '/src/assets/images/jersey_retro_classic_1795090361760.jpg',
  },
  {
    num: '03',
    title: 'Clubs & Culture',
    subtitle: 'Football terraces meet Formula 1 paddocks.',
    copy: 'Sport culture in Sri Lanka does not stop at 90 minutes. Our shelves carry Scuderia Ferrari and McLaren paddock jackets alongside heritage European football kits and archival retro reissues.',
    quote: 'Built for the touchline, styled for Ward Place.',
    image: '/src/assets/images/sport_f1_racing_1795090361749.jpg',
  },
  {
    num: '04',
    title: 'Promise',
    subtitle: 'Island-wide delivery, 7-day exchanges, and bespoke team runs.',
    copy: 'From Jaffna to Matara, orders ship tracked within 24–48 hours with Cash on Delivery or Card. Standard kits qualify for a 7-day size exchange, and our bespoke studio quotes custom squad concepts within 48 hours.',
    quote: 'Wear What Legends Wear — wherever you play.',
    image: '/src/assets/images/home_atelier_press_1795090987514.jpg',
  },
];

const TEAM = [
  { name: 'Zayd Mansoor', role: 'Co-Founder & Creative Director', city: 'Colombo 07' },
  { name: 'Tharindu Silva', role: 'Co-Founder & Production Lead', city: 'Nawala Studio' },
  { name: 'Nethmi Jayawardena', role: 'Pattern & Textile Specialist', city: 'Colombo 05' },
  { name: 'Akeel Sheriff', role: 'Custom Squads & Client Care', city: 'Dehiwala' },
];

export function AboutPage() {
  return (
    <div>
      {/* Full-bleed B&W Hero */}
      <section className="relative flex min-h-[76vh] items-end overflow-hidden bg-[#111111] text-[#F3EADB]">
        <ResilientImage
          src="/src/assets/images/editorial_stitched_craft_1795090361921.jpg"
          alt="Tailored jersey embroidery craft"
          className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale"
        />
        <div className="hero-grain pointer-events-none absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/45 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[#AD2828]">
            Colombo Editorial Studio · Est. 2022
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.75rem,6vw,5.5rem)] uppercase leading-[0.92] text-balance">
            We don&apos;t sell shirts. We stitch stories.
          </h1>
        </div>
      </section>

      {/* Four Horizontally-Scrolling Chapters */}
      <section id="chapters" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-2 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#AD2828]">
              Scroll Horizontally
            </p>
            <h2 className="mt-1 font-display text-4xl uppercase text-[#111111]">
              Four Chapters of Jerseology
            </h2>
          </div>
          <span className="font-mono-label text-xs text-[#111111]/55">01 — 04</span>
        </div>

        <div className="mt-10 flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
          {CHAPTERS.map((ch) => (
            <article
              key={ch.num}
              className="flex w-[88vw] max-w-[540px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#111111]">
                <ResilientImage
                  src={ch.image}
                  alt={ch.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="font-mono-label text-xs font-semibold uppercase tracking-[0.18em] text-[#AD2828]">
                    Chapter {ch.num}
                  </span>
                  <h3 className="mt-1 font-display text-3xl uppercase text-[#111111]">
                    {ch.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#111111]/85">{ch.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#111111]/70">{ch.copy}</p>
                </div>

                <blockquote className="mt-6 border-t border-black/10 pt-4 font-display text-xl uppercase leading-tight text-[#0B1B3A]">
                  &ldquo;{ch.quote}&rdquo;
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Team Grid in Muted Duotone */}
      <section className="bg-[#E7E1D6]/50 py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <p className="font-mono-label text-xs uppercase tracking-[0.18em] text-[#AD2828]">
            The Studio Bench
          </p>
          <h2 className="mt-1 font-display text-4xl uppercase text-[#111111]">
            People Behind the Press
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="overflow-hidden rounded-xl border border-black/10 bg-white p-5"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#0B1B3A]">
                  <ResilientImage
                    src="/src/assets/images/editorial_stitched_craft_1795090361921.jpg"
                    alt={member.name}
                    className="h-full w-full object-cover grayscale contrast-125 opacity-80"
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl uppercase text-[#111111]">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#111111]/75">{member.role}</p>
                <p className="font-mono-label mt-1 text-[11px] uppercase text-[#AD2828]">
                  {member.city}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us Colombo Block */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 items-stretch gap-8 overflow-hidden rounded-2xl border border-black/10 bg-[#111111] text-[#F3EADB] lg:grid-cols-12">
          <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-6">
            <div>
              <p className="font-mono-label inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#AD2828]">
                <MapPin className="h-3.5 w-3.5" /> Visit Us · Flagship Fitting Room
              </p>
              <h2 className="mt-2 font-display text-4xl uppercase leading-none">
                No. 24 Ward Place, Colombo 07
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#F3EADB]/75">
                Try on Fan vs Player fits in person, inspect archival retro jacquards, or bring your squad captain to review colour swatches for custom runs.
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 text-xs">
              <div>
                <dt className="font-mono-label uppercase text-[#F3EADB]/50">Studio Hours</dt>
                <dd className="mt-1 font-medium">Tue – Sun · 10:30 AM – 8:00 PM</dd>
              </div>
              <div>
                <dt className="font-mono-label uppercase text-[#F3EADB]/50">Direct Line</dt>
                <dd className="mt-1 font-mono-label">+94 77 123 4567</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-h-[280px] bg-[#0B1B3A] lg:col-span-6">
            <ResilientImage
              src="/src/assets/images/home_atelier_press_1795090987514.jpg"
              alt="Jerseology Colombo Flagship Studio"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="font-mono-label absolute bottom-4 right-4 rounded bg-[#111111]/90 px-4 py-2 text-[11px] uppercase tracking-wider text-[#F3EADB]">
              6.9147° N, 79.8659° E · Cinnamon Gardens
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
