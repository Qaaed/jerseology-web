import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Club } from '../types';
import { ResilientImage } from './ResilientImage';

interface ClubHeroProps {
  club: Club;
  nextClub?: Club;
  onNextClub?: () => void;
  scrollProgress?: number; // 0..1 for parallax drift on ClubPage
  showExploreButton?: boolean;
}

export function ClubHero({
  club,
  nextClub,
  onNextClub,
  scrollProgress = 0,
  showExploreButton = true,
}: ClubHeroProps) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -ny * 8,
      ry: nx * 10,
    });
  };

  const wordmarkDriftX = -scrollProgress * 45;
  const jerseyScrollRotate = scrollProgress * 6 - 3;

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      className="relative flex min-h-[calc(100vh-88px)] w-full items-stretch overflow-hidden bg-[#F3EADB]"
    >
      {/* Subtle hero film grain */}
      <div className="hero-grain pointer-events-none absolute inset-0 z-10 opacity-45" />

      {/* Split-diagonal tinted colour block on the left half */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[58%] transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${club.tintColor} 0%, ${club.primaryColor}24 100%)`,
          clipPath: 'polygon(0 0, 100% 0, 84% 100%, 0% 100%)',
        }}
      />

      <div className="relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-12 items-center px-4 py-10 sm:px-6 lg:px-10">
        {/* LEFT HALF: Giant half-cropped club wordmark + floating tilted jersey */}
        <div className="relative flex min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] flex-col justify-center lg:col-span-7">
          {/* Oversized half-cropped display wordmark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 sm:-left-8 top-6 sm:top-8 select-none overflow-hidden"
            style={{
              transform: `translate3d(${wordmarkDriftX}px, 0, 0)`,
            }}
          >
            <span
              className="font-display block text-[clamp(4.5rem,11vw,10.5rem)] uppercase leading-[0.86] tracking-tight opacity-18"
              style={{ color: club.primaryColor }}
            >
              {club.shortWordmark}
            </span>
          </div>

          {/* Floating jersey centered & tilted with soft contact shadow */}
          <div className="relative mx-auto flex flex-col items-center justify-center py-6">
            <motion.div
              animate={{
                rotateX: tilt.rx,
                rotateY: tilt.ry,
                rotateZ: jerseyScrollRotate,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              style={{ transformPerspective: 900 }}
              className="relative z-10 w-[240px] sm:w-[300px] lg:w-[340px]"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_28px_50px_rgba(11,27,58,0.22)]">
                <ResilientImage
                  src={club.heroImage}
                  alt={`${club.name} 2026/27 Home Kit`}
                  className="h-full w-full object-cover"
                  fallbackBg={club.tintColor}
                />
              </div>
            </motion.div>

            {/* Soft contact shadow beneath floating jersey */}
            <div
              aria-hidden="true"
              className="mt-4 h-4 w-48 rounded-full blur-md opacity-35"
              style={{ backgroundColor: club.secondaryColor }}
            />
          </div>

          {/* Vertical mono label bottom-left */}
          <div className="mt-2 flex items-center gap-4 lg:absolute lg:bottom-4 lg:left-0">
            <span className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[#111111]/65 lg:[writing-mode:vertical-rl] lg:rotate-180">
              2026 / 27 HOME KIT JERSEY
            </span>
          </div>
        </div>

        {/* RIGHT HALF: Faint outlined country map, metadata chips, debut match & next-club teaser */}
        <div className="relative flex flex-col justify-between gap-8 py-4 lg:col-span-5 lg:pl-8">
          {/* Outlined country/city silhouette SVG */}
          <div className="pointer-events-none absolute right-2 top-0 opacity-12 sm:opacity-18">
            <svg
              viewBox={club.mapViewBox}
              className="h-44 w-44 sm:h-56 sm:w-56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d={club.mapPath}
                stroke="#111111"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
              <circle cx="62" cy="64" r="3.5" fill="#AD2828" />
            </svg>
          </div>

          <div className="relative z-10">
            <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#AD2828]">
              {club.sport} · {club.league}
            </p>
            <h1 className="mt-2 font-display text-[clamp(2.5rem,4.8vw,4.25rem)] uppercase leading-[0.94] text-[#111111] text-balance">
              {club.name}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#111111]/75">
              {club.editorialNote}
            </p>

            {/* Unboxed typographic metadata strip */}
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-black/10 py-4 sm:grid-cols-4">
              <div>
                <dt className="font-mono-label text-[10px] uppercase tracking-wider text-[#111111]/50">
                  Ranking
                </dt>
                <dd className="mt-1 font-mono-label text-xs font-semibold text-[#111111]">
                  {club.worldRanking}
                </dd>
              </div>
              <div>
                <dt className="font-mono-label text-[10px] uppercase tracking-wider text-[#111111]/50">
                  Founded
                </dt>
                <dd className="mt-1 font-mono-label text-xs font-semibold tabular-nums text-[#111111]">
                  {club.foundedYear}
                </dd>
              </div>
              <div>
                <dt className="font-mono-label text-[10px] uppercase tracking-wider text-[#111111]/50">
                  City
                </dt>
                <dd className="mt-1 font-mono-label text-xs font-semibold text-[#111111]">
                  {club.city}
                </dd>
              </div>
              <div>
                <dt className="font-mono-label text-[10px] uppercase tracking-wider text-[#111111]/50">
                  Country
                </dt>
                <dd className="mt-1 font-mono-label text-xs font-semibold text-[#111111]">
                  {club.country}
                </dd>
              </div>
            </dl>

            {/* Kit Debut Match highlight */}
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-black/10 bg-white/65 p-4 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#111111]/50">
                  Kit Debut · {club.debutMatch.date} · {club.debutMatch.stadium}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#111111]">
                  vs {club.debutMatch.opponent}{' '}
                  <span className="font-mono-label text-[#AD2828]">({club.debutMatch.score})</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#111111]/20 bg-white px-3 text-xs font-semibold text-[#111111] hover:border-[#AD2828] hover:text-[#AD2828] transition-colors whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Kit Review
              </button>
            </div>

            {showExploreButton && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={`/club/${club.slug}`}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-[#111111] px-6 text-xs font-semibold uppercase tracking-wider text-[#F3EADB] hover:bg-[#AD2828] transition-colors"
                >
                  Shop {club.shortWordmark} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/collection"
                  className="inline-flex h-12 items-center rounded-md border border-black/20 px-5 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:bg-black/5 transition-colors"
                >
                  Full Index
                </Link>
              </div>
            )}
          </div>

          {/* Next club teaser peeking from right edge */}
          {nextClub && (
            <div className="mt-4 flex justify-end">
              {onNextClub ? (
                <button
                  type="button"
                  onClick={onNextClub}
                  className="group flex items-center gap-3 rounded-l-xl border border-r-0 border-black/10 bg-white/80 py-2.5 pl-3 pr-5 text-left shadow-sm backdrop-blur-xs transition-transform hover:-translate-x-1"
                >
                  <div className="h-12 w-10 overflow-hidden rounded bg-[#E7E1D6]">
                    <ResilientImage src={nextClub.heroImage} alt={nextClub.name} />
                  </div>
                  <div>
                    <span className="font-mono-label block text-[10px] uppercase tracking-wider text-[#111111]/50">
                      Next Club
                    </span>
                    <span className="font-display text-lg uppercase leading-none text-[#111111] group-hover:text-[#AD2828]">
                      {nextClub.shortWordmark} →
                    </span>
                  </div>
                </button>
              ) : (
                <Link
                  to={`/club/${nextClub.slug}`}
                  className="group flex items-center gap-3 rounded-l-xl border border-r-0 border-black/10 bg-white/80 py-2.5 pl-3 pr-5 text-left shadow-sm backdrop-blur-xs transition-transform hover:-translate-x-1"
                >
                  <div className="h-12 w-10 overflow-hidden rounded bg-[#E7E1D6]">
                    <ResilientImage src={nextClub.heroImage} alt={nextClub.name} />
                  </div>
                  <div>
                    <span className="font-mono-label block text-[10px] uppercase tracking-wider text-[#111111]/50">
                      Next Club
                    </span>
                    <span className="font-display text-lg uppercase leading-none text-[#111111] group-hover:text-[#AD2828]">
                      {nextClub.shortWordmark} →
                    </span>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Kit Debut Video Review Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-[#111111] text-[#F3EADB] shadow-2xl"
              role="dialog"
              aria-label={`${club.name} Kit Debut Review`}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="font-mono-label text-[10px] uppercase tracking-wider text-[#AD2828]">
                    Matchday Kit Review · {club.debutMatch.competition}
                  </p>
                  <h3 className="font-display text-xl uppercase">
                    {club.name} vs {club.debutMatch.opponent}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  aria-label="Close kit review"
                  className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative aspect-video bg-black">
                <ResilientImage
                  src={club.heroImage}
                  alt={club.name}
                  className="h-full w-full object-cover opacity-55"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6">
                  <span className="font-mono-label text-xs text-[#AD2828]">
                    FINAL SCORE: {club.debutMatch.score} · {club.debutMatch.stadium}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-[#F3EADB]/85">
                    {club.debutMatch.summary}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
