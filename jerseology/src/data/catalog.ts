import clubsRaw from './clubs.json';
import productsRaw from './products.json';
import type { AddonItem, Club, Product } from '../types';

export const CLUBS: Club[] = clubsRaw as Club[];
export const PRODUCTS: Product[] = productsRaw as Product[];

export const FEATURED_HOME_CLUBS: Club[] = CLUBS.filter((c) => c.featuredOnHome);

export const ADDON_UPSELLS: AddonItem[] = [
  {
    id: 'addon-long-sleeves',
    title: 'Long Sleeves',
    deltaLkr: 720,
    subtitle: 'Full-length ribbed cuff extension',
    detail: 'Matched fabric weight and club cuff piping across Fan, Player & Retro cuts.',
  },
  {
    id: 'addon-name-set',
    title: 'Name Set',
    deltaLkr: 950,
    subtitle: 'Custom player name + squad number',
    detail: 'Official-font matte polyurethane heat press up to 12 uppercase characters + 0–99.',
  },
  {
    id: 'addon-patches',
    title: 'Patches',
    deltaLkr: 380,
    subtitle: 'Competition sleeve crests',
    detail: 'Champions League Starball, La Liga Domestic Crest, or Club World Cup sleeve badges.',
  },
];

export function getClubBySlug(slug: string): Club | undefined {
  return CLUBS.find((c) => c.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsForClub(clubSlug: string): Product[] {
  const direct = PRODUCTS.filter((p) => p.clubSlug === clubSlug);
  const club = getClubBySlug(clubSlug);
  if (!club) return direct;

  // Ensure every club's "The Full Kit" page showcases a complete matchday wardrobe
  // tailored with the club's accent metadata while preserving exact catalogue pricing
  const extras = PRODUCTS.filter(
    (p) =>
      p.clubSlug !== clubSlug &&
      (p.sport === club.sport || p.category === 'Socks')
  ).slice(0, Math.max(0, 8 - direct.length));

  return [...direct, ...extras];
}
