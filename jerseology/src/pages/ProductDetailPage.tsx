import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  RotateCw,
  Ruler,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { CLUBS, PRODUCTS, getClubBySlug, getProductBySlug } from '../data/catalog';
import {
  AVAILABLE_PATCHES,
  OPTION_DELTAS,
  calculateConfiguredUnitPrice,
  formatPrice,
} from '../lib/format';
import { useStore } from '../store/useStore';
import { BrandWordmark } from '../components/BrandWordmark';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { VersionDiffSheet } from '../components/VersionDiffSheet';
import type { ClubDiagonalTheme, KitVersion, SleeveType } from '../types';

function extractMaterialHeadline(fabricSpec: string): string {
  const gsmMatch = fabricSpec.match(/(\d+\s*GSM\s+[A-Za-z-]+(?:\s+[A-Za-z-]+)?)/i);
  if (gsmMatch) return gsmMatch[1];
  const cleaned = fabricSpec.split(/[,.]/)[0].trim();
  return cleaned.length > 28 ? `${cleaned.slice(0, 26)}…` : cleaned;
}

export function ProductDetailPage() {
  const { slug = 'adult-fan-version-jersey' } = useParams();
  const navigate = useNavigate();

  const currentIndex = useMemo(() => {
    const idx = PRODUCTS.findIndex((p) => p.slug === slug);
    return idx >= 0 ? idx : 0;
  }, [slug]);

  const product = getProductBySlug(slug) ?? PRODUCTS[0];
  const club = getClubBySlug(product.clubSlug) ?? CLUBS[0];

  const prevProduct = PRODUCTS[(currentIndex - 1 + PRODUCTS.length) % PRODUCTS.length];
  const nextProduct = PRODUCTS[(currentIndex + 1) % PRODUCTS.length];

  const theme: ClubDiagonalTheme = club?.diagonalTheme ?? {
    leftColor: club?.primaryColor ?? '#9E0040',
    leftColorDeep: club?.secondaryColor ?? '#5E0027',
    centerColor: '#EFEFEF',
    rightColor: club?.secondaryColor ?? '#004D98',
    rightColorDeep: '#09090B',
    leftTextLight: true,
    rightTextLight: true,
  };

  // Store selectors
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setWishlistOpen = useStore((s) => s.setWishlistOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const setShippingModalOpen = useStore((s) => s.setShippingModalOpen);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isWishlisted = wishlist.includes(product.id);

  const galleryShots = useMemo(() => {
    const extras = [
      '/src/assets/images/editorial_stitched_craft_1795090361921.jpg',
      '/src/assets/images/jersey_retro_classic_1795090361760.jpg',
    ];
    const combined = [...product.images];
    for (const img of extras) {
      if (!combined.includes(img) && combined.length < 4) {
        combined.push(img);
      }
    }
    return combined.slice(0, 4);
  }, [product]);

  // Interactive viewer & purchase state
  const [activeShot, setActiveShot] = useState(0);
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [spinMode, setSpinMode] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [draggingSpin, setDraggingSpin] = useState(false);
  const [dragOriginX, setDragOriginX] = useState(0);

  const [version, setVersion] = useState<KitVersion>(product.defaultVersion);
  const [sleeve, setSleeve] = useState<SleeveType>('Short');
  const [size, setSize] = useState<string>(
    product.availableSizes[Math.min(2, product.availableSizes.length - 1)] ?? 'M'
  );
  const [customDrawerOpen, setCustomDrawerOpen] = useState(false);
  const [addName, setAddName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [addNumber, setAddNumber] = useState(false);
  const [customNumber, setCustomNumber] = useState('');
  const [patches, setPatches] = useState<string[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [versionDiffOpen, setVersionDiffOpen] = useState(false);
  const [openDetailTab, setOpenDetailTab] = useState<string | null>('fabric');
  const [justAddedPulse, setJustAddedPulse] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Desktop mouse-follow 3D parallax for floating jersey
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 22 });
  const jerseyRotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const jerseyRotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const jerseyParallaxX = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);
  const jerseyParallaxY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    setActiveShot(0);
    setSpinMode(false);
    setSpinAngle(0);
    setVersion(product.defaultVersion);
    setSleeve('Short');
    setSize(product.availableSizes[Math.min(2, product.availableSizes.length - 1)] ?? 'M');
    setCustomDrawerOpen(false);
    setAddName(false);
    setCustomName('');
    setAddNumber(false);
    setCustomNumber('');
    setPatches([]);
    setMenuOpen(false);
  }, [slug, product]);

  // Keyboard arrow navigation between products
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menuOpen || sizeGuideOpen || versionDiffOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        setNavDirection(1);
        navigate(`/product/${nextProduct.slug}`);
      } else if (e.key === 'ArrowLeft') {
        setNavDirection(-1);
        navigate(`/product/${prevProduct.slug}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    menuOpen,
    sizeGuideOpen,
    versionDiffOpen,
    nextProduct.slug,
    prevProduct.slug,
    navigate,
  ]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current || spinMode) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handleHeroMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const hasNameSet =
    product.allowPersonalisation &&
    ((addName && customName.trim().length > 0) || (addNumber && customNumber.trim().length > 0));

  const unitPriceLkr = calculateConfiguredUnitPrice({
    basePriceLkr: product.priceLkr,
    defaultVersion: product.defaultVersion,
    selectedVersion: version,
    selectedSleeve: product.allowSleeveOption ? sleeve : 'Short',
    hasNameSet,
    patchesCount: product.allowPersonalisation ? patches.length : 0,
  });

  const togglePatch = (label: string) => {
    setPatches((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const buildCartPayload = () => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    clubName: club?.name ?? 'Jerseology Studio',
    image: galleryShots[activeShot] ?? product.images[0],
    version,
    sleeve: product.allowSleeveOption ? sleeve : ('Short' as SleeveType),
    size,
    customName: product.allowPersonalisation && addName ? customName.trim().toUpperCase() : '',
    customNumber: product.allowPersonalisation && addNumber ? customNumber.trim() : '',
    patches: product.allowPersonalisation ? patches : [],
    quantity: 1,
    unitPriceLkr,
  });

  const handleAddToCart = () => {
    addToCart(buildCartPayload());
    setJustAddedPulse(true);
    setTimeout(() => setJustAddedPulse(false), 1100);
  };

  const handleBuyNow = () => {
    addToCart(buildCartPayload());
    setCartOpen(true);
  };

  const goToProduct = (targetSlug: string, dir: 1 | -1) => {
    setNavDirection(dir);
    navigate(`/product/${targetSlug}`);
  };

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const verticalCategoryLabel =
    product.category === 'Retro'
      ? 'RETRO KIT'
      : product.category === 'Jerseys'
        ? `${version.toUpperCase()} KIT`
        : product.category.toUpperCase();

  const conciseMaterial = extractMaterialHeadline(product.fabricSpec);

  const showLiveNameOverlay =
    product.allowPersonalisation && ((addName && customName) || (addNumber && customNumber));

  const pairsWellWith = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          p.id !== product.id &&
          (p.category === 'Shorts' || p.category === 'Socks' || p.category === 'Tracksuits')
      ).slice(0, 4),
    [product.id]
  );

  const youMightLike = useMemo(
    () => PRODUCTS.filter((p) => p.id !== product.id && p.sport === product.sport).slice(0, 4),
    [product.id, product.sport]
  );

  const detailsAccordion = [
    { key: 'fabric', title: 'Fabric & Construction', body: product.fabricSpec },
    { key: 'fit', title: 'Fit & Sizing', body: product.fitSpec },
    { key: 'care', title: 'Garment Care', body: product.careSpec },
    {
      key: 'shipping',
      title: 'Island-Wide Shipping',
      body: 'Same-day Colombo dispatch; 2–3 working days island-wide. Free shipping on orders over 15,000 LKR.',
    },
    {
      key: 'returns',
      title: '7-Day Exchange Guarantee',
      body: 'Unworn, unwashed standard items can be exchanged within 7 days. Custom name-set kits are bespoke final sale.',
    },
  ];

  const isLightLeft = !theme.leftTextLight;
  const isLightRight = !theme.rightTextLight;

  return (
    <div className="bg-[#EFEFEF] text-[#111111]">
      {/* =========================================================
          1. FULL-VIEWPORT CINEMATIC DIAGONAL EDITORIAL SHOWCASE
         ========================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[100svh] lg:h-[100svh] w-full overflow-hidden flex flex-col justify-between transition-colors duration-700"
        style={{ backgroundColor: theme.centerColor }}
      >
        {/* LAYER 0: Subtle Faded Club Territory / Stadium Architectural Map Watermark */}
        {club && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.055]"
          >
            <svg
              viewBox={club.mapViewBox}
              className="h-[72vh] w-[72vh] max-w-[90vw]"
              fill="none"
            >
              <path
                d={club.mapPath}
                stroke="#111111"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        )}

        {/* LAYER 0B: Subtle Editorial Grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#111111 0.85px, transparent 0)',
            backgroundSize: '3px 3px',
          }}
        />

        {/* LAYER 1A: Left Diagonal Club Color Section */}
        <motion.div
          aria-hidden="true"
          initial={{ x: '-16%', opacity: 0.4 }}
          animate={{ x: '0%', opacity: 1 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="pdp-diagonal-left pointer-events-none absolute inset-y-0 left-0 z-0 w-full transition-all duration-700"
          style={{
            background: `linear-gradient(155deg, ${theme.leftColor} 0%, ${theme.leftColorDeep} 100%)`,
          }}
        />

        {/* LAYER 1B: Right Diagonal Club Color Section */}
        <motion.div
          aria-hidden="true"
          initial={{ x: '16%', opacity: 0.4 }}
          animate={{ x: '0%', opacity: 1 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="pdp-diagonal-right pointer-events-none absolute inset-y-0 right-0 z-0 w-full transition-all duration-700"
          style={{
            background: `linear-gradient(200deg, ${theme.rightColor} 0%, ${theme.rightColorDeep} 100%)`,
          }}
        />

        {/* LAYER 2: Enormous Faded Background Club Wordmark (Behind Jersey) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none"
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={club.slug}
              initial={{ opacity: 0, x: navDirection * 65 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: navDirection * -45 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display whitespace-nowrap text-center text-[clamp(4.8rem,15.2vw,14.5rem)] uppercase leading-[0.84] tracking-[-0.025em] text-white/75 drop-shadow-[0_2px_24px_rgba(17,17,17,0.06)]"
            >
              {club.shortWordmark}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* LAYER 3: Minimalist Top Bar (Logo Top-Left + MENU — Top-Right) */}
        <header className="relative z-40 flex items-center justify-between px-5 pt-5 sm:px-9 sm:pt-7 lg:px-12 lg:pt-8">
          <Link
            to="/"
            aria-label="Jerseology Home"
            className="inline-flex items-center transition-opacity hover:opacity-85"
          >
            <BrandWordmark
              className="h-12 w-auto sm:h-14"
              color={isLightLeft ? '#111111' : '#FFFFFF'}
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping bag (${totalCartItems})`}
              className={`relative hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono-label uppercase tracking-[0.18em] transition-opacity hover:opacity-75 ${
                isLightRight ? 'text-[#111111]' : 'text-white'
              }`}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              <span>BAG ({totalCartItems})</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className={`group inline-flex items-center gap-2.5 px-2 py-1 text-xs font-semibold uppercase tracking-[0.22em] transition-opacity hover:opacity-75 ${
                isLightRight ? 'text-[#111111]' : 'text-white'
              }`}
            >
              <span>MENU</span>
              <span
                aria-hidden="true"
                className={`inline-block h-[1.5px] w-6 transition-all duration-300 group-hover:w-9 ${
                  isLightRight ? 'bg-[#111111]' : 'bg-white'
                }`}
              />
            </button>
          </div>
        </header>

        {/* LAYER 3B: Vertical Outer Edge Labels + Left Scroll Indicator */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 sm:left-5 md:block ${
            isLightLeft ? 'text-[#111111]/90' : 'text-white/95'
          }`}
          style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
        >
          <span className="font-display text-sm uppercase tracking-[0.18em] lg:text-base">
            {club.shortWordmark}
          </span>
        </div>

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-3 top-[40%] z-20 hidden -translate-y-1/2 sm:right-5 md:block ${
            isLightRight ? 'text-[#111111]/90' : 'text-white/95'
          }`}
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="font-display text-sm uppercase tracking-[0.18em] lg:text-base">
            {verticalCategoryLabel}
          </span>
        </div>

        {/* Lower-left SCROLL vertical indicator */}
        <button
          type="button"
          onClick={scrollToDetails}
          aria-label="Scroll to full specifications and reviews"
          className={`group absolute bottom-6 left-4 z-30 hidden flex-col items-center gap-2.5 sm:left-6 md:flex ${
            isLightLeft ? 'text-[#111111]/85' : 'text-white/90'
          }`}
        >
          <span
            className="font-mono-label text-[10px] uppercase tracking-[0.26em]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            SCROLL
          </span>
          <motion.span
            animate={{ scaleY: [0.65, 1, 0.65], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className={`block h-10 w-[1.5px] origin-top ${
              isLightLeft ? 'bg-[#111111]/75' : 'bg-white/85'
            }`}
          />
        </button>

        {/* LAYER 4: Main Editorial Composition (Floating Jersey + Club Metadata + Purchase Controls) */}
        <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between px-5 pb-6 pt-2 sm:px-9 lg:px-16 lg:pb-8">
          {/* Upper-Right Compact 2-Column Club Info (Unboxed Editorial Type) */}
          <motion.div
            key={`stats-${product.slug}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="ml-auto mr-0 lg:mr-[14%] xl:mr-[16%] grid grid-cols-2 gap-x-8 gap-y-2.5 pt-1 text-left sm:gap-x-12"
          >
            <div className="space-y-2">
              <div>
                <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#111111]/45">
                  Season
                </p>
                <p className="text-xs sm:text-[13px] font-semibold text-[#111111]">
                  {product.season}
                </p>
              </div>
              <div>
                <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#111111]/45">
                  Club Founded
                </p>
                <p className="text-xs sm:text-[13px] font-semibold text-[#111111]">
                  {club.foundedYear}
                </p>
              </div>
              <div>
                <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#111111]/45">
                  Country
                </p>
                <p className="text-xs sm:text-[13px] font-semibold text-[#111111]">
                  {club.country}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#111111]/45">
                  Drop Date
                </p>
                <p className="text-xs sm:text-[13px] font-semibold text-[#111111]">
                  {club.debutMatch.date}
                </p>
              </div>
              <div>
                <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#111111]/45">
                  Edition
                </p>
                <p className="text-xs sm:text-[13px] font-semibold text-[#111111]">
                  {version} {product.category === 'Jerseys' ? 'Jersey' : product.category}
                </p>
              </div>
              <div>
                <p className="font-mono-label text-[9px] uppercase tracking-[0.16em] text-[#111111]/45">
                  Material
                </p>
                <p className="text-xs sm:text-[13px] font-semibold text-[#111111]">
                  {conciseMaterial}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center Stage: Left-Center Enormous Floating Jersey + Lower Center-Right Purchase Controls */}
          <div className="my-auto grid grid-cols-1 items-center gap-6 py-3 lg:grid-cols-12 lg:items-end lg:gap-6">
            {/* LEFT-CENTER: Enormous Floating Jersey (55–65vh on desktop) */}
            <div className="relative flex flex-col items-center justify-center lg:col-span-6 xl:col-span-6 lg:-mt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${product.slug}-${activeShot}`}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    x: navDirection * 34,
                    y: 16,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    x: navDirection * -34,
                  }}
                  transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    rotateX: spinMode ? 0 : jerseyRotateX,
                    rotateY: spinMode ? 0 : jerseyRotateY,
                    x: spinMode ? 0 : jerseyParallaxX,
                    y: spinMode ? 0 : jerseyParallaxY,
                    transformPerspective: 1100,
                  }}
                  className="relative flex h-[38vh] sm:h-[46vh] lg:h-[58vh] xl:h-[63vh] w-full max-w-[490px] items-center justify-center"
                >
                  {/* Grounded soft ambient shadow beneath floating jersey */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-3 left-1/2 h-10 w-3/5 -translate-x-1/2 rounded-full bg-black/28 blur-2xl"
                  />

                  {spinMode ? (
                    <div
                      className="relative flex h-full w-full cursor-grab items-center justify-center select-none active:cursor-grabbing"
                      onPointerDown={(e) => {
                        setDraggingSpin(true);
                        setDragOriginX(e.clientX);
                      }}
                      onPointerMove={(e) => {
                        if (!draggingSpin) return;
                        const delta = e.clientX - dragOriginX;
                        setDragOriginX(e.clientX);
                        setSpinAngle((a) => (a + delta * 0.9) % 360);
                      }}
                      onPointerUp={() => setDraggingSpin(false)}
                      onPointerLeave={() => setDraggingSpin(false)}
                    >
                      <div
                        className="h-[88%] w-[84%] transition-transform duration-75"
                        style={{
                          transform: `perspective(1000px) rotateY(${spinAngle}deg)`,
                          WebkitMaskImage:
                            'radial-gradient(ellipse 80% 86% at 50% 48%, #000 66%, transparent 100%)',
                          maskImage:
                            'radial-gradient(ellipse 80% 86% at 50% 48%, #000 66%, transparent 100%)',
                        }}
                      >
                        <ResilientImage
                          src={
                            galleryShots[
                              Math.abs(Math.floor(spinAngle / 90)) % galleryShots.length
                            ]
                          }
                          alt={`${product.name} 360 degree view`}
                          className="h-full w-full object-contain drop-shadow-[0_28px_36px_rgba(9,9,11,0.34)]"
                        />
                      </div>
                      <span className="font-mono-label absolute bottom-2 rounded-full bg-[#111111]/85 px-3.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                        Drag to Spin · {Math.round(((spinAngle % 360) + 360) % 360)}°
                      </span>
                    </div>
                  ) : (
                    <motion.div
                      animate={{
                        y: [-6, 6, -6],
                        rotate: [-0.55, 0.55, -0.55],
                      }}
                      transition={{
                        duration: 5.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="relative flex h-full w-full items-center justify-center"
                    >
                      <div
                        className="relative h-full w-full flex items-center justify-center"
                        style={{
                          WebkitMaskImage:
                            'radial-gradient(ellipse 80% 86% at 50% 48%, #000 66%, transparent 99%)',
                          maskImage:
                            'radial-gradient(ellipse 80% 86% at 50% 48%, #000 66%, transparent 99%)',
                        }}
                      >
                        <ResilientImage
                          src={galleryShots[activeShot] ?? product.images[0]}
                          alt={`${club.name} — ${product.name}`}
                          className="h-full w-full object-contain drop-shadow-[0_28px_40px_rgba(9,9,11,0.34)]"
                        />
                      </div>

                      {/* Live Custom Print Preview Overlay */}
                      {showLiveNameOverlay && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
                        >
                          <div className="rounded bg-[#111111]/80 px-5 py-3 backdrop-blur-xs border border-white/15 shadow-xl">
                            <p className="font-mono-label text-[9px] uppercase tracking-[0.22em] text-white/70">
                              Heat-Press Preview
                            </p>
                            {addName && customName && (
                              <p className="mt-1 font-display text-2xl sm:text-3xl uppercase tracking-[0.14em] text-white">
                                {customName}
                              </p>
                            )}
                            {addNumber && customNumber && (
                              <p className="font-display text-5xl sm:text-6xl leading-none text-white">
                                {customNumber}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Subtle 360° Interactive Toggle Pill */}
              <button
                type="button"
                onClick={() => setSpinMode((v) => !v)}
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono-label text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  spinMode
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-[#111111]/20 bg-white/55 text-[#111111]/75 hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                <RotateCw className="h-3 w-3" />
                {spinMode ? 'Exit 360° Spin' : '360° View'}
              </button>
            </div>

            {/* LOWER CENTER-RIGHT: Blended Purchase Controls & Editorial Info (NO White Sidebar) */}
            <motion.div
              key={`info-${product.slug}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-30 mx-auto w-full max-w-[460px] lg:col-span-6 xl:col-span-5 lg:ml-0 lg:mr-auto lg:mb-2"
            >
              {/* Price + Currency + Wishlist */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl sm:text-4xl tracking-tight text-[#111111] tabular-nums">
                    {formatPrice(unitPriceLkr, currency)}
                  </span>
                  {product.compareAtLkr && (
                    <span className="font-mono-label text-xs text-[#111111]/45 line-through tabular-nums">
                      {formatPrice(product.compareAtLkr, currency)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
                    className="font-mono-label rounded border border-[#111111]/20 bg-white/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors hover:border-[#111111]"
                    aria-label="Toggle currency between LKR and USD"
                  >
                    {currency}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={
                      isWishlisted
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    className={`inline-flex h-8 w-8 items-center justify-center rounded border transition-colors ${
                      isWishlisted
                        ? 'border-[#AD2828] bg-[#AD2828] text-white'
                        : 'border-[#111111]/20 bg-white/55 text-[#111111] hover:border-[#AD2828] hover:text-[#AD2828]'
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Club Label + Title + Short Editorial Copy */}
              <div className="mt-2.5">
                <p
                  className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: club.primaryColor }}
                >
                  {club.name} · {product.sku}
                </p>
                <h1 className="mt-0.5 font-display text-2xl sm:text-3xl uppercase leading-[0.96] text-[#111111]">
                  {product.name}
                </h1>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#111111]/72 line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Compact Version & Sleeve Selectors */}
              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#111111]/12 pt-3">
                {product.availableVersions.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {product.availableVersions.map((v) => {
                      const active = version === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setVersion(v)}
                          className={`font-mono-label px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors border ${
                            active
                              ? 'border-[#111111] bg-[#111111] text-white'
                              : 'border-[#111111]/20 bg-white/45 text-[#111111]/80 hover:border-[#111111]'
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setVersionDiffOpen(true)}
                      className="font-mono-label ml-1 text-[10px] uppercase tracking-wider text-[#111111]/55 underline underline-offset-2 hover:text-[#111111]"
                    >
                      Specs?
                    </button>
                  </div>
                )}

                {product.allowSleeveOption && (
                  <div className="flex items-center gap-1">
                    {(['Short', 'Long'] as const).map((slv) => (
                      <button
                        key={slv}
                        type="button"
                        onClick={() => setSleeve(slv)}
                        className={`font-mono-label px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] border transition-colors ${
                          sleeve === slv
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#111111]/20 bg-white/45 text-[#111111]/75 hover:border-[#111111]'
                        }`}
                      >
                        {slv} Sleeve
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Selector Row */}
              <div className="mt-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111]/60">
                    Size — <strong className="text-[#111111]">{size}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.allowPersonalisation && (
                      <button
                        type="button"
                        onClick={() => setCustomDrawerOpen((v) => !v)}
                        className={`inline-flex items-center gap-1 font-mono-label text-[10px] uppercase tracking-[0.12em] transition-colors ${
                          hasNameSet || patches.length > 0
                            ? 'font-semibold text-[#AD2828]'
                            : 'text-[#111111]/70 hover:text-[#111111]'
                        }`}
                      >
                        <SlidersHorizontal className="h-3 w-3" />
                        {customDrawerOpen ? 'Hide Custom' : 'Personalise +'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1 font-mono-label text-[10px] uppercase tracking-[0.12em] text-[#111111]/65 underline underline-offset-2 hover:text-[#111111]"
                    >
                      <Ruler className="h-3 w-3" />
                      Size Guide
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {product.availableSizes.map((s) => {
                    const active = size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`font-mono-label min-w-[44px] px-2.5 py-2 text-[11px] font-semibold uppercase transition-all border ${
                          active
                            ? 'border-[#111111] bg-[#111111] text-white shadow-sm'
                            : 'border-[#111111]/25 bg-white/55 text-[#111111] hover:border-[#111111]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Collapsible Name/Number & Sleeve Patches Panel (Blended Seamlessly) */}
              <AnimatePresence>
                {customDrawerOpen && product.allowPersonalisation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-2.5 border border-[#111111]/15 bg-white/65 p-3 backdrop-blur-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111111]">
                          Player Name &amp; Number (+{formatPrice(OPTION_DELTAS.nameSet, currency)})
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          maxLength={12}
                          value={customName}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setCustomName(val);
                            setAddName(val.trim().length > 0);
                          }}
                          placeholder="NAME"
                          aria-label="Custom player name"
                          className="col-span-2 h-9 border border-[#111111]/20 bg-white px-2.5 font-mono-label text-xs uppercase text-[#111111] placeholder:text-[#111111]/35 focus:border-[#111111] focus:outline-none"
                        />
                        <input
                          type="text"
                          maxLength={2}
                          value={customNumber}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, '').slice(0, 2);
                            setCustomNumber(clean);
                            setAddNumber(clean.length > 0);
                          }}
                          placeholder="NO."
                          aria-label="Custom squad number"
                          className="h-9 border border-[#111111]/20 bg-white px-2.5 text-center font-mono-label text-xs text-[#111111] placeholder:text-[#111111]/35 focus:border-[#111111] focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {AVAILABLE_PATCHES.map((patch) => {
                          const selected = patches.includes(patch.label);
                          return (
                            <button
                              key={patch.id}
                              type="button"
                              onClick={() => togglePatch(patch.label)}
                              className={`font-mono-label inline-flex items-center gap-1 border px-2 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                                selected
                                  ? 'border-[#111111] bg-[#111111] text-white'
                                  : 'border-[#111111]/20 bg-white text-[#111111]/75 hover:border-[#111111]'
                              }`}
                            >
                              {selected && <Check className="h-2.5 w-2.5" />}
                              {patch.badge} (+{formatPrice(patch.priceLkr, currency)})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Primary Purchase CTAs: ADD TO CART + BUY NOW */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="group relative flex h-12 items-center justify-between px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: theme.leftColor }}
                >
                  <span>{justAddedPulse ? 'ADDED TO BAG' : 'ADD TO CART'}</span>
                  {justAddedPulse ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex h-12 items-center justify-center border border-[#111111]/40 bg-white/60 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#111111] backdrop-blur-xs transition-colors hover:bg-[#111111] hover:text-white active:scale-[0.98]"
                >
                  BUY NOW
                </button>
              </div>
            </motion.div>
          </div>

          {/* BOTTOM-RIGHT: Diagonal Editorial Thumbnails + Prev/Next Product Navigation */}
          <div className="relative z-30 flex flex-wrap items-end justify-between gap-4 pt-2 lg:justify-end">
            {/* Mobile scroll button */}
            <button
              type="button"
              onClick={scrollToDetails}
              className="font-mono-label inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#111111]/70 md:hidden"
            >
              <span>Specs &amp; Details</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <div className="ml-auto flex items-end gap-4 sm:gap-6">
              {/* Diagonal-Clipped Editorial Thumbnails */}
              <div className="flex items-center gap-2.5">
                {galleryShots.map((shot, idx) => {
                  const active = !spinMode && activeShot === idx;
                  return (
                    <button
                      key={`${shot}-${idx}`}
                      type="button"
                      onClick={() => {
                        setSpinMode(false);
                        setActiveShot(idx);
                      }}
                      aria-label={`View gallery angle ${idx + 1}`}
                      className={`group relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden transition-all duration-300 ${
                        active
                          ? 'scale-105 ring-2 ring-white shadow-lg'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
                      }}
                    >
                      <ResilientImage
                        src={shot}
                        alt={`${product.name} editorial thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Minimalistic Prev / Next Product Navigation */}
              <div
                className={`flex items-center gap-2.5 border-l pl-4 sm:pl-5 ${
                  isLightRight ? 'border-[#111111]/20 text-[#111111]' : 'border-white/25 text-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => goToProduct(prevProduct.slug, -1)}
                  aria-label={`Previous product: ${prevProduct.name}`}
                  className={`inline-flex h-9 w-9 items-center justify-center border transition-colors ${
                    isLightRight
                      ? 'border-[#111111]/25 hover:bg-[#111111] hover:text-white'
                      : 'border-white/30 bg-black/15 hover:bg-white hover:text-[#111111]'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="font-mono-label text-[11px] tabular-nums tracking-widest opacity-80">
                  {String(currentIndex + 1).padStart(2, '0')}/
                  {String(PRODUCTS.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => goToProduct(nextProduct.slug, 1)}
                  aria-label={`Next product: ${nextProduct.name}`}
                  className={`inline-flex h-9 w-9 items-center justify-center border transition-colors ${
                    isLightRight
                      ? 'border-[#111111]/25 hover:bg-[#111111] hover:text-white'
                      : 'border-white/30 bg-black/15 hover:bg-white hover:text-[#111111]'
                  }`}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. BELOW-THE-FOLD EXTENDED PRODUCT DETAILS & SPECIFICATIONS
         ========================================================= */}
      <div
        id="product-extended-details"
        ref={detailsRef}
        className="border-t border-black/10 bg-[#F3EADB] text-[#111111]"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-9 lg:px-14 lg:py-20">
          {/* Editorial Specs + Match Debut Context */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: Detailed Specifications Accordion */}
            <div className="lg:col-span-7">
              <p
                className="font-mono-label text-xs uppercase tracking-[0.18em]"
                style={{ color: club.primaryColor }}
              >
                Technical Dossier · {product.sku}
              </p>
              <h2 className="mt-1.5 font-display text-3xl sm:text-4xl uppercase text-[#111111]">
                Construction &amp; Policies
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#111111]/75">
                {product.description}
              </p>

              <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
                {detailsAccordion.map((row) => {
                  const isOpen = openDetailTab === row.key;
                  return (
                    <div key={row.key}>
                      <button
                        type="button"
                        onClick={() => setOpenDetailTab(isOpen ? null : row.key)}
                        className="flex w-full items-center justify-between py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#111111]"
                      >
                        <span>{row.title}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <p className="pb-4 text-sm leading-relaxed text-[#111111]/75">{row.body}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Club Debut Match Context */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-black/10 bg-white/75 p-7 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-[#111111]/55">
                    Club Archive Context
                  </span>
                  <Link
                    to={`/club/${club.slug}`}
                    className="font-mono-label text-[11px] font-semibold uppercase tracking-wider underline underline-offset-4"
                    style={{ color: club.primaryColor }}
                  >
                    Visit {club.shortWordmark} Locker →
                  </Link>
                </div>

                <h3 className="mt-3 font-display text-2xl uppercase text-[#111111]">
                  {club.name} — {club.debutMatch.competition}
                </h3>

                <dl className="mt-4 grid grid-cols-2 gap-4 border-y border-black/10 py-4 text-xs">
                  <div>
                    <dt className="font-mono-label text-[10px] uppercase text-[#111111]/50">
                      Stadium
                    </dt>
                    <dd className="mt-0.5 font-semibold text-[#111111]">
                      {club.debutMatch.stadium}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono-label text-[10px] uppercase text-[#111111]/50">
                      Debut Date
                    </dt>
                    <dd className="mt-0.5 font-semibold text-[#111111]">{club.debutMatch.date}</dd>
                  </div>
                  <div>
                    <dt className="font-mono-label text-[10px] uppercase text-[#111111]/50">
                      League
                    </dt>
                    <dd className="mt-0.5 font-semibold text-[#111111]">{club.league}</dd>
                  </div>
                  <div>
                    <dt className="font-mono-label text-[10px] uppercase text-[#111111]/50">
                      Ranking
                    </dt>
                    <dd className="mt-0.5 font-semibold text-[#111111]">{club.worldRanking}</dd>
                  </div>
                </dl>

                <p className="mt-4 text-sm leading-relaxed text-[#111111]/75">
                  {club.debutMatch.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="font-mono-label inline-flex items-center gap-1.5 border border-black/15 bg-[#F3EADB] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#111111] hover:border-[#111111]"
                  >
                    <Ruler className="h-3.5 w-3.5" />
                    Full Size Chart
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingModalOpen(true)}
                    className="font-mono-label inline-flex items-center gap-1.5 border border-black/15 bg-[#F3EADB] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#111111] hover:border-[#111111]"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Delivery Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Customer Reviews (Only renders actual reviews when present) */}
          <section className="mt-18 border-t border-black/10 pt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-[#111111]/55">
                  Supporter Verification
                </p>
                <h2 className="mt-1 font-display text-3xl uppercase text-[#111111]">
                  Customer Reviews ({product.reviews.length})
                </h2>
              </div>
            </div>

            {product.reviews.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {product.reviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white/80 p-6 sm:flex-row"
                  >
                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-[#E7E1D6]">
                      <ResilientImage src={rev.photo} alt={`Review by ${rev.author}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 text-[#AD2828]">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-[#111111]">{rev.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#111111]/75">
                        {rev.comment}
                      </p>
                      <p className="font-mono-label mt-3 text-[11px] uppercase text-[#111111]/55">
                        {rev.author} · {rev.city} · Size {rev.verifiedSize} · {rev.date}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-black/10 bg-white/55 p-6 text-sm text-[#111111]/70">
                New season drop — be the first supporter in Sri Lanka to log fit feedback on the{' '}
                <span className="font-semibold text-[#111111]">{product.name}</span>.
              </div>
            )}
          </section>

          {/* Complete the Kit */}
          {pairsWellWith.length > 0 && (
            <section className="mt-18 border-t border-black/10 pt-14">
              <p
                className="font-mono-label text-xs uppercase tracking-[0.16em]"
                style={{ color: club.primaryColor }}
              >
                Complete the Kit
              </p>
              <h2 className="mt-1 font-display text-3xl uppercase text-[#111111]">
                Pairs Well With
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {pairsWellWith.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          )}

          {/* Related Jerseys */}
          <section className="mt-18 border-t border-black/10 pt-14">
            <h2 className="font-display text-3xl uppercase text-[#111111]">You Might Also Like</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {youMightLike.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* =========================================================
          3. SLEEK FULLSCREEN EDITORIAL NAVIGATION OVERLAY ("MENU —")
         ========================================================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#09090B]/96 p-6 text-white backdrop-blur-md sm:p-10 lg:p-14"
            role="dialog"
            aria-label="Jerseology Editorial Menu"
          >
            {/* Top overlay bar */}
            <div className="flex items-center justify-between">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <BrandWordmark className="h-8 w-auto" color="#C93636" />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white"
              >
                <span>CLOSE</span>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links + Quick Utilities */}
            <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <nav className="flex flex-col gap-3 lg:col-span-7" aria-label="Full Menu">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Our Collection', to: '/collection' },
                  { label: 'Shop All Kits', to: '/collection?view=products' },
                  { label: 'Football Clubs', to: '/collection?sport=Football' },
                  { label: 'Formula 1 Paddock', to: '/collection?sport=F1' },
                  { label: 'About Us', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.35 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="group inline-flex items-baseline gap-4 font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white transition-colors hover:text-[#C93636]"
                    >
                      <span className="font-mono-label text-xs text-white/35">
                        0{idx + 1}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="space-y-6 border-t border-white/10 pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                <p className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-[#C93636]">
                  Quick Locker Access
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="flex items-center gap-2.5 border border-white/15 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#C93636]"
                  >
                    <Search className="h-4 w-4 text-[#C93636]" />
                    Search
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setWishlistOpen(true);
                    }}
                    className="flex items-center gap-2.5 border border-white/15 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#C93636]"
                  >
                    <Heart className="h-4 w-4 text-[#C93636]" />
                    Wishlist ({wishlist.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setCartOpen(true);
                    }}
                    className="flex items-center gap-2.5 border border-white/15 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#C93636]"
                  >
                    <ShoppingBag className="h-4 w-4 text-[#C93636]" />
                    Bag ({totalCartItems})
                  </button>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.18em] text-white/45">
                    Currently Viewing
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/90">
                    {club.name} — {product.name}
                  </p>
                  <p className="mt-1 text-xs text-white/55">{club.editorialNote}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono-label text-[10px] uppercase tracking-[0.2em] text-white/45">
              <span>WEAR WHAT LEGENDS WEAR</span>
              <span>ISLAND-WIDE DELIVERY · LKR / USD</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <VersionDiffSheet open={versionDiffOpen} onClose={() => setVersionDiffOpen(false)} />
    </div>
  );
}
